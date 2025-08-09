import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Edit, Trash2, Users, Building2, LogOut, Filter, Loader2 } from "lucide-react";
import { Employee, EmployeeFormData, EmployeeFilters } from "@/types/employee";
import EmployeeDialog from "@/components/EmployeeDialog";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "@/hooks/useEmployees";
import { authApi } from "@/services/api";
import { authService } from "@/services/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Available positions for filtering
const positions = [
  "Développeur",
  "Designer", 
  "Chef de projet",
  "Analyste",
  "Consultant",
  "Manager",
  "Directeur"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, clearError } = useEmployees();
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    poste: "all"
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [formError, setFormError] = useState<string | null>(null);

  // Log d'état initial
  useEffect(() => {
    console.log('AdminDashboard - État initial:', {
      isAuthenticated: authService.isAuthenticated(),
      accessToken: authService.getAccessToken() ? '***' : 'non défini',
      employeesCount: employees.length,
      loading,
      error
    });
  }, []);

  // Log quand les employés changent
  useEffect(() => {
    if (employees.length > 0) {
      console.log('AdminDashboard - Employés chargés:', employees);
    }
  }, [employees]);

  // Log des erreurs
  useEffect(() => {
    if (error) {
      console.error('AdminDashboard - Erreur:', error);
    }
  }, [error]);

  // Filtered employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.poste.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesPoste = filters.poste === "all" || employee.poste === filters.poste;
      
      return matchesSearch && matchesPoste;
    });
  }, [employees, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const postes = [...new Set(employees.map(emp => emp.poste))];
    const posteCounts = postes.reduce((acc, poste) => {
      acc[poste] = employees.filter(emp => emp.poste === poste).length;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, postes, posteCounts };
  }, [employees]);

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    // S'assurer que l'employé a un ID valide
    if (!employee?.id) {
      console.error('Tentative d\'édition d\'un employé sans ID valide:', employee);
      setFormError('Impossible de modifier cet employé : ID manquant');
      return;
    }
    
    // Mettre à jour l'employé sélectionné et le mode
    setSelectedEmployee(employee);
    setDialogMode('edit');
    // Ne pas ouvrir le dialogue tant que l'état n'est pas mis à jour
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    if (!employeeId) {
      console.error('Tentative de suppression avec un ID invalide:', employeeId);
      setFormError('Impossible de supprimer : ID d\'employé invalide');
      return;
    }
    console.log('Suppression de l\'employé ID:', employeeId);
    deleteEmployee(employeeId);
  };

  const handleSaveEmployee = (data: EmployeeFormData) => {
    console.log('Sauvegarde en mode:', dialogMode, 'avec données:', data);
    
    if (dialogMode === 'add') {
      createEmployee(data);
    } else if (selectedEmployee?.id) {
      console.log('Mise à jour de l\'employé ID:', selectedEmployee.id);
      updateEmployee(selectedEmployee.id, data);
    } else {
      console.error('Impossible de sauvegarder : employé sélectionné invalide', selectedEmployee);
      setFormError('Impossible de sauvegarder : employé invalide');
    }
    
    // Fermer le dialogue après la sauvegarde
    setDialogOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gesem Admin</h1>
                <p className="text-sm text-gray-500">Tableau de bord</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Postes Différents</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.postes.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestion des Employés</CardTitle>
                <CardDescription>
                  Gérez les informations de vos employés
                </CardDescription>
              </div>
              <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Error Display */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearError}
                    className="ml-2 h-auto p-1 text-red-600 hover:text-red-800"
                  >
                    Fermer
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Chargement des employés...</span>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou poste..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select 
                value={filters.poste} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, poste: value }))}
              >
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tous les postes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  {stats.postes.map((poste) => (
                    <SelectItem key={poste} value={poste}>
                      {poste}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredEmployees.length} employé(s) trouvé(s)
              </p>
            </div>

            {/* Employee Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Date d'embauche</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.poste}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(employee.hiringDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer {employee.firstName} {employee.lastName} ? 
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun employé trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employee Dialog */}
      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={dialogMode}
      />
    </div>
  );
};

export default AdminDashboard;
