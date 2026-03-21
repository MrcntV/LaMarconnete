import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { apiGet } from '../api';
import { Order } from '../types';

const STATUSES = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' }
];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = () => {
    setLoading(true);
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
    apiGet(`/api/orders${params}`)
      .then((data: unknown) => setOrders((data as { orders: Order[] }).orders || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const exportCSV = () => {
    const headers = ['N° Commande', 'Date', 'Client', 'Email', 'Montant', 'Statut', 'Paiement'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.date).toLocaleDateString('fr-FR'),
      o.customerName,
      o.customerEmail,
      o.total.toFixed(2),
      o.status,
      o.paymentStatus
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q);
  });

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Commandes</h2>
        <button className="btn btn-secondary" onClick={exportCSV}>Exporter CSV</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="status-tabs">
        {STATUSES.map(s => (
          <button
            key={s.value}
            className={`tab-btn ${statusFilter === s.value ? 'tab-btn-active' : ''}`}
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="input"
          placeholder="Rechercher par n° commande, client, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Date</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Paiement</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-loading">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">Aucune commande trouvée</td></tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="row-clickable" onClick={() => navigate(`/orders/${order.id}`)}>
                    <td className="font-medium">{order.orderNumber}</td>
                    <td>{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div>{order.customerName}</div>
                      <div className="text-muted text-sm">{order.customerEmail}</div>
                    </td>
                    <td className="font-medium">{order.total.toFixed(2)} €</td>
                    <td><Badge status={order.status} /></td>
                    <td><Badge status={order.paymentStatus} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
