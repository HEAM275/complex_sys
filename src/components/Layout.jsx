import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
              <a href="/dashboard" className="nav-link active">
                📊 Dashboard
              </a>
            </li>
            <li>
              <a href="/users" className="nav-link">👥 Gestión de Usuarios</a>
            </li>
            <li>
              <a href="#ventas" className="nav-link">
                💰 Ventas
              </a>
            </li>
            <li>
              <a href="#pedidos" className="nav-link">
                📦Pedidos
              </a>
            </li>
            <li>
              <a href="#almacen" className="nav-link">
                🏪 Almacén
              </a>
            </li>
            <li>
              <a href="#correos" className="nav-link">
                📧 Correos
              </a>
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