
// Safe service worker utilities that comply with CSP
export const ServiceWorkerManager = {
  // Register service worker safely without eval
  register: async (swPath: string = '/sw.js') => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(swPath, {
          scope: '/',
          type: 'module' // Use module type to avoid eval issues
        });
        
        console.log('Service Worker registered successfully:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    console.warn('Service Worker not supported');
    return null;
  },

  // Unregister all service workers safely
  unregisterAll: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('All service workers unregistered');
      } catch (error) {
        console.error('Error unregistering service workers:', error);
      }
    }
  }
};

// Safe localStorage/sessionStorage helpers that avoid eval
export const SafeStorage = {
  set: (key: string, value: any, useSession = false) => {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  get: <T = any>(key: string, defaultValue: T | null = null, useSession = false): T | null => {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  remove: (key: string, useSession = false) => {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  clear: (useSession = false) => {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      storage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
};
