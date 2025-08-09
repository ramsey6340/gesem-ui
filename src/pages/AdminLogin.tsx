import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { authApi } from "@/services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentative de connexion pour:", formData.username);
      
      const result = await authApi.login({
        username: formData.username,
        password: formData.password
      });

      console.log("Réponse de l'API:", result);

      if (result.error) {
        console.error("Erreur API:", result.error);
        setError(result.error);
      } else if (result.data?.accessToken) {
        console.log("Connexion réussie !");
        console.log("Utilisateur:", result.data.fullName);
        console.log("Rôle:", result.data.role);
        navigate('/admin/dashboard');
      } else {
        console.error("Réponse inattendue:", result);
        setError("Erreur de connexion inattendue - Vérifiez la console pour plus de détails");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Gesem Admin
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connectez-vous pour accéder au système de gestion des employés
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Nom d'utilisateur
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Compte de démonstration :</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
              admin / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
