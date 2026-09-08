import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Forbidden.css';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="forbidden-container">
      <div className="forbidden-content">
        <h1 className="forbidden-code">403</h1>
        <h2 className="forbidden-title">Acceso Denegado</h2>
        <p className="forbidden-message">
          No tienes permisos suficientes para acceder a esta sección.
        </p>
        <div className="forbidden-actions">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Volver atrás
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;