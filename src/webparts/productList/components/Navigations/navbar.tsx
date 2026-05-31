import * as React from 'react';
import { useState } from 'react';
import '../CSS/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>

      {/* Hamburger Menu */}
      <div
        className="hamburger"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        ☰
      </div>
      <div className="role-badge">

        Logged User Role:
        

      </div>

      {/* Dashboard */}
      <div className="menu-item">
        <span className="icon">🏠</span>

        {!isCollapsed && (
          <span className="menu-text">Dashboard</span>
        )}
      </div>

      {/* Forms */}
      <div
        className="menu-item"
        onClick={() => setShowForms(!showForms)}
      >
        <span className="icon">📋</span>

        {!isCollapsed && (
          <>
            <span className="menu-text">Forms</span>

            <span className="arrow">
              {showForms ? '▼' : '▶'}
            </span>
          </>
        )}
      </div>

      {!isCollapsed && showForms && (
        <div className="submenu">
          <div
            className="submenu-item"
            onClick={() => navigate('/products')}
          >
            Products
          </div>
        </div>
      )}

      {/* Users */}
      <div
        className="menu-item"
        onClick={() => setShowUsers(!showUsers)}
      >
        <span className="icon">👥</span>

        {!isCollapsed && (
          <>
            <span className="menu-text">Users</span>

            <span className="arrow">
              {showUsers ? '▼' : '▶'}
            </span>
          </>
        )}
      </div>

      {!isCollapsed && showUsers && (
        <div className="submenu">
          <div className="submenu-item">
            View Users
          </div>

          <div className="submenu-item">
            Manage Users
          </div>
        </div>
      )}

    </div>
  );
};

export default Navbar;