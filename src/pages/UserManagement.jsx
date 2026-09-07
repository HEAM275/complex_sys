import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { userService } from '../services/userService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? 'badge badge-admin' : 'badge badge-customer';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge badge-active';
      case 'inactive': return 'badge badge-inactive';
      case 'pending': return 'badge badge-pending';
      default: return 'badge';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

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
            <select className="filter-select">
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
              <p>No se encontraron usuarios</p>
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
                        <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                        <span className="username">{user.username}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(user.status)}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="date-cell">{user.createdAt}</td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" title="Editar">✏️</button>
                        <button 
                          className="btn-icon btn-delete" 
                          title="Eliminar"
                          onClick={() => handleDelete(user.id)}
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