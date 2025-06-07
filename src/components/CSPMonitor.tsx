
import { useEffect } from 'react';

// Component to monitor CSP violations and provide warnings
const CSPMonitor = () => {
  useEffect(() => {
    // Monitor CSP violations
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('CSP Violation detected:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition,
        statusCode: event.statusCode,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber
      });

      // You could send this to monitoring service in production
      // analytics.track('csp_violation', violationDetails);
    };

    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    // Also listen for deprecated feature warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Detect deprecated features
      if (message.includes('deprecated') || message.includes('Deprecated')) {
        console.error('🚨 Deprecated feature detected:', message);
        // Could send to monitoring service
      }
      
      // Call original warn
      originalWarn.apply(console, args);
    };

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
      console.warn = originalWarn;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CSPMonitor;
