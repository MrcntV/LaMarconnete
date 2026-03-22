import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { apiGet, apiPut, apiPost, apiDelete } from '../api';

const BASE = process.env.REACT_APP_API_URL || '';
const token = () => localStorage.getItem('admin_token');

const STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'processing', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const SOURCES = ['Direct', 'Google Ads', 'Google Shopping', 'Instagram', 'Facebook', 'Newsletter', 'Parrainage', 'Autre'];

interface Address {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

interface ColissimoLabel {
  type: 'aller' | 'retour' | 'allerretour';
  trackingNumber?: string;
  labelUrl?: string;
  labelBase64?: string;
  insurance?: boolean;
  insuranceValue?: number;
  poids?: number;
  createdAt?: string;
}

interface OrderItem { name: string; qty: number; price: number; couleur?: string; taille?: string; }

interface Order {
  id: string; orderNumber: string; date: string;
  status: string; paymentStatus: string; paymentIntentId?: string;
  stripeChargeId?: string; cardBrand?: string; cardLast4?: string; cardFunding?: string;
  stripeDetails?: any;
  customerName: string; customerEmail: string; customerPhone?: string;
  parrainMarraine?: string; source?: string;
  items: OrderItem[];
  subtotal: number; shipping: number; discount?: number; promoCode?: string; total: number;
  shippingAddress?: Address; billingAddress?: Address;
  trackingNumber?: string; colissimoLabels?: ColissimoLabel[];
  invoiceId?: string; notes?: string;
  refundStatus?: string; refundAmount?: number; refundId?: string;
}

const emptyAddress: Address = { firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'France', phone: '' };

const formatAddr = (a?: Address) =>
  a ? [a.firstName, a.lastName, a.address, `${a.postalCode} ${a.city}`, a.country, a.phone].filter(Boolean).join(', ') : '—';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Editable fields
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [parrainMarraine, setParrainMarraine] = useState('');
  const [source, setSource] = useState('');

  // Address edit
  const [editingAddr, setEditingAddr] = useState<'shipping' | 'billing' | null>(null);
  const [addrForm, setAddrForm] = useState<Address>(emptyAddress);

  // Colissimo label
  const [labelType, setLabelType] = useState<'aller' | 'retour' | 'allerretour'>('aller');
  const [labelPoids, setLabelPoids] = useState('500');
  const [labelInsurance, setLabelInsurance] = useState(false);
  const [labelInsuranceValue, setLabelInsuranceValue] = useState('0');
  const [generatingLabel, setGeneratingLabel] = useState(false);

