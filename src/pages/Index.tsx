import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Gesem</h1>
          <p className="text-xl text-gray-600 mb-8">
            Système de Gestion des Employés Moderne
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gestion des Employés</h3>
            <p className="text-sm text-gray-600">Gérez facilement vos employés et leurs informations</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Sécurisé</h3>
            <p className="text-sm text-gray-600">Interface d'administration sécurisée</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Moderne</h3>
            <p className="text-sm text-gray-600">Interface utilisateur moderne et intuitive</p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/admin/login')}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          Accès Administrateur
        </Button>
      </div>
    </div>
  );
};

export default Index;
