import { useState, useEffect, useCallback } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { employeeApi } from '@/services/api';
import { authService } from '@/services/auth';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all employees
  const loadEmployees = useCallback(async () => {
    console.log('Chargement des employés...');
    try {
      setLoading(true);
      setError(null);
      console.log('Appel à employeeApi.getAll()...');
      const result = await employeeApi.getAll();
      console.log('Résultat de employeeApi.getAll():', result);
      
      if (result.error) {
        console.error('Erreur du serveur:', result.error);
        setError(result.error);
      } else if (result.data) {
        console.log('Employés chargés:', result.data);
        setEmployees(result.data);
      } else {
        console.error('Aucune donnée reçue du serveur');
        setError('Aucune donnée reçue du serveur');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des employés:', err);
      setError(`Erreur lors du chargement des employés: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load employees when component mounts and when auth token changes
  useEffect(() => {
    if (authService.isAuthenticated()) {
      console.log('Authentifié, chargement des employés...');
      loadEmployees();
    } else {
      console.log('Non authentifié, nettoyage des employés');
      setEmployees([]);
      setLoading(false);
    }
  }, [loadEmployees]);

  // Create new employee
  const createEmployee = async (employeeData: EmployeeFormData): Promise<boolean> => {
    try {
      console.log('Création d\'un nouvel employé:', employeeData);
      const result = await employeeApi.create(employeeData);
      console.log('Réponse de l\'API (création):', result);
      
      if (result.error) {
        console.error('Erreur lors de la création:', result.error);
        setError(result.error);
        return false;
      } 
      
      if (result.data && result.data.id) {
        console.log('Employé créé avec succès, ID:', result.data.id);
        setEmployees(prev => [...prev, result.data!]);
        return true;
      } else {
        console.error('Données de réponse invalides ou ID manquant:', result);
        setError('Réponse invalide du serveur lors de la création');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur lors de la création de l\'employé:', errorMessage, err);
      setError(`Erreur lors de la création de l'employé: ${errorMessage}`);
      return false;
    }
  };

  // Update employee
  const updateEmployee = async (id: number, employeeData: EmployeeFormData): Promise<boolean> => {
    try {
      const result = await employeeApi.update(id, employeeData);
      
      if (result.error) {
        setError(result.error);
        return false;
      } else if (result.data) {
        setEmployees(prev => 
          prev.map(emp => emp.id === id ? result.data! : emp)
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'employé');
      return false;
    }
  };

  // Delete employee
  const deleteEmployee = async (id: number): Promise<boolean> => {
    try {
      const result = await employeeApi.delete(id);
      
      if (result.error) {
        setError(result.error);
        return false;
      } else {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        return true;
      }
    } catch (err) {
      setError('Erreur lors de la suppression de l\'employé');
      return false;
    }
  };

  return {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    clearError: () => setError(null)
  };
};
