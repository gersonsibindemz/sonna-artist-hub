
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  phone: string;
  onBack: () => void;
}

const OTPVerification = ({ phone, onBack }: OTPVerificationProps) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo à plataforma Sonna For Artists",
      });
    } catch (error: any) {
      console.error("Erro na verificação OTP:", error);
      toast({
        title: "Erro",
        description: error.message || "Código de verificação inválido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) throw error;

      toast({
        title: "Código reenviado!",
        description: "Um novo código foi enviado para seu telefone",
      });
    } catch (error: any) {
      console.error("Erro ao reenviar OTP:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao reenviar código",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white">Verificar Telefone</CardTitle>
        <CardDescription className="text-gray-300">
          Digite o código de 6 dígitos enviado para {phone}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-white">Código de Verificação</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
            disabled={loading || token.length !== 6}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </Button>
        </form>
        
        <div className="mt-4 space-y-2 text-center">
          <button
            onClick={handleResendOTP}
            className="text-yellow-400 hover:text-yellow-300 text-sm"
            disabled={loading}
          >
            Reenviar código
          </button>
          <br />
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Voltar
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
