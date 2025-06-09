
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, Session, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<AuthResponse>;
  register: (email: string | null, phone: string | null, password: string, countryCode: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  sendVerificationCode: (emailOrPhone: string, type: 'email' | 'phone') => Promise<{ error?: string }>;
  verifyCode: (emailOrPhone: string, code: string, type: 'email' | 'phone') => Promise<AuthResponse>;
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
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('sonna_session_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Usar fetch direto para evitar problemas de tipagem do Supabase
      const response = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/user_sessions?token=eq.${token}&expires_at=gt.${new Date().toISOString()}&select=*,users(*)`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        localStorage.removeItem('sonna_session_token');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const sessionData = data[0];
        setSession(sessionData);
        setUser(sessionData.users);
      } else {
        localStorage.removeItem('sonna_session_token');
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      localStorage.removeItem('sonna_session_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
    try {
      const isEmail = emailOrPhone.includes('@');
      const field = isEmail ? 'email' : 'phone';

      // Buscar usuário usando API REST direta
      const userResponse = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/users?${field}=eq.${emailOrPhone}&is_active=eq.true`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Erro ao verificar usuário');
      }

      const userData = await userResponse.json();
      if (!userData || userData.length === 0) {
        return { error: 'Usuário não encontrado ou inativo' };
      }

      const user = userData[0];

      // Verificar senha usando função personalizada simples
      const passwordHash = btoa(password + 'salt_sonna_2024'); // Hash simples para desenvolvimento
      if (user.password_hash !== passwordHash) {
        return { error: 'Senha incorreta' };
      }

      // Criar sessão
      const sessionToken = btoa(Math.random().toString(36) + Date.now().toString(36));
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

      const sessionResponse = await fetch('https://kqivlifcqykagpecjawk.supabase.co/rest/v1/user_sessions', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Erro ao criar sessão');
      }

      const sessionData = await sessionResponse.json();
      const newSession = sessionData[0];

      // Atualizar último login
      await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/users?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          last_login: new Date().toISOString()
        })
      });

      // Salvar token no localStorage
      localStorage.setItem('sonna_session_token', sessionToken);

      setUser(user);
      setSession(newSession);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à plataforma Sonna For Artists",
      });

      return { user, session: newSession };
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error.message || 'Erro desconhecido no login';
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });

      return { error: errorMessage };
    }
  };

  const register = async (email: string | null, phone: string | null, password: string, countryCode: string): Promise<AuthResponse> => {
    try {
      if (!email && !phone) {
        return { error: 'Email ou telefone é obrigatório' };
      }

      // Hash simples da senha para desenvolvimento
      const passwordHash = btoa(password + 'salt_sonna_2024');

      // Criar usuário
      const userResponse = await fetch('https://kqivlifcqykagpecjawk.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email,
          phone,
          password_hash: passwordHash,
          country_code: countryCode,
          email_verified: false,
          phone_verified: false,
          is_active: true
        })
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        if (errorData.code === '23505') {
          return { error: 'Email ou telefone já está em uso' };
        }
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      const userData = await userResponse.json();
      const newUser = userData[0];

      // Fazer login automático após registro
      const loginResult = await login(email || phone!, password);
      
      if (loginResult.error) {
        return loginResult;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à plataforma Sonna For Artists",
      });

      return loginResult;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      const errorMessage = error.message || 'Erro desconhecido no registro';
      
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });

      return { error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('sonna_session_token');
      if (token) {
        await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/user_sessions?token=eq.${token}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
            'Content-Type': 'application/json'
          }
        });
      }

      localStorage.removeItem('sonna_session_token');
      setUser(null);
      setSession(null);

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const sendVerificationCode = async (emailOrPhone: string, type: 'email' | 'phone') => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutos

      const insertData: any = {
        code,
        type: `${type}_verification`,
        expires_at: expiresAt.toISOString(),
        used: false
      };

      insertData[type] = emailOrPhone;

      await fetch('https://kqivlifcqykagpecjawk.supabase.co/rest/v1/verification_codes', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(insertData)
      });

      // Em produção, enviar email/SMS real
      console.log(`Código de verificação para ${emailOrPhone}: ${code}`);
      
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const verifyCode = async (emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<AuthResponse> => {
    try {
      const response = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/verification_codes?${type}=eq.${emailOrPhone}&code=eq.${code}&type=eq.${type}_verification&used=eq.false&expires_at=gt.${new Date().toISOString()}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!data || data.length === 0) {
        return { error: 'Código inválido ou expirado' };
      }

      const verification = data[0];

      // Marcar código como usado
      await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/verification_codes?id=eq.${verification.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ used: true })
      });

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
