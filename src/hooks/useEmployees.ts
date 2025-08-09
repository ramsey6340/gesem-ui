import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { employeeApi } from '@/services/api';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all employees
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await employeeApi.getAll();
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setEmployees(result.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  // Create new employee
  const createEmployee = async (employeeData: EmployeeFormData): Promise<boolean> => {
    try {
      const result = await employeeApi.create(employeeData);
      
      if (result.error) {
        setError(result.error);
        return false;
      } else if (result.data) {
        setEmployees(prev => [...prev, result.data!]);
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la création de l\'employé');
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

  // Load employees on mount
  useEffect(() => {
    loadEmployees();
  }, []);

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
