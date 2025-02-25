import { mockDb, Species, Ecosystem } from "../mockDatabase/mock-database";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Definición de tipos
export interface SessionData {
  user_id: string;
  specie_id: string;
  action: string;
  duration: number;
  completed: boolean;
  cancelled: boolean;
  start_time: Date;
}

// Clase que encapsula todas las interacciones con la base de datos
export class BackendService {

  /**
   * Obtiene el ID del usuario actual desde el almacenamiento local
   */
  private async getCurrentUserId(): Promise<string> {
    try {
      const { session } = await chrome.storage.local.get('session');
      if (!session || !session.user || !session.user.id) {
        throw new Error('Usuario no autenticado');
      }
      return session.user.id;
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
      throw new Error('No se pudo obtener el ID del usuario');
    }
  }
  
  /**
   * Obtiene el ecosistema de un usuario
   * @param userId - ID del usuario (opcional, si no se proporciona usa el ID del usuario actual)
   */
  async getEcosystem(userId?: string): Promise<Ecosystem> {
    try {
      // Usar el ID proporcionado o obtener el ID del usuario actual
      const actualUserId = userId || await this.getCurrentUserId();
      
      // Consultar el ecosistema en Supabase
      const { data, error } = await supabase
        .from('ecosystem')
        .select('*')
        .eq('user_id', actualUserId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Ecosistema no encontrado');
      
      return data as Ecosystem;
    } catch (error) {
      console.error('Error al obtener el ecosistema:', error);
      throw new Error('No se pudo cargar la información del ecosistema');
    }
  }

  /**
   * Obtiene las especies disponibles para un usuario
   * @param userId - ID del usuario
   */
  async getUserSpecies(userId: string): Promise<Species[]> {
    try {
      return await mockDb.getUserSpecies(userId);
    } catch (error) {
      console.error('Error al obtener las especies del usuario:', error);
      throw new Error('No se pudieron cargar las especies');
    }
  }

  /**
   * Crea una nueva sesión
   * @param sessionData - Datos de la sesión a crear
   */
  async createSession(sessionData: SessionData): Promise<void> {
    try {
      await mockDb.createSession(sessionData);
    } catch (error) {
      console.error('Error al crear la sesión:', error);
      throw error; // Mantenemos el error original para preservar los mensajes específicos
    }
  }

  /**
   * Valida si una acción es posible con el estado actual del ecosistema
   * @param action - Acción a validar
   * @param eco - Estado actual del ecosistema
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
   * Encuentra una acción válida predeterminada basada en el estado del ecosistema
   * @param eco - Estado actual del ecosistema
   * @param actions - Lista de acciones posibles
   */
  findValidDefaultAction(eco: Ecosystem, actions: readonly string[]): string {
    // Por defecto "Gather" que generalmente no requiere recursos
    if (this.validateAction("Gather", eco)) return "Gather";
    
    // Intentar otras acciones si "Gather" no es válida
    for (const action of actions) {
      if (this.validateAction(action, eco)) return action;
    }
    
    // Fallback a "Gather" si no se encuentran acciones válidas (poco probable)
    return "Gather";
  }
}

// Exportamos una instancia única del servicio
export const backendService = new BackendService();
