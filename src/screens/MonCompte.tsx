import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number }>;
}

interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
};

const statusColors: Record<string, string> = {
  pending: '#d69e2e',
  confirmed: '#3182ce',
  shipped: '#6b46c1',
  delivered: '#38a169',
  cancelled: '#e53e3e'
};

const MonCompte: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState<Partial<CustomerProfile>>({});

  const token = localStorage.getItem('customer_token');

  useEffect(() => {
    if (!token) {
      navigate('/connexion');
      return;
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        fetch('/api/auth/customer/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/auth/customer/me', { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(customer => fetch(`/api/orders/customer/${customer.id}`, { headers: { Authorization: `Bearer ${token}` } }))
      ]);

      if (!profileRes.ok) {
        localStorage.removeItem('customer_token');
        navigate('/connexion');
        return;
      }

      const profileData = await profileRes.json();
      setProfile(profileData);
      setProfileForm(profileData);

      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/auth/customer/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      const updated = await res.json();
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    navigate('/');
  };

  if (loading) return (
    <div className="mon-compte-loading">
      <p>Chargement de votre compte...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mon-compte-page"
    >
      <div className="mon-compte-container">
        <div className="mon-compte-header">
          <div>
            <h1>Mon compte</h1>
            {profile && <p>Bonjour, {profile.firstName} !</p>}
          </div>
          <button className="mon-compte-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>

        {error && <div className="mon-compte-error">{error}</div>}

        <div className="mon-compte-tabs">
          <button
            className={`mon-compte-tab ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Mes commandes
          </button>
          <button
            className={`mon-compte-tab ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}
          >
            Mon profil
          </button>
        </div>

        {tab === 'orders' && (
          <div className="mon-compte-orders">
            {orders.length === 0 ? (
              <div className="mon-compte-empty">
                <p>Vous n'avez pas encore de commandes.</p>
                <a href="/Boutique" className="mon-compte-shop-link">Découvrir nos produits</a>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-number">{order.orderNumber}</span>
                        <span className="order-date">{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span
                        className="order-status-badge"
                        style={{ backgroundColor: statusColors[order.status] + '20', color: statusColors[order.status] }}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <div className="order-card-items">
                      {order.items.map((item, i) => (
                        <span key={i} className="order-item-label">{item.name} ×{item.qty}</span>
                      ))}
                    </div>
                    <div className="order-card-footer">
                      <span className="order-total">{order.total.toFixed(2)} €</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && profile && (
          <div className="mon-compte-profile">
            {saveSuccess && <div className="mon-compte-success">Profil mis à jour avec succès.</div>}
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="profile-row">
                <div className="profile-field">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={profileForm.firstName || ''}
                    onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
                <div className="profile-field">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={profileForm.lastName || ''}
                    onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input
                  type="email"
                  value={profileForm.email || ''}
                  onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="profile-field">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={profileForm.phone || ''}
                  onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="profile-field">
                <label>Adresse</label>
                <input
                  type="text"
                  value={profileForm.address || ''}
                  onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="profile-row">
                <div className="profile-field">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={profileForm.city || ''}
                    onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div className="profile-field">
                  <label>Code postal</label>
                  <input
                    type="text"
                    value={profileForm.postalCode || ''}
                    onChange={e => setProfileForm(f => ({ ...f, postalCode: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="profile-save-btn" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer mes informations'}
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MonCompte;
