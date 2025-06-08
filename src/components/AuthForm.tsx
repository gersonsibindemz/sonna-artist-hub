
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Headphones, TrendingUp, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import CountrySelector from "@/components/CountrySelector";
import { countries, detectUserCountry } from "@/data/countries";
import type { Country } from "@/types/auth";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    // Detectar país do usuário automaticamente
    const detectedCountryCode = detectUserCountry();
    const country = countries.find(c => c.code === detectedCountryCode) || countries[0];
    setSelectedCountry(country);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        const emailOrPhone = usePhone ? `${selectedCountry.dialCode}${phone}` : email;
        result = await login(emailOrPhone, password);
      } else {
        const emailValue = usePhone ? null : email;
        const phoneValue = usePhone ? `${selectedCountry.dialCode}${phone}` : null;
        result = await register(emailValue, phoneValue, password, selectedCountry.dialCode);
      }

      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      // O toast será exibido pelo hook useAuth
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
              Sua plataforma completa para distribuição e gestão musical
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Music className="h-6 w-6 text-yellow-400" />
              <span>Distribuição para todas as plataformas digitais</span>
            </div>
            <div className="flex items-center space-x-3">
              <Headphones className="h-6 w-6 text-yellow-400" />
              <span>Gestão completa de catálogo musical</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
              <span>Relatórios detalhados e analytics</span>
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
                ? "Entre na sua conta para acessar sua música" 
                : "Crie sua conta e comece a distribuir sua música hoje"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    onPhoneChange={setPhone}
                    phoneValue={phone}
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
                  minLength={6}
                />
              </div>

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
