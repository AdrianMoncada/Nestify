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
      //.select("*")
      .select("user_id, specie_id, action")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      throw new Error("Session not found or invalid.");
    }

    const { user_id, specie_id: userSpecieId, action } = session;

    // Fetch the correct specie_id from user_specie_collection
    const { data: userSpecie, error: userSpecieError } = await supabase
      .from("user_specie_collection")
      .select("specie_id")
      .eq("id", userSpecieId)
      .single();

    if (userSpecieError || !userSpecie) {
  throw new Error("User species collection not found or invalid.");
    }

    const { specie_id } = userSpecie;

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

    let outcomes = {
      resources_spent: 0,
      feathers_spent: 0,
      nests_created: 0,
      population_increase: 0,
      max_population_increase: 0,
      resources_gained: 0,
      feathers_gained: 0,
      species_unlocked: null,
    };

    switch (action) {
      case "build":
        if (ecosystem.resources < 1) {
          throw new Error("Not enough resources to complete build action.");
        }
        outcomes.resources_spent = 1;
        outcomes.nests_created = 1;
        outcomes.max_population_increase = 5 + species.nesting_skill;
        break;
    
      case "hatch":
        if (ecosystem.feathers < 1) {
          throw new Error("Not enough feathers to complete hatch action.");
        }
        outcomes.feathers_spent = 1;
        outcomes.population_increase = 1;
        // Generate a random value between 1 and 10.
        const randomValue = Math.floor(Math.random() * 10) + 1;

        if (randomValue <= 2) {
      const { data: speciesList, error: speciesError } = await supabase.rpc('get_species_not_in_collection', {
        p_user_id: user_id
      });

      if (speciesError) {
        console.error('Error fetching species:', speciesError);
      } else {
        // Select a random specie from the list
        if (speciesList.length > 0) {
          const randomIndex = Math.floor(Math.random() * speciesList.length);
          const selectedSpecie = speciesList[randomIndex];

          // Call table function unlock_specie_to_user based on the selected specie
          const { data, error } = await supabase.rpc('unlock_specie_to_user', {
            p_user_id: user_id,
            p_specie_id: selectedSpecie.id
          });

          if (error) {
            console.error('Error unlocking specie:', error);
          } else {
            console.log('Specie unlocked successfully:', data);
            outcomes.species_unlocked = selectedSpecie.name; // Store the name of the unlocked species
          }
        } else {
          console.log('No species available to unlock.');
        }
      }
    }

    break;
    
      case "gather":
        outcomes.resources_gained = 1 + species.gathering_skill;
        outcomes.feathers_gained = 1 + species.scouting_skill;
        break;
    
      default:
        throw new Error(`Action type "${action}" not supported yet.`);
    }    

    // Insert session outcomes
    const { error: insertError } = await supabase.rpc("calculate_session_outcome", {
      p_session_id: session_id,
      p_user_id: user_id,
      p_action: action,
      p_resources_spent: outcomes.resources_spent,
      p_feathers_spent: outcomes.feathers_spent,
      p_nests_created: outcomes.nests_created,
      p_population_increase: outcomes.population_increase,
      p_max_population_increase: outcomes.max_population_increase,
      p_resources_gained: outcomes.resources_gained,
      p_feathers_gained: outcomes.feathers_gained,
      p_species_unlocked: outcomes.species_unlocked,
    });

    if (insertError) {
      throw new Error(`Failed to insert session outcomes: ${insertError.message}`);
    }

    // Apply outcomes to ecosystem
    const { error: updateError } = await supabase.rpc("apply_outcomes_to_ecosystem", {
      p_user_id: user_id,
      p_resources_spent: outcomes.resources_spent,
      p_feathers_spent: outcomes.feathers_spent,
      p_nests_created: outcomes.nests_created,
      p_population_increase: outcomes.population_increase,
      p_max_population_increase: outcomes.max_population_increase,
      p_resources_gained: outcomes.resources_gained,
      p_feathers_gained: outcomes.feathers_gained,
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
