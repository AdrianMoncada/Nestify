// Types to match schema
export interface Species {
  id: string; // uuid
  name: string;
  gathering_skill: number; // smallint
  scouting_skill: number; // smallint
  nesting_skill: number; // smallint
}

export interface UserSpecieCollection {
  id: string; // uuid
  user_id: string; // uuid
  specie_id: string; // uuid
  unlocked_at: Date;
}

export interface Ecosystem {
  id: string; // uuid
  user_id: string; // uuid
  nests: number;
  population: number;
  max_population: number;
  feathers: number;
  resources: number;
}

export interface Session {
  id: string; // uuid
  user_id: string; // uuid
  specie_id: string; // uuid
  action: string;
  duration: number;
  completed: boolean;
  start_time: Date;
  cancelled: boolean;
}

export interface SessionOutcome {
  id: string; // uuid
  session_id: string; // uuid
  user_id: string; // uuid
  action: string;
  resources_spent: number;
  feathers_spent: number;
  nests_created: number;
  population_increase: number;
  max_population_increase: number;
  resources_gained: number;
  feathers_gained: number;
  species_unlocked: string | null;
  created_at: Date;
}

// Mock database instance
class MockDatabase {
  private species: Species[] = [
    {
      id: "species-robin",
      name: "Robin",
      gathering_skill: 1,
      scouting_skill: 1,
      nesting_skill: 1
    },
    {
      id: "species-crow",
      name: "Crow",
      gathering_skill: 1,
      scouting_skill: 2,
      nesting_skill: 1
    },
    {
      id: "species-hornero",
      name: "Hornero",
      gathering_skill: 1,
      scouting_skill: 1,
      nesting_skill: 2
    },
    {
      id: "species-pelican",
      name: "Pelican",
      gathering_skill: 2,
      scouting_skill: 1,
      nesting_skill: 1
    }
  ];

  private userSpecieCollection: UserSpecieCollection[] = [
    {
      id: "collection1",
      user_id: "user1",
      specie_id: "species-robin",
      unlocked_at: new Date()
    },
    {
      id: "collection1",
      user_id: "user1",
      specie_id: "species-pelican",
      unlocked_at: new Date()
    },
    {
      id: "collection1",
      user_id: "user1",
      specie_id: "species-crow",
      unlocked_at: new Date()
    }
  ];

  private ecosystems: Ecosystem[] = [
    {
      id: "eco1",
      user_id: "user1",
      nests: 2,
      population: 8,
      max_population: 10,
      feathers: 1,
      resources: 1
    }
  ];

  private sessions: Session[] = [];
  private sessionOutcomes: SessionOutcome[] = [];

  // Species methods
  async getSpecies(): Promise<Species[]> {
    return this.species;
  }

  async getUserSpecies(userId: string): Promise<Species[]> {
    const userCollections = this.userSpecieCollection.filter(
      collection => collection.user_id === userId
    );
    return this.species.filter(species => 
      userCollections.some(collection => collection.specie_id === species.id)
    );
  }

  // Ecosystem methods
  async getEcosystem(userId: string): Promise<Ecosystem | null> {
    return this.ecosystems.find(eco => eco.user_id === userId) || null;
  }

  // Helper method for validating actions
  private async validateAction(userId: string, action: string): Promise<void> {
    const ecosystem = await this.getEcosystem(userId);
    if (!ecosystem) {
      throw new Error("Ecosystem not found for user");
    }

    // Specific validations for each action
    switch (action.toLowerCase()) {
      case "hatch":
        if (ecosystem.feathers < 1) {
          throw new Error("Not enough feathers to hatch.");
        }
        if (ecosystem.population >= ecosystem.max_population) {
          throw new Error("Population limit reached.");
        }
        break;
      case "build":
        if (ecosystem.resources < 1) {
          throw new Error("Not enough resources to build.");
        }
        break;
      // "gather" doesn't require validation
    }
  }

  // Session methods
  async createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
    // Validate action before creating the session
    await this.validateAction(sessionData.user_id, sessionData.action);

