import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPut } from '../api';
import { Invoice, Product } from '../types';

interface InvoiceLine {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

const emptyLine = (): InvoiceLine => ({ productId: '', name: '', qty: 1, price: 0 });

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [generatingAll, setGeneratingAll] = useState(false);

  // Création manuelle
  const [showCreate, setShowCreate] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [lines, setLines] = useState<InvoiceLine[]>([emptyLine()]);
  const [taxRate, setTaxRate] = useState(20);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadInvoices(); }, [statusFilter]);

  const loadInvoices = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    apiGet(`/api/invoices${params}`)
      .then((data: unknown) => setInvoices(Array.isArray(data) ? data as Invoice[] : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setCustomerName(''); setCustomerEmail('');
    setLines([emptyLine()]); setTaxRate(20);
    setShowCreate(true);
    if (products.length === 0) {
      apiGet('/api/products')
        .then((data: unknown) => setProducts(Array.isArray(data) ? data as Product[] : []))
        .catch(() => {});
    }
  };

  const setLine = (idx: number, field: keyof InvoiceLine, value: string | number) => {
    setLines(ls => {
      const updated = [...ls];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const selectProduct = (idx: number, productId: string) => {
    const p = products.find(p => p.id === productId);
    setLines(ls => {
      const updated = [...ls];
      updated[idx] = { ...updated[idx], productId, name: p?.Titre || '', price: p?.Prix || 0 };
      return updated;
    });
  };

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const taxAmount = subtotal * taxRate / 100;
  const total = subtotal + taxAmount;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || lines.every(l => !l.name)) {
      setError('Nom client et au moins un article requis');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const invoice = await apiPost('/api/invoices', {
        customerName, customerEmail,
        items: lines.filter(l => l.name && l.qty > 0),
        taxRate,
      }) as Invoice;
      setInvoices(inv => [invoice, ...inv]);
      setShowCreate(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await apiPut(`/api/invoices/${id}/status`, { status }) as Invoice;
      setInvoices(inv => inv.map(i => i.id === updated.id ? updated : i));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    try {
      const orders = await apiGet('/api/orders?limit=999') as { orders: Array<{ id: string; invoiceId: string | null }> };
      const missing = (orders.orders || []).filter(o => !o.invoiceId);
      for (const order of missing) {
        try { await apiPost(`/api/invoices/generate/${order.id}`, {}); } catch { /* skip */ }
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={openCreate}>+ Nouvelle facture</button>
          <button className="btn btn-secondary" onClick={generateAll} disabled={generatingAll}>
            {generatingAll ? 'Génération...' : 'Générer les manquantes'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="status-tabs">
        {[
          { value: '', label: 'Toutes' },
          { value: 'draft', label: 'Brouillon' },
          { value: 'sent', label: 'Envoyées' },
          { value: 'paid', label: 'Payées' },
        ].map(s => (
          <button key={s.value} className={`tab-btn ${statusFilter === s.value ? 'tab-btn-active' : ''}`} onClick={() => setStatusFilter(s.value)}>
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
                <th>Client</th>
                <th>Date</th>
                <th>Montant TTC</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-loading">Chargement...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">Aucune facture</td></tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="font-medium">{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName}</td>
                    <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                    <td className="font-medium">{invoice.total.toFixed(2)} €</td>
                    <td><Badge status={invoice.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <a href={`/api/invoices/${invoice.id}/download`} className="btn btn-sm btn-secondary" target="_blank" rel="noopener noreferrer">
                          Télécharger
                        </a>
                        {invoice.status === 'draft' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(invoice.id, 'sent')}>Envoyer</button>
                        )}
                        {invoice.status === 'sent' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(invoice.id, 'paid')}>Marquer payée</button>
                        )}
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleStatusChange(invoice.id, 'cancelled')}>Annuler</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal création manuelle */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle facture manuelle" size="lg">
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom du client *</label>
              <input className="input" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="input" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
            </div>
          </div>

          <h4 style={{ margin: '16px 0 8px' }}>Articles</h4>
          {lines.map((line, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="form-label">Produit</label>}
                <select
                  className="input select"
                  value={line.productId}
                  onChange={e => selectProduct(idx, e.target.value)}
                >
                  <option value="">— Choisir ou saisir —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.Titre} — {p.Prix?.toFixed(2)} €</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="form-label">Désignation</label>}
                <input className="input" placeholder="Nom" value={line.name} onChange={e => setLine(idx, 'name', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="form-label">Qté × Prix HT</label>}
                <div style={{ display: 'flex', gap: 4 }}>
                  <input type="number" min="1" className="input" style={{ width: 60 }} value={line.qty} onChange={e => setLine(idx, 'qty', parseInt(e.target.value) || 1)} />
                  <input type="number" min="0" step="0.01" className="input" placeholder="€" value={line.price || ''} onChange={e => setLine(idx, 'price', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <button type="button" className="btn btn-sm btn-danger" style={{ marginTop: idx === 0 ? 22 : 0 }} onClick={() => setLines(ls => ls.filter((_, i) => i !== idx))} disabled={lines.length === 1}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => setLines(ls => [...ls, emptyLine()])}>+ Article</button>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0 8px' }}>
            <label className="form-label" style={{ margin: 0 }}>TVA (%)</label>
            <input type="number" className="input" style={{ width: 80 }} value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} />
          </div>

          <div style={{ textAlign: 'right', background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ margin: '2px 0' }}>Sous-total HT : <strong>{subtotal.toFixed(2)} €</strong></p>
            <p style={{ margin: '2px 0' }}>TVA ({taxRate}%) : <strong>{taxAmount.toFixed(2)} €</strong></p>
            <p style={{ margin: '4px 0', fontSize: 16 }}>Total TTC : <strong>{total.toFixed(2)} €</strong></p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Création...' : 'Créer la facture'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;
