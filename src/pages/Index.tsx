
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";

const AppContent = () => {
  const { user, loading, session } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated with a valid session
  const isAuthenticated = user && session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster />
      {!isAuthenticated ? <AuthForm /> : <Dashboard />}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
