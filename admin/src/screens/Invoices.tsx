import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { apiGet, apiPost } from '../api';
import { Invoice } from '../types';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [generatingAll, setGeneratingAll] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    apiGet(`/api/invoices${params}`)
      .then((data: unknown) => setInvoices(Array.isArray(data) ? data as Invoice[] : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    try {
      const orders = await apiGet('/api/orders?limit=999') as { orders: Array<{ id: string; invoiceId: string | null }> };
      const missing = (orders.orders || []).filter(o => !o.invoiceId);
      for (const order of missing) {
        try {
          await apiPost(`/api/invoices/generate/${order.id}`, {});
        } catch {
          // skip
        }
      }
      await loadInvoices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setGeneratingAll(false);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Factures</h2>
        <button className="btn btn-secondary" onClick={generateAll} disabled={generatingAll}>
          {generatingAll ? 'Génération...' : 'Générer les factures manquantes'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="status-tabs">
        {[
          { value: '', label: 'Toutes' },
          { value: 'draft', label: 'Brouillon' },
          { value: 'sent', label: 'Envoyées' },
          { value: 'paid', label: 'Payées' }
        ].map(s => (
          <button
            key={s.value}
            className={`tab-btn ${statusFilter === s.value ? 'tab-btn-active' : ''}`}
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant TTC</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-loading">Chargement...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">Aucune facture</td></tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="font-medium">{invoice.invoiceNumber}</td>
                    <td className="text-muted">{invoice.orderId}</td>
                    <td>{invoice.customerName}</td>
                    <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                    <td className="font-medium">{invoice.total.toFixed(2)} €</td>
                    <td><Badge status={invoice.status} /></td>
                    <td>
                      <a
                        href={`/api/invoices/${invoice.id}/download`}
                        className="btn btn-sm btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Télécharger
                      </a>
                    </td>
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

export default Invoices;
