import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api';
import { Product } from '../types';

const CATEGORIES = ['Hygiène', 'Soin', 'Accessoires'];
const CERTIFICATIONS = ['Bio', 'Vegan', 'Made in France'];

const emptyProduct: Partial<Product> = {
  Titre: '', reference: '', Prix: 0, PrixBarre: null,
  categorie: 'Soin', Description: '', Description2: '',
  stock: 0, stockAlert: 5,
  LesPlusProduits1: '', LesPlusProduits2: '', LesPlusProduits3: '', LesPlusProduits4: '',
  Compositions1: '', Compositions2: '', Compositions3: '',
  Certificat: [], ScoreINCIBeauty: 0, ScoreYuka: 0, Etoiles: '5',
  active: true, besoinChoixCouleur: false, besoinChoixTaille: false,
  TexteBouton: 'Ajouter au panier', enStock: true
};

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState<Partial<Product>>(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      apiGet(`/api/products/${id}`)
        .then((data: unknown) => setForm(data as Product))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: keyof Product, value: unknown) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const toggleCert = (cert: string) => {
    const current = form.Certificat || [];
    if (current.includes(cert)) {
      set('Certificat', current.filter(c => c !== cert));
    } else {
      set('Certificat', [...current, cert]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await apiPost('/api/products', form);
      } else {
        await apiPut(`/api/products/${id}`, form);
      }
      navigate('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-page">Chargement...</div>;

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>{isNew ? 'Nouveau produit' : 'Modifier le produit'}</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>Annuler</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSave} className="product-form">
        <div className="form-grid-2">
          <div className="card">
            <h3 className="card-section-title">Informations générales</h3>
            <div className="form-group">
              <label className="form-label">Nom du produit *</label>
              <input className="input" value={form.Titre || ''} onChange={e => set('Titre', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Référence</label>
                <input className="input" value={form.reference || ''} onChange={e => set('reference', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select className="input select" value={form.categorie || 'Soin'} onChange={e => set('categorie', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prix (€) *</label>
                <input type="number" step="0.01" className="input" value={form.Prix || 0} onChange={e => set('Prix', parseFloat(e.target.value))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Prix barré (€)</label>
                <input type="number" step="0.01" className="input" value={form.PrixBarre || ''} onChange={e => set('PrixBarre', e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description courte</label>
              <textarea className="input textarea" rows={3} value={form.Description || ''} onChange={e => set('Description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description longue</label>
              <textarea className="input textarea" rows={4} value={form.Description2 || ''} onChange={e => set('Description2', e.target.value)} />
            </div>
          </div>

          <div className="card">
            <h3 className="card-section-title">Stock & Statut</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock initial</label>
                <input type="number" className="input" value={form.stock || 0} onChange={e => set('stock', parseInt(e.target.value, 10))} />
              </div>
              <div className="form-group">
                <label className="form-label">Seuil d'alerte</label>
                <input type="number" className="input" value={form.stockAlert || 5} onChange={e => set('stockAlert', parseInt(e.target.value, 10))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Note (étoiles)</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${parseInt(form.Etoiles || '0') >= star ? 'star-active' : ''}`}
                    onClick={() => set('Etoiles', String(star))}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.active !== false} onChange={e => set('active', e.target.checked)} />
                <span>Produit actif (visible sur le site)</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">Certifications</label>
              <div className="checkbox-group">
                {CERTIFICATIONS.map(cert => (
                  <label key={cert} className="form-check">
                    <input type="checkbox" checked={(form.Certificat || []).includes(cert)} onChange={() => toggleCert(cert)} />
                    <span>{cert}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Score INCI Beauty (0-100)</label>
                <input type="number" min="0" max="100" className="input" value={form.ScoreINCIBeauty || 0} onChange={e => set('ScoreINCIBeauty', parseInt(e.target.value, 10))} />
              </div>
              <div className="form-group">
                <label className="form-label">Score Yuka (0-100)</label>
                <input type="number" min="0" max="100" className="input" value={form.ScoreYuka || 0} onChange={e => set('ScoreYuka', parseInt(e.target.value, 10))} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-section-title">Les plus produit</h3>
          <div className="form-grid-2">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="form-group">
                <label className="form-label">Avantage {n}</label>
                <input className="input" value={(form as Record<string, unknown>)[`LesPlusProduits${n}`] as string || ''} onChange={e => set(`LesPlusProduits${n}` as keyof Product, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-section-title">Ingrédients (Compositions)</h3>
          {[1, 2, 3].map(n => (
            <div key={n} className="form-group">
              <label className="form-label">Ingrédients {n}</label>
              <textarea className="input textarea" rows={2} value={(form as Record<string, unknown>)[`Compositions${n}`] as string || ''} onChange={e => set(`Compositions${n}` as keyof Product, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
