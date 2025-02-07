import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/popup/index.css';
import '@assets/styles/tailwind.css';
import Popup from '@pages/popup/Popup';
import Panel from '../panel/Panel';
import LoginScreen from '../LoginScreen/LoginScreen';
import SelectionScreen from "../SelectionScreen/SelectionScreen";
import AppLayout from "../../components/AppLayout/AppLayout";
import TimerScreen from "../TimerScreen/TimerScreen";
import { CloudAnimationProvider } from '../../context/CloudAnimationContext';
import App from '../../App';

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(
    <CloudAnimationProvider>
      <AppLayout>
        < App/>
      </AppLayout>
    </CloudAnimationProvider>
  );
}

init();
