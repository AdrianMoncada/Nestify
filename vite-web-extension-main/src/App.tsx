import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';
import RewardScreen from './pages/RewardScreen/RewardScreen';

export default function App() {
  return (
    <MemoryRouter initialEntries={['/reward']}>
      <Routes>
        <Route path="/" element={<SelectionScreen />} />
        <Route path="/timer" element={<TimerScreen />} />
        <Route path="/reward" element={<RewardScreen/>} />
      </Routes>
    </MemoryRouter>
  );
}
