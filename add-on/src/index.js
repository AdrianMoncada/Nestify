import React from "react";
import { createRoot } from 'react-dom/client';
import { App } from "./BirdSessionV3";
import './styles.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
