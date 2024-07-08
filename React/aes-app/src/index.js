import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');
const app_root = createRoot(container);

app_root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);