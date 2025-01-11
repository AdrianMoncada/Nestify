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
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ status: "error", message: "Method not allowed. Use POST." }),
        { status: 405 }
      );
    }

    const { session_id } = await req.json();

    // Fetch session details
    const { data: session, error: sessionError } = await supabase
      .from("session")
      .select("*")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      throw new Error("Session not found or invalid.");
    }

    // from here

    const { user_id } = session;

    // Fetch the correct specie_id from user_specie_collection
    const { data: userSpecie, error: userSpecieError } = await supabase
      .from("user_specie_collection")
      .select("specie_id")
      .eq("user_id", user_id)
      .single();

    if (userSpecieError || !userSpecie) {
  throw new Error("User species collection not found or invalid.");
    }

    const { specie_id } = userSpecie;

    // to here



    // Fetch species details
    const { data: species, error: speciesError } = await supabase
      .from("species")
      .select("*")
      .eq("id", specie_id)
      .single();

    if (speciesError || !species) {
      throw new Error("Species not found or invalid.");
    }

    // Fetch ecosystem details
    const { data: ecosystem, error: ecosystemError } = await supabase
      .from("ecosystem")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (ecosystemError || !ecosystem) {
      throw new Error("Ecosystem not found or invalid.");
    }

    // Calculate outcomes for "build" action
    let outcomes = {};
    if (action === "build") {
      outcomes = {
        resources_spent: 1,
        feathers_spent: 0,
        nests_created: 1,
        population_increase: 0,
        max_population_increase: 5 + species.nesting_skill, // Base + skill
        resources_gained: 0,
        feathers_gained: 0,
        species_unlocked: null,
      };

      // Ensure user has enough resources
      if (ecosystem.resources < outcomes.resources_spent) {
        throw new Error("Not enough resources to complete build action.");
      }
    } else {
      throw new Error(`Action type "${action}" not supported yet.`);
    }

    // Insert session outcomes
    const { error: insertError } = await supabase.rpc("calculate_session_outcome", {
      p_session_id: session_id,
      p_user_id: user_id,
      p_action: action,
      ...outcomes,
    });

    if (insertError) {
      throw new Error(`Failed to insert session outcomes: ${insertError.message}`);
    }

    // Apply outcomes to ecosystem
    const { error: updateError } = await supabase.rpc("apply_outcomes_to_ecosystem", {
      p_user_id: user_id,
      ...outcomes,
    });

    if (updateError) {
      throw new Error(`Failed to update ecosystem: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ status: "success", message: "Session outcomes processed successfully." }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/handle_session_outcomes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
