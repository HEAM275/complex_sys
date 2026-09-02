// Función para decodificar JWT sin verificar la firma (solo para obtener datos)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error en el registro');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error en el login');
      }
      
      // Guardar tokens en localStorage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Decodificar el JWT para obtener información del usuario
        const decoded = decodeJWT(data.access_token);
        if (decoded) {
          const userInfo = {
            uuid: decoded.sub,
            username: decoded.username,
            email: decoded.email,
            roles: decoded.roles || [],
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      // Opcional: notificar al backend para invalidar tokens
      if (accessToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Si falla la llamada al backend, continuar con el logout local
        });
      }
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Verificar email
  verifyEmail: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error en la verificación');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');
    
    if (userStr && accessToken) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return false;
    
    // Verificar si el token está expirado
    const decoded = decodeJWT(accessToken);
    if (!decoded || !decoded.exp) return false;
    
    const now = Date.now() / 1000;
    return decoded.exp > now;
  },

  // Obtener token de acceso
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  // Actualizar token usando refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No hay refresh token');

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al renovar token');
      }

      // Guardar nuevos tokens
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      // Actualizar información del usuario
      const decoded = decodeJWT(data.access_token);
      if (decoded) {
        const userInfo = {
          uuid: decoded.sub,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles || [],
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }

      return data;
    } catch (error) {
      // Si falla el refresh, hacer logout
      authService.logout();
      throw error;
    }
  }
};