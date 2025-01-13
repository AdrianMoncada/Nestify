import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  if (req.method !== "PATCH") {
    return new Response(
      JSON.stringify({ status: "error", message: "Method not allowed. Use PATCH." }),
      { status: 405 }
    );
  }

  try {
    const { session_id, status_field, status_value } = await req.json();

    // Validate status_field to prevent invalid column names
    if (!["completed", "cancelled"].includes(status_field)) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid status field. Use 'completed' or 'cancelled'.",
        }),
        { status: 400 }
      );
    }

    // Call the RPC to update the session status
    const { data, error } = await supabase.rpc("update_session_status", {
      p_session_id: session_id,
      p_status_field: status_field,
      p_status_value: status_value,
    });

    if (error) {
      return new Response(
        JSON.stringify({ status: "error", message: error.message }),
        { status: 400 }
      );
    }

    if (!data || data === false) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: `Session could not be updated. It may already be ${status_field} or invalid.`,
        }),
        { status: 400 }
      );
    }

    let sessionOutcomes = null;
    let updatedEcosystem = null;

    // Only process outcomes if completing the session
    if (status_field === "completed" && status_value === true) {
      const response = await fetch(`${supabaseUrl}/functions/v1/handle_session_outcomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ session_id }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        return new Response(
          JSON.stringify({
            status: "error",
            message: `Failed to process session outcomes: ${errorBody.message || response.statusText}`,
          }),
          { status: 400 }
        );
      }

      const responseBody = await response.json();
      sessionOutcomes = responseBody.session_outcomes;
      updatedEcosystem = responseBody.updated_ecosystem;
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Session status updated successfully.",
        session_outcomes: sessionOutcomes,
        updated_ecosystem: updatedEcosystem,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 400 }
    );
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update_session_status' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
