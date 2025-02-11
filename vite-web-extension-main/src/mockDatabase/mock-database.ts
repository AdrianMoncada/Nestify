// src/mock-database/mockDatabase.ts

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

  // Session methods
  async createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
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
    const species = await this.getSpecies();
    const specie = species.find(s => s.id === sessionData.specie_id);
    
    if (!specie) throw new Error('Species not found');

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
    switch (sessionData.action) {
      case "Build":
        baseOutcome.resources_spent = 1;
        baseOutcome.nests_created = 1 + Math.floor(specie.nesting_skill / 2);
        baseOutcome.max_population_increase = 2 * baseOutcome.nests_created;
        break;
      case "Gather":
        baseOutcome.resources_gained = 1 + Math.floor(specie.gathering_skill / 2);
        // Higher chance of finding feathers with better scouting skill
        baseOutcome.feathers_gained = Math.random() < (0.3 + specie.scouting_skill * 0.1) ? 1 : 0;
        break;
      case "Hatch":
        baseOutcome.feathers_spent = 1;
        baseOutcome.population_increase = 1;
        break;
    }

    this.sessionOutcomes.push(baseOutcome);
    return baseOutcome;
  }
}

// Export a singleton instance
export const mockDb = new MockDatabase();
