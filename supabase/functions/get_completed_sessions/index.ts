import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ status: "error", message: "Method not allowed. Use GET." }),
      { status: 405 }
    );
  }

  try {
    // Parse the URL to get the user_id parameter
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    
    // Validate user_id
    if (!user_id) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Missing required parameter: user_id",
        }),
        { status: 400 }
      );
    }

    // Validate auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Authentication required",
        }),
        { status: 401 }
      );
    }

    // Query to get completed sessions with bird name for the specific user
    const { data, error } = await supabase
      .from("session")
      .select(`
        id,
        action,
        duration,
        start_time,
        species:specie_id (name)
      `)
      .eq("completed", true)
      .eq("user_id", user_id)
      .order("start_time", { ascending: false });
    
    if (error) {
      return new Response(
        JSON.stringify({ status: "error", message: error.message }),
        { status: 400 }
      );
    }
    
    // Format the data for the response
    const formattedSessions = data.map(session => {
      return {
        id: session.id,
        bird_name: session.species.name,
        action: session.action,
        duration: session.duration,
        date: new Date(session.start_time).toISOString().split("T")[0]
      };
    });
    
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Completed sessions retrieved successfully",
        sessions: formattedSessions
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 400 }
    );
  }
});