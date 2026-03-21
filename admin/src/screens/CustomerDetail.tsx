import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { apiGet, apiPut } from '../api';
import { Customer, Order } from '../types';

const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      Promise.all([
        apiGet(`/api/customers/${id}`),
        apiGet(`/api/customers/${id}/orders`)
      ]).then(([cData, oData]) => {
        const c = cData as Customer;
        setCustomer(c);
        setForm(c);
        setOrders(Array.isArray(oData) ? oData as Order[] : []);
      }).catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const saveProfile = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const updated = await apiPut(`/api/customers/${id}`, form) as Customer;
      setCustomer(updated);
      setEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async () => {
    if (!customer) return;
    try {
      const updated = await apiPut(`/api/customers/${id}`, { active: !customer.active }) as Customer;
      setCustomer(updated);
      setForm(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) return <div className="loading-page">Chargement...</div>;
  if (!customer) return <div className="alert alert-error">Client introuvable</div>;

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h2>{customer.firstName} {customer.lastName}</h2>
          <Badge status={customer.active ? 'active' : 'inactive'} />
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/customers')}>Retour</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="order-grid">
        <div className="order-main">
          <div className="card">
            <div className="card-header">
              <h3>Profil</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditing(v => !v)}>
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>
            {editing ? (
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input className="input" value={form.firstName || ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input className="input" value={form.lastName || ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="input" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="input" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input className="input" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <input className="input" value={form.city || ''} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Code postal</label>
                  <input className="input" value={form.postalCode || ''} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pays</label>
                  <input className="input" value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                </div>
              </div>
            ) : (
              <div className="customer-info">
                <div className="info-row"><span>Email</span><span>{customer.email}</span></div>
                <div className="info-row"><span>Téléphone</span><span>{customer.phone || '—'}</span></div>
                <div className="info-row"><span>Adresse</span><span>{customer.address || '—'}</span></div>
                <div className="info-row"><span>Ville</span><span>{customer.city} {customer.postalCode}</span></div>
                <div className="info-row"><span>Pays</span><span>{customer.country}</span></div>
                <div className="info-row"><span>Newsletter</span><span><Badge status={customer.newsletter ? 'active' : 'inactive'} label={customer.newsletter ? 'Abonné' : 'Non abonné'} /></span></div>
                <div className="info-row"><span>Inscrit le</span><span>{new Date(customer.createdAt).toLocaleDateString('fr-FR')}</span></div>
              </div>
            )}
            {editing && (
              <div className="form-actions">
                <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="card-section-title">Historique des commandes</h3>
            {orders.length === 0 ? (
              <p className="empty-text">Aucune commande</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>N°</th><th>Date</th><th>Montant</th><th>Statut</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="row-clickable" onClick={() => navigate(`/orders/${o.id}`)}>
                      <td>{o.orderNumber}</td>
                      <td>{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                      <td>{o.total.toFixed(2)} €</td>
                      <td><Badge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="order-side">
          <div className="card">
            <h3 className="card-section-title">Actions</h3>
            <button
              className={`btn btn-full ${customer.active ? 'btn-danger' : 'btn-primary'}`}
              onClick={toggleActive}
            >
              {customer.active ? 'Désactiver le compte' : 'Réactiver le compte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
