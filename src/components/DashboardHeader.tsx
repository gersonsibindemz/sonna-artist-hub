
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfile from "@/components/UserProfile";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Sonna For Artists
            </h1>
            <p className="text-gray-300">
              Bem-vindo, {user?.email || 'Usuário'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(true)}
              className="text-white hover:bg-white/10"
            >
              <User className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default DashboardHeader;
