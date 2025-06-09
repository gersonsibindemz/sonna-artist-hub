
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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session) {
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
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      if (!mounted) return;
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  // Validation helper functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 8 && cleanPhone.length <= 15;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      setLoading(true);
      
      // Input validation
      if (!emailOrPhone.trim()) {
        const error = 'Email ou telefone é obrigatório';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      if (!validatePassword(password)) {
        const error = 'Senha deve ter pelo menos 6 caracteres';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      const isEmail = emailOrPhone.includes('@');
      
      // Validate email format if it's an email
      if (isEmail && !validateEmail(emailOrPhone)) {
        const error = 'Formato de email inválido';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      // Validate phone format if it's a phone
      if (!isEmail && !validatePhone(emailOrPhone)) {
        const error = 'Formato de telefone inválido';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Attempting login with:', isEmail ? 'email' : 'phone');

      // Use Supabase Auth for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isEmail ? emailOrPhone : '',
        phone: !isEmail ? emailOrPhone : '',
        password,
      });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = error.message;
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email/telefone ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: errorMessage };
      }

      console.log('Login successful:', data);
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet';
      }
      
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

      // Input validation
      if (!email && !phone) {
        const error = 'Email ou telefone é obrigatório';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      if (!validatePassword(password)) {
        const error = 'Senha deve ter pelo menos 6 caracteres';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      // Validate email if provided
      if (email && !validateEmail(email)) {
        const error = 'Formato de email inválido';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      // Validate phone if provided
      if (phone && !validatePhone(phone)) {
        const error = 'Formato de telefone inválido';
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Attempting registration with:', email ? 'email' : 'phone', { email, phone });

      // Prioritize email registration as it's more reliable
      const authMethod = email ? 'email' : 'phone';
      
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
        let errorMessage = error.message;
        
        // Provide user-friendly error messages
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email/telefone já está cadastrado. Tente fazer login';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Senha deve ter pelo menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Formato de email inválido';
        } else if (error.message.includes('Invalid phone')) {
          errorMessage = 'Formato de telefone inválido';
        } else if (error.message.includes('SMS not available')) {
          errorMessage = 'SMS não disponível. Tente usar email para registro';
        }
        
        toast({
          title: "Erro no registro",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: errorMessage };
      }

      console.log('Registration successful:', data);

      // Show appropriate success message based on auth method
      if (authMethod === 'email') {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo à plataforma Sonna For Artists",
        });
      }

      return {};
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet';
      }
      
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
        description: 'Erro de conexão durante logout',
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
        // For phone verification
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
