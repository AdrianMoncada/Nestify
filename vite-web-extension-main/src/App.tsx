import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SelectionScreen from './pages/SelectionScreen/SelectionScreen';
import TimerScreen from './pages/TimerScreen/TimerScreen';

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<SelectionScreen />} />
        <Route path="/timer" element={<TimerScreen />} />
      </Routes>
    </MemoryRouter>
  );
}
