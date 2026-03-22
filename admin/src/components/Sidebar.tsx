import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaWarehouse,
  FaUsers, FaFileInvoice, FaEnvelope, FaMapMarkerAlt,
  FaEdit, FaCog, FaBars, FaTimes, FaHammer, FaTools
} from 'react-icons/fa';

const navItems = [
  { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/products', icon: <FaBox />, label: 'Produits' },
  { to: '/orders', icon: <FaShoppingCart />, label: 'Commandes' },
  { to: '/stock', icon: <FaWarehouse />, label: 'Stock' },
  { to: '/customers', icon: <FaUsers />, label: 'Clients' },
  { to: '/invoices', icon: <FaFileInvoice />, label: 'Factures' },
  { to: '/newsletter', icon: <FaEnvelope />, label: 'Newsletter' },
  { to: '/locations', icon: <FaMapMarkerAlt />, label: 'Points de vente' },
  { to: '/content', icon: <FaEdit />, label: 'Contenu du site' },
  { to: '/settings', icon: <FaCog />, label: 'Paramètres' }
];

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [buildLog, setBuildLog] = useState('');
  const [building, setBuilding] = useState<'site' | 'admin' | null>(null);
  const logRef = useRef<HTMLPreElement>(null);

  const runBuild = async (target: 'site' | 'admin') => {
    if (building) return;
    setBuilding(target);
    setBuildLog(`Build ${target === 'site' ? 'Site' : 'Admin'} en cours...\n`);

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/build/${target}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.body) throw new Error('Pas de stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setBuildLog(prev => {
          const updated = prev + chunk;
          setTimeout(() => {
            if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
          }, 0);
          return updated;
        });
      }
    } catch (err: any) {
      setBuildLog(prev => prev + `\nErreur: ${err.message}`);
    } finally {
      setBuilding(null);
    }
  };

  return (
    <>
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Menu"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-text">La marcOnnête</span>
          <span className="sidebar-brand-sub">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-deploy">
          <p className="sidebar-deploy-title">Déploiement</p>
          <button
            className={`sidebar-deploy-btn ${building === 'site' ? 'building' : ''}`}
            onClick={() => runBuild('site')}
            disabled={!!building}
          >
            <FaHammer style={{ marginRight: 6 }} />
            {building === 'site' ? 'Build en cours...' : 'Build Site'}
          </button>
          <button
            className={`sidebar-deploy-btn ${building === 'admin' ? 'building' : ''}`}
            onClick={() => runBuild('admin')}
            disabled={!!building}
          >
            <FaTools style={{ marginRight: 6 }} />
            {building === 'admin' ? 'Build en cours...' : 'Build Admin'}
          </button>
          {buildLog && (
            <pre ref={logRef} className="sidebar-build-log">{buildLog}</pre>
          )}
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0.0</span>
        </div>
      </aside>

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
