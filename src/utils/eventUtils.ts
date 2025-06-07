
// Utility to safely manage event listeners and avoid deprecated patterns
export class SafeEventManager {
  private static listeners: Map<string, () => void> = new Map();

  // Safe alternative to unload event listener using beforeunload and visibilitychange
  static addPageExitHandler(callback: () => void, id: string = 'default') {
    // Remove any existing listener with this ID
    this.removePageExitHandler(id);

    const wrappedCallback = () => {
      try {
        callback();
      } catch (error) {
        console.warn('Error in page exit handler:', error);
      }
    };

    // Store the callback for cleanup
    this.listeners.set(id, wrappedCallback);

    // Use modern alternatives to deprecated unload event
    window.addEventListener('beforeunload', wrappedCallback);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        wrappedCallback();
      }
    });
  }

  static removePageExitHandler(id: string = 'default') {
    const callback = this.listeners.get(id);
    if (callback) {
      window.removeEventListener('beforeunload', callback);
      document.removeEventListener('visibilitychange', callback);
      this.listeners.delete(id);
    }
  }

  // Safe timeout alternative that doesn't use string evaluation
  static safeSetTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    return setTimeout(callback, delay);
  }

  // Safe interval alternative that doesn't use string evaluation
  static safeSetInterval(callback: () => void, delay: number): NodeJS.Timeout {
    return setInterval(callback, delay);
  }

  // Clean up all listeners on app unmount
  static cleanup() {
    this.listeners.forEach((_, id) => {
      this.removePageExitHandler(id);
    });
    this.listeners.clear();
  }
}

// CSP-safe dynamic script evaluation alternative
export const safeEvaluate = {
  // Safe alternative to eval() - only use predefined safe operations
  parseJSON: (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return null;
    }
  },

  // Safe dynamic function creation for specific use cases
  createSafeFunction: (allowedFunctions: Record<string, Function>, functionName: string) => {
    if (allowedFunctions[functionName] && typeof allowedFunctions[functionName] === 'function') {
      return allowedFunctions[functionName];
    }
    console.warn(`Function ${functionName} not found in allowed functions`);
    return null;
  }
};
