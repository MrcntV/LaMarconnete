import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaWarehouse,
  FaUsers, FaFileInvoice, FaEnvelope, FaMapMarkerAlt,
  FaEdit, FaCog, FaBars, FaTimes
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
