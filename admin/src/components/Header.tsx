import React, { useEffect, useState, useRef } from 'react';
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

interface StockAlert {
  id: string;
  Titre: string;
  stock: number;
  stockAlert: number;
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const title = Object.keys(routeTitles).find(k => location.pathname.startsWith(k))
    ? routeTitles[Object.keys(routeTitles).find(k => location.pathname.startsWith(k))!]
    : 'Admin';

  useEffect(() => {
    apiGet('/api/stock/alerts')
      .then((data: unknown) => {
        if (Array.isArray(data)) setAlerts(data as StockAlert[]);
      })
      .catch(() => {});
  }, [location.pathname]);

  // Fermer le dropdown si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-notification" ref={notifRef} onClick={() => setShowNotif(v => !v)}>
          <FaBell />
          {alerts.length > 0 && (
            <span className="notification-badge">{alerts.length}</span>
          )}
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                {alerts.length === 0 ? 'Aucune alerte' : `${alerts.length} alerte${alerts.length > 1 ? 's' : ''} stock`}
              </div>
              {alerts.length === 0 ? (
                <div className="notif-empty">Tous les stocks sont OK</div>
              ) : (
                <ul className="notif-list">
                  {alerts.map(a => (
                    <li key={a.id} className="notif-item">
                      <span className="notif-item-name">{a.Titre}</span>
                      <span className="notif-item-stock">
                        Stock : <strong style={{ color: a.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>{a.stock}</strong>
                        {' / seuil '}{a.stockAlert}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
