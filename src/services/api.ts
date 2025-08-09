import { ApiResponse, Employee, EmployeeFormData, LoginRequest, LoginResponse } from '@/types/employee';
import { httpClient } from './httpInterceptor';
import { authService } from './auth';

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  console.log('=== Début handleApiResponse ===');
  console.log('URL:', response.url);
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  
  try {
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      const responseText = await response.text();
      console.log('Réponse brute:', responseText);
      
      try {
        responseData = JSON.parse(responseText);
        console.log('Données JSON parsées:', responseData);
      } catch (e) {
        console.error('Erreur lors du parsing JSON:', e);
        return {
          error: 'Format de réponse invalide',
          data: null,
          code: response.status,
          state: null
        };
      }
    } else {
      const text = await response.text();
      console.log('Réponse non-JSON reçue:', text);
      throw new Error('Réponse non-JSON reçue du serveur');
    }

    if (!response.ok) {
      console.error('Erreur HTTP:', response.status, responseData);
      return {
        error: responseData?.error || `HTTP Error: ${response.status}`,
        data: null,
        code: response.status,
        state: responseData?.state || null
      };
    }

    console.log('Réponse API traitée avec succès:', responseData);
    return responseData;
  } catch (error) {
    console.error('Erreur lors du traitement de la réponse:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur inconnue lors du traitement de la réponse',
      data: null,
      code: response.status || 500,
      state: null
    };
  }
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
