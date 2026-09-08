import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated,user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login guardando la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
   // ✅ Verificar rol si se requiere
  if (requiredRole && user?.roles) {
    // Manejar ambos formatos (strings u objetos)
    const hasRole = user.roles.some(role => 
      typeof role === 'string' 
        ? role.toLowerCase() === requiredRole.toLowerCase()
        : role.name?.toLowerCase() === requiredRole.toLowerCase()
    );
    
    if (!hasRole) {
      // Redirigir a dashboard o a una página 403
      return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;