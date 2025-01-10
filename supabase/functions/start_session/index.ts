import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Start Session Function!");

// Utility function to fetch ecosystem data
async function fetchEcosystem(user_id: string) {
  const { data, error } = await supabase
    .from('ecosystem')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error) throw new Error(`Error fetching ecosystem: ${error.message}`);
  return data;
}

// Validation functions
async function validateHatch(ecosystem: any) {
  if (ecosystem.feathers < 1) throw new Error("Not enough feathers to hatch.");
  if (ecosystem.population >= ecosystem.max_population) throw new Error("Population limit reached.");
}

async function validateBuild(ecosystem: any) {
  if (ecosystem.resources < 1) throw new Error("Not enough resources to build.");
}

async function validateAction(user_id: string, action: string) {
  const ecosystem = await fetchEcosystem(user_id);

  if (action === "hatch") {
    await validateHatch(ecosystem);
  } else if (action === "build") {
    await validateBuild(ecosystem);
  }
  // No validation needed for "gather"
}

Deno.serve(async (req) => {
  try {
    const { user_id, specie_id, action, duration, completed, cancelled } = await req.json();

    // Validate action
    await validateAction(user_id, action);

    // Call start_session RPC if validation passes
    const { data, error } = await supabase
      .rpc('start_session', {
        p_user_id: user_id,
        p_specie_id: specie_id,
        p_action: action,
        p_duration: duration,
        p_completed: completed,
        p_cancelled: cancelled
      });

    if (error) {
      console.error("RPC error:", error);
      return new Response(
        JSON.stringify({ status: 'error', message: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Session started successfully.',
        session: {
          id: data[0].session_id || "unknown", // Ensure `data` contains `session_id` field
          action,
          duration
        }
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ status: 'error', message: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/start_session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
