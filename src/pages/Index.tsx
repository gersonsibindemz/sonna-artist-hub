
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar conectividade com Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao conectar com Supabase:", error);
          setConnectionError(true);
          toast({
            title: "Erro de Conectividade",
            description: "Não foi possível conectar com o servidor. Verifique sua conexão.",
            variant: "destructive",
          });
        } else {
          setConnectionError(false);
          if (mounted) {
            setSession(data.session);
          }
        }
      } catch (error) {
        console.error("Erro de inicialização:", error);
        setConnectionError(true);
        toast({
          title: "Erro de Inicialização",
          description: "Erro ao inicializar a aplicação.",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setConnectionError(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

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

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4 text-white max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold">Erro de Conectividade</h2>
          <p className="text-gray-300">
            Não foi possível conectar com o servidor. Verifique sua conexão com a internet e tente novamente.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster />
      {!session ? <AuthForm /> : <Dashboard />}
    </div>
  );
};

export default Index;
