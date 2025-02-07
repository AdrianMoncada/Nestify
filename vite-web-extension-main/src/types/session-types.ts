import { BIRDS, ACTIONS } from '../pages/SelectionScreen/SelectionScreen';

export interface SessionState {
  selectedBird: typeof BIRDS[number];
  selectedAction: typeof ACTIONS[number];
  selectedTime: number;
}
