import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Ecosystem = {
  id: string;
  created_at: string;
  user_id: string;
  // Add other ecosystem fields as needed
};

export type UserData = {
  ecosystem: Ecosystem;
  user: {
    id: string;
    email: string | undefined;
    // Add other user fields that you need
  };
};

export async function getUserData(): Promise<UserData | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: ecosystem, error: ecosystemError } = await supabase
    .from('ecosystem')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (ecosystemError) {
    console.error('Error fetching ecosystem:', ecosystemError);
    return null;
  }

  return {
    ecosystem: ecosystem as Ecosystem,
    user: {
      id: user.id,
      email: user.email,
      // Add other user fields you need
    }
  };
}