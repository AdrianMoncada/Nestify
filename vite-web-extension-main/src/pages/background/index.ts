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

    // Save userId to storage
    await chrome.storage.local.set({ userId: data.session?.user.id });
    console.log('User id saved to chrome.storage.local');

    // Get user data and log it
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Retrieved user data:', user);
      
      // Fetch ecosystem data
      const { data: ecosystem, error: ecosystemError } = await supabase
        .from('ecosystem')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (ecosystemError) {
        console.error('Error retrieving ecosystem:', ecosystemError);
      } else {
        console.log('Retrieved ecosystem data:', ecosystem);
    
        // Save ecosystem to local storage
        chrome.storage.local.set({ ecosystem });
        console.log('Ecosystem saved to chrome.storage.local');
      }

      console.log('Antes de iniciar fetch de user')
      // Fetch user's species collection
      const { data: userSpecieCollection, error: specieError } = await supabase
        .from('user_specie_collection')
        .select('*')
        .eq('user_id', user.id);
      
      if (specieError) {
        console.error('Error retrieving user species collection:', specieError);
      } else {
        console.log('Retrieved user species collection:', userSpecieCollection);
    
        // Save user species collection to local storage
        chrome.storage.local.set({ userSpecieCollection });
        console.log('User species collection saved to chrome.storage.local');
        
        // Get species IDs from the collection
        const specieIds = userSpecieCollection.map(item => item.specie_id);
        
        // Fetch complete species details
        const { data: species, error: speciesDetailsError } = await supabase
          .from('species')
          .select('*')
          .in('id', specieIds);
        
        if (speciesDetailsError) {
          console.error('Error retrieving species details:', speciesDetailsError);
        } else {
          console.log('Retrieved species details:', species);
          
          // Save species details to local storage
          chrome.storage.local.set({ species });
          console.log('Species details saved to chrome.storage.local');
        }
      }
    }

    // Verify the session was saved correctly
    const savedSession = await chrome.storage.local.get(['session']);
    console.log('Verified saved session:', savedSession);

    // Redirect to success page
    chrome.tabs.update({ 
      url: chrome.runtime.getURL("src/pages/AuthSucessPage/auth-success.html")
    });
    
    console.log('OAuth callback handling completed successfully');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    throw error; // Re-throw to be handled elsewhere if needed
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

chrome.runtime.onInstalled.addListener(() => {
  checkAuthAndState();
});

async function checkAuthAndState() {
  const { session } = await chrome.storage.local.get('session');
  if (session) {
    // Verify session with Supabase
    const { error } = await supabase.auth.setSession(session);
    if (!error) {
      // Check states in parallel
      const [rewardState, timerState] = await Promise.all([
        chrome.storage.local.get(['rewardState']),
        chrome.storage.local.get(['timerState'])
      ]);
      
      // Determine if there's a valid reward with valid data
      const hasValidReward = rewardState?.rewardState && 
                       rewardState.rewardState.reward && 
                       rewardState.rewardState.outcome &&
                       rewardState.rewardState.session &&
                       rewardState.rewardState.viewed === false;
      
      // Save current state
      await chrome.storage.local.set({
        appState: {
          isAuthenticated: true,
          hasUnviewedReward: hasValidReward,
          hasActiveTimer: !!timerState?.timerState,
          lastCheck: Date.now()
        }
      });
      
      // If there's no valid reward, clear the reward state to avoid errors
      if (!hasValidReward && rewardState?.rewardState) {
        await chrome.storage.local.remove(['rewardState']);
        console.log('Invalid reward state removed');
      }
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_APP_STATE') {
    chrome.storage.local.get('appState').then(sendResponse);
    return true;
  }
  
  if (message.type === 'UPDATE_APP_STATE') {
    chrome.storage.local.set({ appState: message.state }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});