// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
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

    return new Response(
      JSON.stringify({
        status: "success",
        message: `Session ${status_field} updated to ${status_value}.`,
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
