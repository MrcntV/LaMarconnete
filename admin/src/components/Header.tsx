import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../api';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Produits',
  '/orders': 'Commandes',
  '/stock': 'Gestion du Stock',
  '/customers': 'Clients',
  '/invoices': 'Factures',
  '/newsletter': 'Newsletter',
  '/locations': 'Points de Vente',
  '/content': 'Contenu du Site',
  '/settings': 'Paramètres'
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [lowStockCount, setLowStockCount] = useState(0);

  const title = Object.keys(routeTitles).find(k => location.pathname.startsWith(k))
    ? routeTitles[Object.keys(routeTitles).find(k => location.pathname.startsWith(k))!]
    : 'Admin';

  useEffect(() => {
    apiGet('/api/stock/alerts')
      .then((data: unknown) => {
        if (Array.isArray(data)) setLowStockCount(data.length);
      })
      .catch(() => {});
  }, [location.pathname]);

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-notification">
          <FaBell />
          {lowStockCount > 0 && (
            <span className="notification-badge">{lowStockCount}</span>
          )}
        </div>
        <div className="header-user">
          <span className="header-username">{user?.firstName} {user?.lastName}</span>
          <span className="header-role">{user?.role}</span>
        </div>
        <button className="btn btn-icon btn-secondary" onClick={logout} title="Déconnexion">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
