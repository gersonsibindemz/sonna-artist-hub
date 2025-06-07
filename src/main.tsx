
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SafeEventManager } from './utils/eventUtils'

// Clean initialization without eval or deprecated events
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root = createRoot(rootElement);
  root.render(<App />);

  // Add safe cleanup handler for app shutdown
  SafeEventManager.addPageExitHandler(() => {
    console.log('App cleanup initiated');
    SafeEventManager.cleanup();
  }, 'main-app');
};

// Safe DOM ready check without eval
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
