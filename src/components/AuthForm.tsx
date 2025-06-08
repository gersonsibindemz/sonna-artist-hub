
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Upload, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (usePhone) {
        // Autenticação por telefone
        if (isLogin) {
          const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
          });
          if (error) throw error;
          toast({
            title: "Código SMS enviado!",
            description: "Verifique seu telefone para o código de verificação",
          });
        } else {
          const { error } = await supabase.auth.signUp({
            phone: phone,
            password: password,
          });
          if (error) throw error;
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu telefone para confirmar a conta",
          });
        }
      } else {
        // Autenticação por email
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo à plataforma Sonna For Artists",
          });
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          });
          if (error) throw error;
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu email para confirmar a conta",
          });
        }
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      let errorMessage = "Erro desconhecido";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro no login social:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login social",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="flex flex-col justify-center text-white space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Sonna For Artists
            </h1>
            <p className="text-xl text-gray-300">
              Sua plataforma para distribuição musical digital
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-yellow-400" />
              <span>Cadastre até 2 artistas</span>
            </div>
            <div className="flex items-center space-x-3">
              <Music className="h-6 w-6 text-yellow-400" />
              <span>5 faixas por artista</span>
            </div>
            <div className="flex items-center space-x-3">
              <Upload className="h-6 w-6 text-yellow-400" />
              <span>Upload direto e simples</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? "Entre na sua conta para gerenciar seus artistas" 
                : "Crie sua conta e comece a distribuir sua música"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                disabled={loading}
                type="button"
              >
                <Mail className="h-4 w-4 mr-2" />
                Continuar com Google
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('apple')}
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold"
                disabled={loading}
                type="button"
              >
                🍎 Continuar com Apple
              </Button>
            </div>

            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="px-3 text-gray-400 text-sm">ou</span>
              <Separator className="flex-1" />
            </div>

            {/* Auth Method Toggle */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={!usePhone ? "default" : "outline"}
                onClick={() => setUsePhone(false)}
                className="flex-1"
                size="sm"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button
                type="button"
                variant={usePhone ? "default" : "outline"}
                onClick={() => setUsePhone(true)}
                className="flex-1"
                size="sm"
              >
                <Phone className="h-4 w-4 mr-1" />
                Telefone
              </Button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {usePhone ? (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="+351 912 345 678"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              )}
              
              {(!usePhone || !isLogin) && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-400 hover:text-yellow-300 text-sm"
              >
                {isLogin 
                  ? "Não tem conta? Criar nova conta" 
                  : "Já tem conta? Fazer login"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
