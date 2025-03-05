import { Species, Ecosystem } from "../mockDatabase/mock-database";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Type definitions
export interface SessionData {
  user_id: string;
  specie_id: string;
  action: string;
  duration: number;
  completed: boolean;
  start_time: Date;
  cancelled: boolean;
}

// Class that encapsulates all database interactions
export class BackendService {

  /**
   * Gets the current user ID from local storage
   */
  private async getCurrentUserId(): Promise<string> {
    try {
      const { session } = await chrome.storage.local.get('session');
      if (!session || !session.user || !session.user.id) {
        throw new Error('User not authenticated');
      }
      return session.user.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      throw new Error('Could not get user ID');
    }
  }
  
  /**
   * Gets a user's ecosystem
   * @param userId - User ID (optional, if not provided uses current user's ID)
   */
  async getEcosystem(userId?: string): Promise<Ecosystem> {
    try {
      // Use provided ID or get current user's ID
      const actualUserId = userId || await this.getCurrentUserId();
      
      // Check if ecosystem is in storage first
      const { ecosystem } = await chrome.storage.local.get(['ecosystem']);
      if (ecosystem && ecosystem.user_id === actualUserId) {
        return ecosystem as Ecosystem;
      }
      
      // If not in storage, query ecosystem in Supabase
      const { data, error } = await supabase
        .from('ecosystem')
        .select('*')
        .eq('user_id', actualUserId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Ecosystem not found');
      
      // Store for future use
      chrome.storage.local.set({ ecosystem: data });
      
      return data as Ecosystem;
    } catch (error) {
      console.error('Error getting ecosystem:', error);
      throw new Error('Could not load ecosystem information');
    }
  }

  /**
   * Gets species available to a user
   * @param userId - User ID
   */
  async getUserSpecies(userId: string): Promise<Species[]> {
    try {
      // First, try to get the complete species data from storage
      const { species, userSpecieCollection } = await chrome.storage.local.get(['species', 'userSpecieCollection']);
      
      if (species && userSpecieCollection) {
        // Filter species based on user's collection
        const specieIds = userSpecieCollection.map((item: any) => item.specie_id);
        const userSpecies = species.filter((specie: Species) => specieIds.includes(specie.id));
        
        if (userSpecies.length > 0) {
          console.log('Using cached species data from storage');
          return userSpecies as Species[];
        }
      }
      
      // If not available in storage, fetch from Supabase
      console.log('Species data not in storage, fetching from Supabase');
      
      // Get user's collection
      const { data: userSpecieData, error: userSpecieError } = await supabase
        .from('user_specie_collection')
        .select('*')
        .eq('user_id', userId);
      
      if (userSpecieError) throw userSpecieError;
      if (!userSpecieData || userSpecieData.length === 0) {
        return []; // No species found for this user
      }
      
      // Get all species IDs from user's collection
      const specieIds = userSpecieData.map(item => item.specie_id);
      
      // Fetch the actual species data
      const { data: speciesData, error: speciesError } = await supabase
        .from('species')
        .select('*')
        .in('id', specieIds);
      
      if (speciesError) throw speciesError;
      if (!speciesData) return [];
      
      // Store the complete species data for future use
      chrome.storage.local.set({ species: speciesData });
      
      return speciesData as Species[];
    } catch (error) {
      console.error('Error getting user species:', error);
      throw new Error('Could not load species data');
    }
  }

  /**
   * Creates a new session using the Edge Function
   * @param sessionData - Session data to create
   */
  async createSession(sessionData: SessionData): Promise<void> {
    try {
      // First validate if the action is possible
      const ecosystem = await this.getEcosystem(sessionData.user_id);
      const actionName = sessionData.action.charAt(0).toUpperCase() + sessionData.action.slice(1);
      
      if (!this.validateAction(actionName, ecosystem)) {
        throw new Error(`Action "${actionName}" is not valid with current resources.`);
      }
      
      // Call the Edge Function to create the session
      // Construct the endpoint URL
      const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/start_session`;
      
      // Prepare the payload for the edge function (matches the expected parameters)
      const payload = {
        user_id: sessionData.user_id,
        specie_id: sessionData.specie_id,
        action: sessionData.action.toLowerCase(), // Ensure lowercase to match Edge Function expectations
        duration: sessionData.duration,
        completed: sessionData.completed || false,
        cancelled: sessionData.cancelled || false
      };
      
      // Make the request to the Edge Function
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      // Parse the response
      const result = await response.json();
      
      // Check for errors
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Error creating session via Edge Function');
      }
      
      // Save the session ID in chrome.storage.local
chrome.storage.local.set({ sessionId: result.session.id }, () => {
  console.log('Session ID saved:', result.session.id);
});
      
    } catch (error) {
      console.error('Error creating session:', error);
      throw error; // Keep original error to preserve specific messages
    }
  }

  /**
   * Validates if an action is possible with the current ecosystem state
   * @param action - Action to validate
   * @param eco - Current ecosystem state
   */
  validateAction(action: string, eco: Ecosystem): boolean {
    switch (action) {
      case "Hatch":
        return eco.feathers >= 1 && eco.population < eco.max_population;
      case "Build":
        return eco.resources >= 1;
      case "Gather":
        return true;
      default:
        return false;
    }
  }

  /**
   * Finds a default valid action based on ecosystem state
   * @param eco - Current ecosystem state
   * @param actions - List of possible actions
   */
  findValidDefaultAction(eco: Ecosystem, actions: readonly string[]): string {
    // Default to "Gather" which generally doesn't require resources
    if (this.validateAction("Gather", eco)) return "Gather";
    
    // Try other actions if "Gather" is not valid
    for (const action of actions) {
      if (this.validateAction(action, eco)) return action;
    }
    
    // Fallback to "Gather" if no valid actions are found (unlikely)
    return "Gather";
  }

  /**
 * Updates the status of an active session
 * @param sessionId - ID of the session to update
 * @param status - New status of the session ('cancelled' or 'completed')
 */
  async updateSessionStatus(
    sessionId: string, 
    status: 'cancelled' | 'completed'
  ): Promise<{
    session_outcomes?: any, 
    updated_ecosystem?: Ecosystem
  }> {
    try {
      // Endpoint for updating session status
      const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update_session_status`;
      
      // Prepare the payload for the edge function
      const payload = {
        session_id: sessionId,
        status_field: status,
        status_value: true
      };
      
      // Make the request to the Edge Function
      const response = await fetch(endpointUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      // Parse the response
      const result = await response.json();
      
      // Check for errors
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || `Error updating session status to ${status}`);
      }
      
      // Remove session ID from storage if the session is cancelled or completed
      await chrome.storage.local.remove('sessionId');
      
      // Return session outcomes and updated ecosystem if available
      return {
        session_outcomes: result.session_outcomes || null,
        updated_ecosystem: result.updated_ecosystem || null
      };
    } catch (error) {
      console.error(`Error updating session status to ${status}:`, error);
      throw error;
    }
  }
}

// Export a single instance of the service
export const backendService = new BackendService();
