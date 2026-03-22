import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEuroSign, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { apiGet } from '../api';
import { Order, StockItem, NewsletterSubscriber } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockItem[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/api/orders?limit=10'),
      apiGet('/api/stock/alerts'),
      apiGet('/api/newsletter/subscribers'),
      apiGet('/api/customers')
    ]).then(([ordersData, alerts, subscribers, customers]) => {
      setOrders((ordersData as { orders: Order[] }).orders || []);
      setStockAlerts(Array.isArray(alerts) ? (alerts as StockItem[]) : []);
      setSubscriberCount(Array.isArray(subscribers) ? (subscribers as NewsletterSubscriber[]).filter(s => s.active).length : 0);
      setCustomerCount((customers as { total: number }).total || 0);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const caThisMois = orders
    .filter(o => {
      const d = new Date(o.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="screen-dashboard">
      <div className="stats-grid">
        <StatCard
          icon={<FaShoppingCart />}
          title="Total commandes"
          value={totalOrders}
          color="#546863"
        />
        <StatCard
          icon={<FaEuroSign />}
          title="CA du mois"
          value={`${caThisMois.toFixed(2)} €`}
          color="#a6b4aa"
        />
        <StatCard
          icon={<FaUsers />}
          title="Clients"
          value={customerCount}
          color="#4a7c7a"
        />
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Stock bas"
          value={stockAlerts.length}
          color={stockAlerts.length > 0 ? '#d69e2e' : '#38a169'}
        />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Dernières commandes</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/orders')}>Voir tout</button>
          </div>
          {loading ? (
            <p className="loading-text">Chargement...</p>
          ) : orders.length === 0 ? (
            <p className="empty-text">Aucune commande</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} className="row-clickable" onClick={() => navigate(`/orders/${order.id}`)}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.total.toFixed(2)} €</td>
                    <td><Badge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-side">
          <div className="card">
            <div className="card-header"><h3>Stock — Alertes</h3></div>
            {stockAlerts.length === 0 ? (
              <p className="empty-text success-text">Tous les stocks sont OK</p>
            ) : (
              <ul className="alert-list">
                {stockAlerts.map(item => (
                  <li key={item.id} className="alert-item">
                    <span className="alert-name">{item.Titre}</span>
                    <Badge status={item.stock === 0 ? 'out' : 'low'} />
                    <span className="alert-stock">{item.stock} unité(s)</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <div className="card-header"><h3>Newsletter</h3></div>
            <div className="newsletter-stat">
              <span className="newsletter-count">{subscriberCount}</span>
              <span className="newsletter-label">abonnés actifs</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Récapitulatif financier (mois en cours)</h3></div>
            <div style={{ fontSize: 13, lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CA brut</span>
                <strong>{caThisMois.toFixed(2)} €</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                <span>Frais Stripe (~2.9% + 0.30€/cmd)</span>
                <span>−{(caThisMois * 0.029 + orders.filter(o => { const d = new Date(o.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length * 0.30).toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#16a34a', borderTop: '1px solid var(--border)', paddingTop: 4, marginTop: 4 }}>
                <span>Net estimé</span>
                <span>{(caThisMois - (caThisMois * 0.029 + orders.filter(o => { const d = new Date(o.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length * 0.30)).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
