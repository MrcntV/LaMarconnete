import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { apiGet, apiPut, apiPost } from '../api';
import { Order } from '../types';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  useEffect(() => {
    if (id) {
      apiGet(`/api/orders/${id}`)
        .then((data: unknown) => {
          const o = data as Order;
          setOrder(o);
          setNewStatus(o.status);
          setTrackingNumber(o.trackingNumber || '');
          setNotes(o.notes || '');
          setInvoiceGenerated(!!o.invoiceId);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const saveStatus = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await apiPut(`/api/orders/${id}/status`, { status: newStatus }) as Order;
      setOrder(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const saveTracking = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await apiPut(`/api/orders/${id}/tracking`, { trackingNumber }) as Order;
      setOrder(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await apiPut(`/api/orders/${id}/status`, { status: order.status, notes }) as Order;
      setOrder(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const generateInvoice = async () => {
    try {
      await apiPost(`/api/orders/${id}/invoice`, {});
      setInvoiceGenerated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) return <div className="loading-page">Chargement...</div>;
  if (!order) return <div className="alert alert-error">Commande introuvable</div>;

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h2>{order.orderNumber}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <Badge status={order.status} />
            <Badge status={order.paymentStatus} />
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>Retour</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="order-grid">
        <div className="order-main">
          <div className="card">
            <h3 className="card-section-title">Articles commandés</h3>
            <table className="data-table">
              <thead>
                <tr><th>Produit</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price.toFixed(2)} €</td>
                    <td>{(item.qty * item.price).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-totals">
              <div className="order-total-row"><span>Sous-total</span><span>{order.subtotal.toFixed(2)} €</span></div>
              <div className="order-total-row"><span>Livraison</span><span>{order.shipping.toFixed(2)} €</span></div>
              <div className="order-total-row order-total-final"><span>Total TTC</span><span>{order.total.toFixed(2)} €</span></div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-section-title">Statut de la commande</h3>
            <div className="form-row">
              <select className="input select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-primary" onClick={saveStatus} disabled={saving}>Enregistrer</button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-section-title">Suivi Colissimo</h3>
            <div className="form-row">
              <input
                className="input"
                placeholder="Numéro de suivi"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
              />
              <button className="btn btn-primary" onClick={saveTracking} disabled={saving}>Enregistrer</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={() => console.log('[Colissimo] API credentials needed in .env to generate label')}>
                Générer étiquette Colissimo
              </button>
              <p className="text-muted text-sm" style={{ marginTop: 4 }}>
                Nécessite la configuration de l'API Colissimo dans les paramètres.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="card-section-title">Notes admin</h3>
            <textarea
              className="input textarea"
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes internes..."
            />
            <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={saveNotes} disabled={saving}>
              Enregistrer les notes
            </button>
          </div>
        </div>

        <div className="order-side">
          <div className="card">
            <h3 className="card-section-title">Client</h3>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted">{order.customerEmail}</p>
          </div>

          <div className="card">
            <h3 className="card-section-title">Adresse de livraison</h3>
            <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>

          <div className="card">
            <h3 className="card-section-title">Paiement</h3>
            <Badge status={order.paymentStatus} />
            {order.paymentIntentId && (
              <p className="text-muted text-sm" style={{ marginTop: 8 }}>
                ID: {order.paymentIntentId}
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="card-section-title">Facture</h3>
            {invoiceGenerated ? (
              <div>
                <Badge status="ok" label="Facture générée" />
                <a
                  href={`/api/invoices/${order.invoiceId}/download`}
                  className="btn btn-secondary btn-full"
                  style={{ marginTop: 8, display: 'block', textAlign: 'center' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Télécharger la facture
                </a>
              </div>
            ) : (
              <button className="btn btn-primary btn-full" onClick={generateInvoice}>
                Générer la facture
              </button>
            )}
          </div>

          <div className="card">
            <h3 className="card-section-title">Chronologie</h3>
            <div className="order-timeline">
              <div className="timeline-item timeline-done">
                <span className="timeline-dot" />
                <div>
                  <p className="font-medium">Commande créée</p>
                  <p className="text-sm text-muted">{new Date(order.date).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              {['confirmed', 'shipped', 'delivered'].map(s => (
                <div key={s} className={`timeline-item ${order.status === s || (order.status === 'delivered' && (s === 'confirmed' || s === 'shipped')) ? 'timeline-done' : ''}`}>
                  <span className="timeline-dot" />
                  <div>
                    <p className={order.status === s || (order.status === 'delivered' && (s === 'confirmed' || s === 'shipped')) ? 'font-medium' : 'text-muted'}>
                      <Badge status={s} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
