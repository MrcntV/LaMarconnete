import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { apiGet } from '../api';
import { Customer, Order } from '../types';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiGet('/api/customers'),
      apiGet('/api/orders?limit=999')
    ]).then(([cData, oData]) => {
      setCustomers((cData as { customers: Customer[] }).customers || []);
      setOrders((oData as { orders: Order[] }).orders || []);
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getCustomerOrderCount = (customerId: string) =>
    orders.filter(o => o.customerId === customerId).length;

  const getCustomerTotal = (customerId: string) =>
    orders.filter(o => o.customerId === customerId && o.paymentStatus === 'paid')
      .reduce((acc, o) => acc + o.total, 0);

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase());
    const matchActive = !activeFilter || String(c.active) === activeFilter;
    return matchSearch && matchActive;
  });

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Clients</h2>
        <span className="text-muted">{customers.length} client(s) au total</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <input
          type="text"
          className="input"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input select" value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Désactivés</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Commandes</th>
                <th>Total dépensé</th>
                <th>Inscrit le</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="table-loading">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="table-empty">Aucun client trouvé</td></tr>
              ) : (
                filtered.map(customer => (
                  <tr key={customer.id} className="row-clickable" onClick={() => navigate(`/customers/${customer.id}`)}>
                    <td className="font-medium">{customer.firstName} {customer.lastName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>
                    <td>{customer.city || '—'}</td>
                    <td>{getCustomerOrderCount(customer.id)}</td>
                    <td>{getCustomerTotal(customer.id).toFixed(2)} €</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td><Badge status={customer.active ? 'active' : 'inactive'} /></td>
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

export default Customers;
