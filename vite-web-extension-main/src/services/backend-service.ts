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
  cancelled: boolean;
  start_time: Date;
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
      
      // Query ecosystem in Supabase
      const { data, error } = await supabase
        .from('ecosystem')
        .select('*')
        .eq('user_id', actualUserId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Ecosystem not found');
      
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
      // First, get the user's species collection from storage
      const { userSpecieCollection } = await chrome.storage.local.get(['userSpecieCollection']);

      if (!userSpecieCollection || !Array.isArray(userSpecieCollection)) {
        // If not available in storage, fetch it from Supabase
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
        
        return speciesData as Species[];
      } else {
        // Get species IDs from the stored collection
        const specieIds = userSpecieCollection.map((item: any) => item.specie_id);
        
        // Fetch the actual species data
        const { data: speciesData, error: speciesError } = await supabase
          .from('species')
          .select('*')
          .in('id', specieIds);
        
        if (speciesError) throw speciesError;
        if (!speciesData) return [];
        
        return speciesData as Species[];
      }
    } catch (error) {
      console.error('Error getting user species:', error);
      throw new Error('Could not load species data');
    }
  }

  /**
   * Creates a new session
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
      
      // If validation passes, create the session in Supabase
      const { error } = await supabase
        .from('session')
        .insert([sessionData]);
      
      if (error) throw error;
      
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
}

// Export a single instance of the service
export const backendService = new BackendService();
