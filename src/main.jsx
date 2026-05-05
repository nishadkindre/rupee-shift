import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { AnimationProvider } from './context/AnimationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimationProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AnimationProvider>
  </StrictMode>
);