    // If validation passes, create the session
    const newSession: Session = {
      id: `session-${this.sessions.length + 1}`,
      ...sessionData
    };
    this.sessions.push(newSession);
    return newSession;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return null;
    
    this.sessions[index] = { ...this.sessions[index], ...updates };
    return this.sessions[index];
  }

  // Session outcome methods
  async createSessionOutcome(sessionData: Session): Promise<SessionOutcome> {
    // Validate action first
    await this.validateAction(sessionData.user_id, sessionData.action);
    
    const species = await this.getSpecies();
    const specie = species.find(s => s.id === sessionData.specie_id);
    
    if (!specie) throw new Error('Species not found');

    const ecosystem = await this.getEcosystem(sessionData.user_id);
    if (!ecosystem) {
      throw new Error("Ecosystem not found for user");
    }

    const baseOutcome: SessionOutcome = {
      id: `outcome-${this.sessionOutcomes.length + 1}`,
      session_id: sessionData.id,
      user_id: sessionData.user_id,
      action: sessionData.action,
      resources_spent: 0,
      feathers_spent: 0,
      nests_created: 0,
      population_increase: 0,
      max_population_increase: 0,
      resources_gained: 0,
      feathers_gained: 0,
      species_unlocked: null,
      created_at: new Date()
    };

    // Calculate outcomes based on action and species skills
    switch (sessionData.action.toLowerCase()) {
      case "build":
        baseOutcome.resources_spent = 1;
        baseOutcome.nests_created = 1 + Math.floor(specie.nesting_skill / 2);
        baseOutcome.max_population_increase = 2 * baseOutcome.nests_created;
        
        // Update ecosystem resources
        await this.updateEcosystemAfterBuild(ecosystem, baseOutcome);
        break;
        
      case "gather":
        baseOutcome.resources_gained = 1 + Math.floor(specie.gathering_skill / 2);
        // Higher chance of finding feathers with better scouting skill
        baseOutcome.feathers_gained = Math.random() < (0.3 + specie.scouting_skill * 0.1) ? 1 : 0;
        
        // Update ecosystem resources
        await this.updateEcosystemAfterGather(ecosystem, baseOutcome);
        break;
        
      case "hatch":
        baseOutcome.feathers_spent = 1;
        baseOutcome.population_increase = 1;
        
        // Update ecosystem population
        await this.updateEcosystemAfterHatch(ecosystem, baseOutcome);
        break;
    }

    this.sessionOutcomes.push(baseOutcome);
    return baseOutcome;
  }
  
  // Helper methods to update ecosystem after actions
  private async updateEcosystemAfterBuild(ecosystem: Ecosystem, outcome: SessionOutcome): Promise<void> {
    ecosystem.resources -= outcome.resources_spent;
    ecosystem.nests += outcome.nests_created;
    ecosystem.max_population += outcome.max_population_increase;
    
    // Save ecosystem changes
    const index = this.ecosystems.findIndex(e => e.id === ecosystem.id);
    if (index !== -1) {
      this.ecosystems[index] = ecosystem;
    }
  }
  
  private async updateEcosystemAfterGather(ecosystem: Ecosystem, outcome: SessionOutcome): Promise<void> {
    ecosystem.resources += outcome.resources_gained;
    ecosystem.feathers += outcome.feathers_gained;
    
    // Save ecosystem changes
    const index = this.ecosystems.findIndex(e => e.id === ecosystem.id);
    if (index !== -1) {
      this.ecosystems[index] = ecosystem;
    }
  }
  
  private async updateEcosystemAfterHatch(ecosystem: Ecosystem, outcome: SessionOutcome): Promise<void> {
    ecosystem.feathers -= outcome.feathers_spent;
    ecosystem.population += outcome.population_increase;
    
    // Save ecosystem changes
    const index = this.ecosystems.findIndex(e => e.id === ecosystem.id);
    if (index !== -1) {
      this.ecosystems[index] = ecosystem;
    }
  }
}

// Export a singleton instance
export const mockDb = new MockDatabase();
