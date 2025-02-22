import { BIRDS, ACTIONS } from '../pages/SelectionScreen/SelectionScreen';
import {SessionOutcome} from '../mockDatabase/mock-database';

export interface SessionState {
  selectedBird: typeof BIRDS[number];
  selectedAction: typeof ACTIONS[number];
  selectedTime: number;
}

export interface RewardState {
  outcome: SessionOutcome;
  session: {
    action: string;
    completed: boolean;
  };
  viewed: boolean;
}