import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // ✅ Agregar useLocation y Link
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext'; // ✅ Importar useAuth
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // ✅ Obtener la ruta actual
  const { user } = useAuth(); // ✅ Obtener el usuario actual
  
  console.log('usuario actual :', user)
  console.log('📋 Roles del usuario:', user?.roles);

  const isAdmin = () => {
  if (!user || !user.roles || user.roles.length === 0) return false;
  
  // Caso 1: Si los roles son un array de strings (ej: ['admin'])
  if (typeof user.roles[0] === 'string') {
    return user.roles.some(role => role.toLowerCase() === 'admin');
  }
  
  // Caso 2: Si los roles son un array de objetos (ej: [{ name: 'admin', uuid: '...' }])
  return user.roles.some(role => role.name?.toLowerCase() === 'admin');
  };


  // ✅ Función para verificar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="logo">Sistema de Gestión</h1>
        </div>
        <div className="header-right">
          <ThemeToggle />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <nav className="nav-menu">
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                📊 Dashboard
              </Link>
            </li>
            
            {/* ✅ Solo mostrar si es admin */}
            {isAdmin() && (
              <li>
                <Link 
                  to="/users" 
                  className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                >
                  👥 Gestión de Usuarios
                </Link>
              </li>
            )}
            
            <li>
              <Link 
                to="/ventas" 
                className={`nav-link ${isActive('/ventas') ? 'active' : ''}`}
              >
                💰 Ventas
              </Link>
            </li>
            
            <li>
              <Link 
                to="/pedidos" 
                className={`nav-link ${isActive('/pedidos') ? 'active' : ''}`}
              >
                📦 Pedidos
              </Link>
            </li>
            
            <li>
              <Link 
                to="/almacen" 
                className={`nav-link ${isActive('/almacen') ? 'active' : ''}`}
              >
                🏪 Almacén
              </Link>
            </li>
            
            <li>
              <Link 
                to="/correos" 
                className={`nav-link ${isActive('/correos') ? 'active' : ''}`}
              >
                📧 Correos
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;