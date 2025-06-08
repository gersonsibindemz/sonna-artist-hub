
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    // Verificar se há uma sessão ativa
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('sonna_session_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          users (*)
        `)
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        localStorage.removeItem('sonna_session_token');
        setLoading(false);
        return;
      }

      setSession(data);
      setUser(data.users);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
    try {
      // Verificar se é email ou telefone
      const isEmail = emailOrPhone.includes('@');
      const field = isEmail ? 'email' : 'phone';

      // Buscar usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq(field, emailOrPhone)
        .eq('is_active', true)
        .single();

      if (userError || !userData) {
        return { error: 'Usuário não encontrado ou inativo' };
      }

      // Verificar senha usando a função do banco
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc('verify_password', { 
          password: password, 
          hash: userData.password_hash 
        });

      if (passwordError || !passwordCheck) {
        return { error: 'Senha incorreta' };
      }

      // Criar sessão
      const { data: sessionData, error: sessionError } = await supabase
        .rpc('generate_session_token');

      if (sessionError || !sessionData) {
        return { error: 'Erro ao criar sessão' };
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

      const { data: newSession, error: insertSessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userData.id,
          token: sessionData,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1', // Em produção, capturar IP real
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (insertSessionError || !newSession) {
        return { error: 'Erro ao criar sessão' };
      }

      // Atualizar último login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Salvar token no localStorage
      localStorage.setItem('sonna_session_token', sessionData);

      setUser(userData);
      setSession(newSession);

      return { user: userData, session: newSession };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { error: error.message || 'Erro desconhecido no login' };
    }
  };

  const register = async (email: string | null, phone: string | null, password: string, countryCode: string): Promise<AuthResponse> => {
    try {
      if (!email && !phone) {
        return { error: 'Email ou telefone é obrigatório' };
      }

      // Hash da senha usando a função do banco
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password });

      if (hashError || !hashedPassword) {
        return { error: 'Erro ao processar senha' };
      }

      // Criar usuário
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          phone,
          password_hash: hashedPassword,
          country_code: countryCode,
          email_verified: false,
          phone_verified: false
        })
        .select()
        .single();

      if (userError) {
        if (userError.code === '23505') {
          return { error: 'Email ou telefone já está em uso' };
        }
        return { error: userError.message || 'Erro ao criar conta' };
      }

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
      return { error: error.message || 'Erro desconhecido no registro' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('sonna_session_token');
      if (token) {
        await supabase
          .from('user_sessions')
          .delete()
          .eq('token', token);
      }

      localStorage.removeItem('sonna_session_token');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const sendVerificationCode = async (emailOrPhone: string, type: 'email' | 'phone') => {
    try {
      const { data: code, error: codeError } = await supabase
        .rpc('generate_verification_code');

      if (codeError || !code) {
        return { error: 'Erro ao gerar código' };
      }

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutos

      const insertData = {
        [type]: emailOrPhone,
        code,
        type: `${type}_verification`,
        expires_at: expiresAt.toISOString()
      };

      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert(insertData);

      if (insertError) {
        return { error: 'Erro ao salvar código' };
      }

      // Em produção, aqui seria enviado email/SMS real
      console.log(`Código de verificação para ${emailOrPhone}: ${code}`);
      
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const verifyCode = async (emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<AuthResponse> => {
    try {
      const { data: verification, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq(type, emailOrPhone)
        .eq('code', code)
        .eq('type', `${type}_verification`)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !verification) {
        return { error: 'Código inválido ou expirado' };
      }

      // Marcar código como usado
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', verification.id);

      // Atualizar verificação do usuário
      if (verification.user_id) {
        await supabase
          .from('users')
          .update({ [`${type}_verified`]: true })
          .eq('id', verification.user_id);
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
