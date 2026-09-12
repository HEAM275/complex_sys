import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import './UserForm.css';

const UserForm = ({ initialData, onSubmit, isSubmitting }) => {
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '', // En edición, se deja vacío por defecto
    roles: initialData?.roles?.map(r => typeof r === 'string' ? r : r.uuid) || [],
  });

  const [availableRoles, setAvailableRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await userService.getRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Error cargando roles:', error);
      }
    };
    loadRoles();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    // La contraseña solo es requerida en la creación, o si se escribió algo en edición
    if (!isEdit && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleChange = (roleUuid) => {
    setFormData(prev => {
      const roles = prev.roles.includes(roleUuid)
        ? prev.roles.filter(r => r !== roleUuid)
        : [...prev.roles, roleUuid];
      return { ...prev, roles };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Nombre de Usuario *</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={errors.username ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.username && <span className="error-msg">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label>Correo Electrónico *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>
          Contraseña {isEdit && <span className="optional">(Dejar en blanco para mantener la actual)</span>}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.password && <span className="error-msg">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label>Roles Asignados</label>
        <div className="roles-container">
          {availableRoles.map(role => (
            <label key={role.uuid} className="role-checkbox">
              <input
                type="checkbox"
                checked={formData.roles.includes(role.uuid)}
                onChange={() => handleRoleChange(role.uuid)}
                disabled={isSubmitting}
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar Usuario' : 'Crear Usuario')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;