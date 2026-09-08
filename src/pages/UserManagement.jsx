import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { userService } from '../services/userService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userUuid) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.deleteUser(userUuid);
        setUsers(prevUsers => prevUsers.filter(u => u.uuid !== userUuid));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // ==========================================
  // ✅ FUNCIONES AUXILIARES (MOVIDAS ARRIBA)
  // ==========================================

  const getUserRoleName = (user) => {
    if (!user.roles || user.roles.length === 0) return 'customer';
    const adminRole = user.roles.find(r => r.name === 'admin');
    if (adminRole) return 'admin';
    return user.roles[0]?.name || 'customer';
  };

  const getRoleBadgeClass = (roleName) => {
    return roleName === 'admin' ? 'badge badge-admin' : 'badge badge-customer';
  };

  const getRoleText = (roleName) => {
    return roleName === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE';
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive ? 'badge badge-active' : 'badge badge-inactive';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'ACTIVO' : 'INACTIVO';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleString('es-ES', options);
  };

  // ==========================================
  // ✅ FILTRADO (AHORA SÍ PUEDE USAR LAS FUNCIONES)
  // ==========================================

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = getUserRoleName(user);
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // ==========================================
  // ✅ RENDERIZADO
  // ==========================================

  if (error && error.includes('permisos')) {
    return (
      <Layout>
        <div className="error-state">
          <span className="error-icon">🔒</span>
          <h2>Acceso Restringido</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Volver al Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-management">
        <div className="page-header">
          <div>
            <h2 className="page-title">Gestión de Usuarios</h2>
            <p className="page-subtitle">Administra los usuarios y sus permisos en la plataforma</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/users/new')}>
            + Nuevo Usuario
          </button>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select 
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="customer">Cliente</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👤</span>
              <p>
                {searchTerm || roleFilter !== 'all' 
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'No se encontraron usuarios'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha de Registro</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.uuid}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{(user.username || user.email).charAt(0).toUpperCase()}</div>
                        <span className="username">{user.username}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      {(() => {
                        const roleName = getUserRoleName(user);
                        return (
                          <span className={getRoleBadgeClass(roleName)}>
                            {getRoleText(roleName)}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(user.is_active)}>
                        {getStatusText(user.is_active)}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(user.created_at)}</td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" title="Editar">✏️</button>
                        <button 
                          className="btn-icon btn-delete" 
                          title="Eliminar"
                          onClick={() => handleDelete(user.uuid)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;