import { ApiResponse, Employee, EmployeeFormData, LoginRequest, LoginResponse } from '@/types/employee';
import { httpClient } from './httpInterceptor';
import { authService } from './auth';

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    // Handle HTTP errors
    const errorData = await response.json().catch(() => null);
    return {
      error: errorData?.error || `HTTP Error: ${response.status}`,
      data: null,
      code: response.status,
      state: null
    };
  }
  
  return await response.json();
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
          error: errorData?.message || `Erreur HTTP: ${response.status}`,
          data: null,
          code: response.status,
          state: null
        };
      }
      
      // Le backend renvoie directement l'objet LoginResponse
      const loginData: LoginResponse = await response.json();
      
      // Store tokens if login successful
      if (loginData.accessToken) {
        authService.storeTokens(loginData);
      }
      
      return {
        error: null,
        data: loginData,
        code: 200,
        state: 'success'
      };
    } catch (error) {
      return {
        error: 'Erreur de connexion au serveur',
        data: null,
        code: 500,
        state: null
      };
    }
  },

  logout: () => {
    authService.clearAuth();
  }
};

// Employee API
export const employeeApi = {
  // Get all employees
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    try {
      const response = await httpClient.get('/employes');
      
      return await handleApiResponse<Employee[]>(response);
    } catch (error) {
      return {
        error: 'Erreur lors de la récupération des employés',
        data: null,
        code: 500,
        state: null
      };
    }
  },

  // Get employee by ID
  getById: async (id: number): Promise<ApiResponse<Employee>> => {
    try {
      const response = await httpClient.get(`/employes/${id}`);
      
      return await handleApiResponse<Employee>(response);
    } catch (error) {
      return {
        error: 'Erreur lors de la récupération de l\'employé',
        data: null,
        code: 500,
        state: null
      };
    }
  },

  // Create new employee
  create: async (employeeData: EmployeeFormData): Promise<ApiResponse<Employee>> => {
    try {
      const response = await httpClient.post('/employes', employeeData);
      
      return await handleApiResponse<Employee>(response);
    } catch (error) {
      return {
        error: 'Erreur lors de la création de l\'employé',
        data: null,
        code: 500,
        state: null
      };
    }
  },

  // Update employee
  update: async (id: number, employeeData: EmployeeFormData): Promise<ApiResponse<Employee>> => {
    try {
      const response = await httpClient.put(`/employes/${id}`, employeeData);
      
      return await handleApiResponse<Employee>(response);
    } catch (error) {
      return {
        error: 'Erreur lors de la mise à jour de l\'employé',
        data: null,
        code: 500,
        state: null
      };
    }
  },

  // Delete employee
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.delete(`/employes/${id}`);
      
      return await handleApiResponse<void>(response);
    } catch (error) {
      return {
        error: 'Erreur lors de la suppression de l\'employé',
        data: null,
        code: 500,
        state: null
      };
    }
  }
};
