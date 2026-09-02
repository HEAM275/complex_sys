import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Dashboard.css';

const Dashboard = () => {
  // 👇 Esta línea faltaba: obtener user y logout del contexto
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h2 className="page-title">Dashboard</h2>
          <div className="user-info">
            {/* 👇 user?.username en lugar de user?.name, porque tu JWT retorna "username" */}
            <span className="user-name">👤 {user?.username || 'Usuario'}</span>
            
            <button onClick={logout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Ventas Totales</h3>
              <p className="stat-value">$0.00</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Pedidos</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <h3>Productos en Stock</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3>Correos Enviados</h3>
              <p className="stat-value">0</p>
            </div>
          </div>
        </div>

        <div className="components-section">
          <h3>Componentes del Sistema</h3>
          <div className="components-grid">
            <div className="component-card">
              <h4> Autenticación</h4>
              <p>Gestión de usuarios y sesiones</p>
            </div>
            <div className="component-card">
              <h4>💰 Ventas</h4>
              <p>Registro y seguimiento de ventas</p>
            </div>
            <div className="component-card">
              <h4>📦 Pedidos</h4>
              <p>Administración de pedidos</p>
            </div>
            <div className="component-card">
              <h4>🏪 Almacén</h4>
              <p>Control de inventario y stock</p>
            </div>
            <div className="component-card">
              <h4>📧 Correos</h4>
              <p>Envío y gestión de correos</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;