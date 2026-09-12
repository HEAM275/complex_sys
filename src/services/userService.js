// // src/services/userService.js
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// // Datos de ejemplo (eliminar cuando conectes el backend real)
// // const mockUsers = [
// //   { id: '1', username: 'harold.abreu', email: 'harold@ejemplo.com', role: 'admin', status: 'active', createdAt: '2023-10-15' },
// //   { id: '2', username: 'maria.garcia', email: 'maria@ejemplo.com', role: 'customer', status: 'active', createdAt: '2023-11-02' },
// //   { id: '3', username: 'juan.perez', email: 'juan@ejemplo.com', role: 'customer', status: 'inactive', createdAt: '2023-11-10' },
// //   { id: '4', username: 'ana.lopez', email: 'ana@ejemplo.com', role: 'customer', status: 'pending', createdAt: '2023-11-12' },
// // ];

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('access_token');
//   return {
//     'Content-Type': 'application/json',
//     'Authorization': token ? `Bearer ${token}` : ''
//   };
// };

// export const userService = {
//   // Obtener todos los usuarios
//   getUsers: async () => {
//     // // Simulación de delay de red
//     // await new Promise(resolve => setTimeout(resolve, 500));
//     // return mockUsers;
    
//     //Cuando tengas el backend listo, descomenta esto:
//     const response = await fetch(`${API_URL}/users`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
//     });
//     return await response.json();
//   },

//   // Eliminar usuario
//   deleteUser: async (userId) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     console.log(`Usuario ${userId} eliminado`);
//     return true;
//   }
// };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Ajusta si tu router ya incluye /api

// Función auxiliar para obtener los headers con el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const userService = {
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    // ✅ 401 = Token inválido/expirado → cerrar sesión
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    // ✅ 403 = Sin permisos → NO cerrar sesión, solo lanzar error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'No tienes permisos para acceder');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al obtener usuarios');
    }

    return await response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login';
      throw new Error('Permisos insuficientes');
    }

    if (!response.ok) throw new Error('Error al eliminar usuario');
    return true;
  },
  getRoles: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener roles');
    return await response.json();
  },

  createUser: async (userData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Error al crear usuario');
    }
    return await response.json();
  },

  getUserById: async (userUuid) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userUuid}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Usuario no encontrado');
    return await response.json();
  },

  updateUser: async (userUuid, userData) => {
    // Si la contraseña está vacía, la eliminamos del payload para que el backend no intente actualizarla
    const payload = { ...userData };
    if (!payload.password) {
      delete payload.password;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userUuid}`, {
      method: 'PUT', // o PATCH, según como lo tengas en tu router
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Error al actualizar usuario');
    }
    return await response.json();
  }
};