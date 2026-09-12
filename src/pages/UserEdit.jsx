import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import { userService } from '../services/userService';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (err) {
        setError('No se pudo cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await userService.updateUser(id, formData);
      navigate('/users', { state: { message: 'Usuario actualizado exitosamente' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="loading-state">Cargando...</div></Layout>;
  if (error && !user) return <Layout><div className="error-state">{error}</div></Layout>;

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Editar Usuario: {user?.username}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <UserForm 
          initialData={user} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </Layout>
  );
};

export default UserEdit;