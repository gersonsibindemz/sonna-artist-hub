
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ error?: string }>;
  register: (email: string | null, phone: string | null, password: string, countryCode: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  sendVerificationCode: (emailOrPhone: string, type: 'email' | 'phone') => Promise<{ error?: string }>;
  verifyCode: (emailOrPhone: string, code: string, type: 'email' | 'phone') => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta à plataforma Sonna For Artists",
          });
        }

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Até logo!",
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      setLoading(true);
      
      // Use Supabase Auth for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrPhone.includes('@') ? emailOrPhone : '',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '',
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Erro desconhecido no login';
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });

      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string | null, phone: string | null, password: string, countryCode: string) => {
    try {
      setLoading(true);

      if (!email && !phone) {
        return { error: 'Email ou telefone é obrigatório' };
      }

      // Use Supabase Auth for registration
      const { data, error } = await supabase.auth.signUp({
        email: email || '',
        phone: phone || '',
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            country_code: countryCode,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à plataforma Sonna For Artists",
      });

      return {};
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Erro desconhecido no registro';
      
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });

      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Erro no logout",
        description: error.message || 'Erro desconhecido no logout',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (emailOrPhone: string, type: 'email' | 'phone') => {
    try {
      if (type === 'email') {
        const { error } = await supabase.auth.resetPasswordForEmail(emailOrPhone, {
          redirectTo: `${window.location.origin}/`,
        });
        return { error: error?.message };
      } else {
        // For phone verification, you would implement SMS sending here
        console.log(`Verification code would be sent to phone: ${emailOrPhone}`);
        return {};
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const verifyCode = async (emailOrPhone: string, code: string, type: 'email' | 'phone') => {
    try {
      if (type === 'phone') {
        const { error } = await supabase.auth.verifyOtp({
          phone: emailOrPhone,
          token: code,
          type: 'sms'
        });
        return { error: error?.message };
      }
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    sendVerificationCode,
    verifyCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
