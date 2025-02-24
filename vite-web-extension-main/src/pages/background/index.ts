import { createClient } from '@supabase/supabase-js';

console.log("index.ts is working");

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

console.log("supabase create client passed")
const redirectURL = chrome.identity.getRedirectURL();
console.log("OAuth Redirect URL:", redirectURL);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url?.startsWith(chrome.identity.getRedirectURL())) {
    console.log('OAuth callback URL detected:', changeInfo.url);
    finishUserOAuth(changeInfo.url);
  }
});

async function finishUserOAuth(url: string) {
  try {
    console.log('Starting OAuth callback handling...');
    const hashMap = parseUrlHash(url);
    console.log('Parsed URL hash params:', Object.fromEntries(hashMap));
    
    const access_token = hashMap.get('access_token');
    const refresh_token = hashMap.get('refresh_token');

    if (!access_token || !refresh_token) {
      throw new Error('No Supabase tokens found in URL hash');
    }

    console.log('Setting Supabase session...');
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) throw error;

    console.log('Session set successfully:', data.session);

    // Save session to storage
    await chrome.storage.local.set({ session: data.session });
    console.log('Session saved to chrome.storage.local');

    // Get user data and log it
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Retrieved user data:', user);
      
      const { data: ecosystem } = await supabase
        .from('ecosystem')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      console.log('Retrieved ecosystem data:', ecosystem);
    }

    // Verificar que la sesión se guardó correctamente
    const savedSession = await chrome.storage.local.get(['session']);
    console.log('Verified saved session:', savedSession);

    // Redirect to success page
    chrome.tabs.update({ 
      url: chrome.runtime.getURL("src/pages/AuthSucessPage/auth-success.html")
    });
    
    console.log('OAuth callback handling completed successfully');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    throw error; // Re-throw para poder manejarlo en otro lugar si es necesario
  }
}

function parseUrlHash(url: string) {
  const hashParts = new URL(url).hash.slice(1).split('&');
  const hashMap = new Map(
    hashParts.map((part) => {
      const [name, value] = part.split('=');
      return [name, value];
    })
  );
  return hashMap;
}