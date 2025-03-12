import React from "react";

interface RewardMessageProps {
  outcome: {
    resources_gained: number;
    resources_spent: number;
    feathers_gained: number;
    feathers_spent: number;
    nests_created: number;
    population_increase: number;
    max_population_increase: number;
    species_unlocked: string | null;
  };
  session: {
    action: string;
    completed: boolean;
  };
}

/**
 * Genera un mensaje de recompensa basado en los resultados positivos de la sesión
 * con prioridad para mensajes importantes como desbloqueo de especies
 * @param outcome Resultados de la sesión
 * @returns Mensaje personalizado basado en las recompensas
 */
const getRewardMessage = (outcome: RewardMessageProps["outcome"]): string => {
  if (!outcome) return "Session Complete!";
  
  // Prioridad 1: Desbloqueo de especies (siempre muestra primero si existe)
  if (outcome.species_unlocked) {
    return `Unlocked a new bird species: ${outcome.species_unlocked}!`;
  }
  
  // Prioridad 2: Aumento de población
  if (outcome.population_increase > 0) {
    return `New bird hatched!`;
  }
  
  // Prioridad 3: Nidos creados
  if (outcome.nests_created > 0) {
    return `Built ${outcome.nests_created} new nest${outcome.nests_created > 1 ? 's' : ''}!`;
  }
  
  // Prioridad 4: Aumento de población máxima
  if (outcome.max_population_increase > 0) {
    return `Increased habitat capacity by ${outcome.max_population_increase}!`;
  }
  
  // Prioridad 5: Plumas ganadas
  if (outcome.feathers_gained > 0) {
    return `Found ${outcome.feathers_gained} magic feather${outcome.feathers_gained > 1 ? 's' : ''}!`;
  }
  
  // Prioridad 6: Recursos ganados
  if (outcome.resources_gained > 0) {
    return `Gained ${outcome.resources_gained} resources!`;
  }
  
  // Si no hay mensajes positivos específicos, usar un mensaje genérico
  return "Session Complete!";
};

/**
 * Componente que muestra un mensaje personalizado basado en los resultados de la sesión
 */
const RewardMessage: React.FC<RewardMessageProps> = ({ outcome, session }) => {
  const message = getRewardMessage(outcome);
  
  return (
    <h2 className="text-xl font-medium text-[#784E2F] mb-2 mt-4">
      {message}
    </h2>
  );
};

export default RewardMessage;