  // Refund
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [refunding, setRefunding] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  // Invoice
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    if (id) {
      apiGet(`/api/orders/${id}`)
        .then((data: unknown) => {
          const o = data as Order;
          setOrder(o);
          setNewStatus(o.status);
          setNotes(o.notes || '');
          setTrackingNumber(o.trackingNumber || '');
          setShippingCost(String(o.shipping ?? 0));
          setParrainMarraine(o.parrainMarraine || '');
          setSource(o.source || '');
          setInvoiceGenerated(!!o.invoiceId);
        })
        .catch(err => setError((err as Error).message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const save = async (url: string, body: object) => {
    setSaving(true);
    try {
      const updated = await apiPut(url, body) as Order;
      setOrder(updated);
      showMsg('Enregistré ✓');
      return updated;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = () => save(`/api/orders/${id}/status`, { status: newStatus, notes });
  const saveTracking = () => save(`/api/orders/${id}/tracking`, { trackingNumber });
  const saveShippingCost = () => save(`/api/orders/${id}/shipping-cost`, { shipping: parseFloat(shippingCost) || 0 });

  const saveMeta = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: order?.status, notes, parrainMarraine, source }),
      });
      const data = await res.json();
      setOrder(data);
      showMsg('Enregistré ✓');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    if (!editingAddr) return;
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/orders/${id}/address`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: editingAddr, address: addrForm }),
      });
      const data = await res.json();
      setOrder(data);
      setEditingAddr(null);
      showMsg('Adresse mise à jour ✓');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateLabel = async () => {
    setGeneratingLabel(true);
    setError('');
    try {
      const res = await fetch(`${BASE}/api/orders/${id}/label`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: labelType,
          poids: parseInt(labelPoids) || 500,
          insurance: labelInsurance,
          insuranceValue: parseFloat(labelInsuranceValue) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setOrder(data.order);
      showMsg('Étiquette générée ✓');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGeneratingLabel(false);
    }
  };

  const deleteLabel = async (idx: number) => {
    if (!window.confirm('Supprimer cette étiquette ?')) return;
    try {
      const res = await fetch(`${BASE}/api/orders/${id}/label/${idx}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
      showMsg('Étiquette supprimée');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const printLabel = (label: ColissimoLabel) => {
    if (label.labelUrl) {
      window.open(`${BASE}${label.labelUrl}`, '_blank');
    } else if (label.labelBase64) {
      const base64 = label.labelBase64;
      const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const doRefund = async () => {
    if (!window.confirm(`Rembourser ${refundAmount || 'le montant total'} € ? Cette action est irréversible.`)) return;
    setRefunding(true);
    try {
      const res = await fetch(`${BASE}/api/orders/${id}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: refundAmount ? parseFloat(refundAmount) : undefined, reason: refundReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
      setShowRefund(false);
      showMsg(`Remboursement de ${data.amount} € effectué ✓`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefunding(false);
    }
  };

  const generateInvoice = async () => {
    try {
      await apiPost(`/api/orders/${id}/invoice`, {});
      setInvoiceGenerated(true);
      showMsg('Facture générée ✓');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEditAddr = (type: 'shipping' | 'billing') => {
    const addr = type === 'billing' ? order?.billingAddress : order?.shippingAddress;
    setAddrForm({ ...emptyAddress, ...addr });
    setEditingAddr(type);
  };

  if (loading) return <div className="loading-page">Chargement...</div>;
  if (!order) return <div className="alert alert-error">Commande introuvable</div>;

  const transactionFees = parseFloat((order.total * 0.029 + 0.30).toFixed(2));
  const netAmount = parseFloat((order.total - transactionFees).toFixed(2));

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <h2>{order.orderNumber}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <Badge status={order.status} />
            <Badge status={order.paymentStatus} />
            {order.refundStatus && order.refundStatus !== 'none' && (
              <Badge status={order.refundStatus === 'full' ? 'refunded' : 'partial_refund'} label={order.refundStatus === 'full' ? 'Remboursé' : `Remb. partiel (${order.refundAmount} €)`} />
            )}
            {order.source && <span className="badge badge-source">{order.source}</span>}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>← Retour</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Address edit modal */}
      {editingAddr && (
        <div className="modal-overlay" onClick={() => setEditingAddr(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Modifier adresse {editingAddr === 'billing' ? 'de facturation' : 'de livraison'}</h3>
            {['firstName', 'lastName', 'address', 'city', 'postalCode', 'country', 'phone'].map(f => (
              <div key={f} className="form-group">
                <label className="form-label">{f}</label>
                <input className="input" value={(addrForm as any)[f] || ''} onChange={e => setAddrForm(a => ({ ...a, [f]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveAddress} disabled={saving}>Enregistrer</button>
              <button className="btn btn-secondary" onClick={() => setEditingAddr(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <div className="order-grid">
        {/* ── Main column ── */}
        <div className="order-main">

          {/* Articles */}
          <div className="card">
            <h3 className="card-section-title">Articles commandés</h3>
            <table className="data-table">
              <thead><tr><th>Produit</th><th>Variante</th><th>Qté</th><th>PU</th><th>Total</th></tr></thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className="text-muted text-sm">{[item.couleur, item.taille].filter(Boolean).join(' / ') || '—'}</td>
                    <td>{item.qty}</td>
                    <td>{item.price.toFixed(2)} €</td>
                    <td className="font-medium">{(item.qty * item.price).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-totals">
              <div className="order-total-row"><span>Sous-total articles</span><span>{order.subtotal.toFixed(2)} €</span></div>
              {order.discount != null && order.discount > 0 && (
                <div className="order-total-row" style={{ color: '#16a34a' }}>
                  <span>Réduction {order.promoCode ? `(${order.promoCode})` : ''}</span>
                  <span>−{order.discount.toFixed(2)} €</span>
                </div>
              )}
              <div className="order-total-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Frais d'expédition
                  <input type="number" step="0.01" className="input" style={{ width: 80, padding: '2px 6px', fontSize: 12 }}
                    value={shippingCost} onChange={e => setShippingCost(e.target.value)} />
                  <button className="btn btn-sm btn-secondary" onClick={saveShippingCost} disabled={saving}>✓</button>
                </span>
                <span>{order.shipping.toFixed(2)} €</span>
              </div>
              <div className="order-total-row order-total-final"><span>Total TTC</span><span>{order.total.toFixed(2)} €</span></div>
              <div className="order-total-row" style={{ color: '#ef4444', fontSize: 12 }}>
                <span>Frais Stripe (~2.9% + 0.30€)</span><span>−{transactionFees} €</span>
              </div>
              <div className="order-total-row" style={{ fontWeight: 700, color: '#16a34a' }}>
                <span>Net reçu</span><span>{netAmount} €</span>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="card">
            <h3 className="card-section-title">Statut de la commande</h3>
            <div className="form-row" style={{ marginBottom: 12 }}>
              <select className="input select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-primary" onClick={saveStatus} disabled={saving}>Enregistrer</button>
            </div>
            <div className="form-group">
              <label className="form-label">Origine</label>
              <select className="input select" value={source} onChange={e => setSource(e.target.value)}>
                <option value="">— Sélectionner —</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Parrain / Marraine</label>
              <input className="input" value={parrainMarraine} onChange={e => setParrainMarraine(e.target.value)} placeholder="Nom du parrain ou de la marraine" />
            </div>
            <div className="form-group">
              <label className="form-label">Notes admin</label>
              <textarea className="input textarea" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes internes..." />
            </div>
            <button className="btn btn-secondary" onClick={saveMeta} disabled={saving}>Enregistrer</button>
          </div>

          {/* Colissimo */}
          <div className="card">
            <h3 className="card-section-title">Colissimo — Étiquettes</h3>

            {/* Étiquettes existantes */}
            {order.colissimoLabels && order.colissimoLabels.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p className="form-label" style={{ marginBottom: 8 }}>Étiquettes générées :</p>
                {order.colissimoLabels.map((lbl, idx) => (
                  <div key={idx} className="label-row">
                    <div>
                      <span className="badge badge-label-type">{lbl.type}</span>
                      {lbl.trackingNumber && <span className="text-muted text-sm"> #{lbl.trackingNumber}</span>}
                      {lbl.insurance && <span className="badge badge-insurance"> Assurée {lbl.insuranceValue} €</span>}
                      <span className="text-muted text-sm"> · {lbl.poids}g · {lbl.createdAt ? new Date(lbl.createdAt).toLocaleDateString('fr-FR') : ''}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => printLabel(lbl)}>🖨 Imprimer</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteLabel(idx)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tracking manuel */}
            <div className="form-group">
              <label className="form-label">Numéro de suivi (manuel)</label>
              <div className="form-row">
                <input className="input" placeholder="Ex: 7X12345678901" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                <button className="btn btn-secondary" onClick={saveTracking} disabled={saving}>✓</button>
              </div>
            </div>

            {/* Génération étiquette */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
              <p className="form-label" style={{ marginBottom: 10 }}>Générer une nouvelle étiquette :</p>
              <div className="form-grid-2" style={{ marginBottom: 10 }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="input select" value={labelType} onChange={e => setLabelType(e.target.value as any)}>
                    <option value="aller">Aller (expédition)</option>
                    <option value="retour">Retour client</option>
                    <option value="allerretour">Aller-retour (les deux)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Poids colis (g)</label>
                  <input type="number" className="input" value={labelPoids} onChange={e => setLabelPoids(e.target.value)} min="1" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-check">
                  <input type="checkbox" checked={labelInsurance} onChange={e => setLabelInsurance(e.target.checked)} />
                  <span>Assurance Colissimo</span>
                </label>
              </div>
              {labelInsurance && (
                <div className="form-group">
                  <label className="form-label">Valeur déclarée pour assurance (€)</label>
                  <input type="number" step="0.01" className="input" value={labelInsuranceValue} onChange={e => setLabelInsuranceValue(e.target.value)} />
                </div>
              )}
              <button className="btn btn-primary" onClick={generateLabel} disabled={generatingLabel}>
                {generatingLabel ? 'Génération...' : '📦 Générer étiquette'}
              </button>
              <p className="text-muted text-sm" style={{ marginTop: 6 }}>
                Nécessite COLISSIMO_LOGIN, COLISSIMO_PASSWORD et COLISSIMO_CONTRACT dans le .env
              </p>
            </div>
          </div>

          {/* Remboursement */}
          <div className="card">
            <h3 className="card-section-title">Remboursement</h3>
            {order.refundStatus && order.refundStatus !== 'none' ? (
              <div>
                <p>Remboursement effectué : <strong>{order.refundAmount} €</strong></p>
                <p className="text-muted text-sm">ID Stripe : {order.refundId}</p>
              </div>
            ) : (
              <>
                {!showRefund ? (
                  <button className="btn btn-danger" onClick={() => setShowRefund(true)}>Rembourser cette commande</button>
                ) : (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Montant à rembourser (€) — laisser vide pour remboursement total de {order.total.toFixed(2)} €</label>
                      <input type="number" step="0.01" className="input" placeholder={`max ${order.total.toFixed(2)} €`}
                        value={refundAmount} onChange={e => setRefundAmount(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Motif</label>
                      <select className="input select" value={refundReason} onChange={e => setRefundReason(e.target.value)}>
                        <option value="requested_by_customer">Demande client</option>
                        <option value="duplicate">Doublon</option>
                        <option value="fraudulent">Fraude</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-danger" onClick={doRefund} disabled={refunding}>
                        {refunding ? 'Remboursement...' : 'Confirmer le remboursement'}
                      </button>
                      <button className="btn btn-secondary" onClick={() => setShowRefund(false)}>Annuler</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Side column ── */}
        <div className="order-side">

          {/* Client */}
          <div className="card">
            <h3 className="card-section-title">Client</h3>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted">{order.customerEmail}</p>
            {order.customerPhone && <p className="text-muted">{order.customerPhone}</p>}
            {order.parrainMarraine && (
              <p style={{ marginTop: 6, fontSize: 12 }}>
                <strong>Parrain / Marraine :</strong> {order.parrainMarraine}
              </p>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              {new Date(order.date).toLocaleString('fr-FR')}
            </p>
          </div>

          {/* Adresse livraison */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 className="card-section-title" style={{ margin: 0 }}>Adresse livraison</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => startEditAddr('shipping')}>Modifier</button>
            </div>
            {order.shippingAddress ? (
              <>
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </>
            ) : <p className="text-muted">—</p>}
          </div>

          {/* Adresse facturation */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 className="card-section-title" style={{ margin: 0 }}>Adresse facturation</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => startEditAddr('billing')}>Modifier</button>
            </div>
            {order.billingAddress?.address ? (
              <>
                <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                <p>{order.billingAddress.address}</p>
                <p>{order.billingAddress.postalCode} {order.billingAddress.city}</p>
                <p>{order.billingAddress.country}</p>
              </>
            ) : <p className="text-muted">Identique à la livraison</p>}
          </div>

          {/* Paiement */}
          <div className="card">
            <h3 className="card-section-title">Paiement Stripe</h3>
            <Badge status={order.paymentStatus} />
            {(order.cardBrand || order.stripeDetails?.cardBrand) && (
              <div style={{ marginTop: 8 }}>
                <p className="font-medium" style={{ textTransform: 'capitalize' }}>
                  {(order.stripeDetails?.cardBrand || order.cardBrand)} ····{order.stripeDetails?.cardLast4 || order.cardLast4}
                </p>
                {(order.cardFunding || order.stripeDetails?.cardFunding) && (
                  <p className="text-muted text-sm" style={{ textTransform: 'capitalize' }}>
                    {order.stripeDetails?.cardFunding || order.cardFunding}
                  </p>
                )}
                {order.stripeDetails?.receiptUrl && (
                  <a href={order.stripeDetails.receiptUrl} target="_blank" rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary" style={{ marginTop: 6, display: 'inline-block' }}>
                    Reçu Stripe
                  </a>
                )}
              </div>
            )}
            {order.paymentIntentId && (
              <p className="text-muted text-sm" style={{ marginTop: 6, wordBreak: 'break-all' }}>
                {order.paymentIntentId}
              </p>
            )}
          </div>

          {/* Facture */}
          <div className="card">
            <h3 className="card-section-title">Facture</h3>
            {invoiceGenerated ? (
              <div>
                <Badge status="ok" label="Facture générée" />
                <a href={`${BASE}/api/invoices/${order.invoiceId}/download`}
                  className="btn btn-secondary btn-full"
                  style={{ marginTop: 8, display: 'block', textAlign: 'center' }}
                  target="_blank" rel="noopener noreferrer">
                  Télécharger la facture
                </a>
              </div>
            ) : (
              <button className="btn btn-primary btn-full" onClick={generateInvoice}>Générer la facture</button>
            )}
          </div>

          {/* Chronologie */}
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
              {STATUSES.slice(1).map(s => {
                const isReached = order.status === s.value ||
                  (order.status === 'delivered' && ['confirmed', 'processing', 'shipped'].includes(s.value)) ||
                  (order.status === 'shipped' && ['confirmed', 'processing'].includes(s.value)) ||
                  (order.status === 'processing' && s.value === 'confirmed');
                return (
                  <div key={s.value} className={`timeline-item ${isReached ? 'timeline-done' : ''}`}>
                    <span className="timeline-dot" />
                    <div><p className={isReached ? 'font-medium' : 'text-muted'}>{s.label}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
