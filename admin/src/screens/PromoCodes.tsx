import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';

interface PromoCode {
  id: string; code: string; description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number; minAmount: number; minQuantity: number;
  maxUses: number; usedCount: number; maxUsesPerCustomer: number;
  startDate?: string; endDate?: string; active: boolean;
  buyQuantity?: number; getQuantity?: number; getProductId?: string;
  productIds?: string[]; excludedProductIds?: string[];
}

const TYPE_LABELS: Record<string, string> = {
  percentage: '% Réduction',
  fixed: '€ Fixe',
  free_shipping: 'Livraison offerte',
  buy_x_get_y: 'Achetez X, obtenez Y',
};

const emptyForm = (): Partial<PromoCode> => ({
  code: '', description: '', type: 'percentage', value: 10,
  minAmount: 0, minQuantity: 0, maxUses: 0, maxUsesPerCustomer: 0,
  startDate: '', endDate: '', active: true,
  buyQuantity: 2, getQuantity: 1, getProductId: '',
});

const PromoCodes: React.FC = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PromoCode>>(emptyForm());
  const [saving, setSaving] = useState(false);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = () => {
    setLoading(true);
    apiGet('/api/promo')
      .then((data: unknown) => setCodes(data as PromoCode[]))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const openNew = () => { setForm(emptyForm()); setEditId(null); setShowForm(true); };
  const openEdit = (c: PromoCode) => { setForm({ ...c }); setEditId(c.id); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) {
        const updated = await apiPut(`/api/promo/${editId}`, form) as PromoCode;
        setCodes(prev => prev.map(c => c.id === editId ? updated : c));
      } else {
        const created = await apiPost('/api/promo', form) as PromoCode;
        setCodes(prev => [created, ...prev]);
      }
      setShowForm(false);
      showMsg(editId ? 'Code mis à jour ✓' : 'Code créé ✓');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Supprimer le code "${code}" ?`)) return;
    try {
      await apiDelete(`/api/promo/${id}`);
      setCodes(prev => prev.filter(c => c.id !== id));
      showMsg('Code supprimé');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleActive = async (c: PromoCode) => {
    try {
      const updated = await apiPut(`/api/promo/${c.id}`, { ...c, active: !c.active }) as PromoCode;
      setCodes(prev => prev.map(x => x.id === c.id ? updated : x));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Codes Promo</h2>
        <button className="btn btn-primary" onClick={openNew}>+ Nouveau code</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box modal-large" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Modifier le code' : 'Nouveau code promo'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Code *</label>
                  <input className="input" style={{ textTransform: 'uppercase' }} value={form.code || ''} onChange={e => set('code', e.target.value.toUpperCase())} required placeholder="SUMMER20" />
                </div>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="input select" value={form.type} onChange={e => set('type', e.target.value)}>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (interne)</label>
                <input className="input" value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Promo été 2025..." />
              </div>

              {form.type !== 'free_shipping' && form.type !== 'buy_x_get_y' && (
                <div className="form-group">
                  <label className="form-label">Valeur ({form.type === 'percentage' ? '%' : '€'})</label>
                  <input type="number" step="0.01" min="0" className="input" value={form.value || 0} onChange={e => set('value', parseFloat(e.target.value) || 0)} />
                </div>
              )}

              {form.type === 'buy_x_get_y' && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Quantité achetée (X)</label>
                    <input type="number" min="1" className="input" value={form.buyQuantity || 2} onChange={e => set('buyQuantity', parseInt(e.target.value) || 2)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantité offerte (Y)</label>
                    <input type="number" min="1" className="input" value={form.getQuantity || 1} onChange={e => set('getQuantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">ID produit offert (vide = même produit)</label>
                    <input className="input" value={form.getProductId || ''} onChange={e => set('getProductId', e.target.value)} placeholder="ID produit MongoDB ou laisser vide" />
                  </div>
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Montant minimum panier (€)</label>
                  <input type="number" step="0.01" min="0" className="input" value={form.minAmount || 0} onChange={e => set('minAmount', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité minimum articles</label>
                  <input type="number" min="0" className="input" value={form.minQuantity || 0} onChange={e => set('minQuantity', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Utilisations max (0 = illimité)</label>
                  <input type="number" min="0" className="input" value={form.maxUses || 0} onChange={e => set('maxUses', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max par client (0 = illimité)</label>
                  <input type="number" min="0" className="input" value={form.maxUsesPerCustomer || 0} onChange={e => set('maxUsesPerCustomer', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de début</label>
                  <input type="datetime-local" className="input" value={form.startDate ? form.startDate.slice(0, 16) : ''} onChange={e => set('startDate', e.target.value ? new Date(e.target.value).toISOString() : '')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de fin</label>
                  <input type="datetime-local" className="input" value={form.endDate ? form.endDate.slice(0, 16) : ''} onChange={e => set('endDate', e.target.value ? new Date(e.target.value).toISOString() : '')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-check">
                  <input type="checkbox" checked={form.active !== false} onChange={e => set('active', e.target.checked)} />
                  <span>Code actif</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Valeur</th>
                <th>Conditions</th>
                <th>Utilisations</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="table-loading">Chargement...</td></tr>
              ) : codes.length === 0 ? (
                <tr><td colSpan={8} className="table-empty">Aucun code promo</td></tr>
              ) : (
                codes.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium" style={{ fontFamily: 'monospace', fontSize: 14 }}>{c.code}</td>
                    <td>{TYPE_LABELS[c.type]}</td>
                    <td>
                      {c.type === 'percentage' && `−${c.value}%`}
                      {c.type === 'fixed' && `−${c.value} €`}
                      {c.type === 'free_shipping' && '🚚 Gratuit'}
                      {c.type === 'buy_x_get_y' && `${c.buyQuantity}+${c.getQuantity} offert`}
                    </td>
                    <td className="text-sm text-muted">
                      {c.minAmount > 0 && <div>Min. {c.minAmount} €</div>}
                      {c.minQuantity > 0 && <div>Min. {c.minQuantity} art.</div>}
                    </td>
                    <td>
                      <span style={{ color: c.maxUses > 0 && c.usedCount >= c.maxUses ? '#ef4444' : 'inherit' }}>
                        {c.usedCount}/{c.maxUses > 0 ? c.maxUses : '∞'}
                      </span>
                    </td>
                    <td className="text-sm text-muted">
                      {c.startDate && <div>Dès {new Date(c.startDate).toLocaleDateString('fr-FR')}</div>}
                      {c.endDate && <div>Fin {new Date(c.endDate).toLocaleDateString('fr-FR')}</div>}
                      {!c.startDate && !c.endDate && '—'}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${c.active ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => toggleActive(c)}
                        title={c.active ? 'Actif — cliquer pour désactiver' : 'Inactif — cliquer pour activer'}
                      >
                        {c.active ? '✓ Actif' : '✕ Inactif'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id, c.code)}>✕</button>
                      </div>
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

export default PromoCodes;
