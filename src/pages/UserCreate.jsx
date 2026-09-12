import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import { userService } from '../services/userService';

const UserCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await userService.createUser(formData);
      navigate('/users', { state: { message: 'Usuario creado exitosamente. Se ha enviado un correo de verificación.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Crear Nuevo Usuario</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default UserCreate;