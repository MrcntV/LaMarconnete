import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPut } from '../api';
import { Product } from '../types';

const PRODUCT_TYPES = ['cosmetique', 'vetement', 'album', 'accessoire'];
const CERTIFICATIONS = ['BIO', 'VEGAN', 'Made in France'];

const emptyProduct: Record<string, any> = {
  Titre: '', reference: '', type: 'cosmetique', to: '',
  Prix: 0, PrixBarre: null, Qte: '',
  Description: '', Description2: '',
  LesPlusProduits: '', LesPlusProduits1: '', LesPlusProduits2: '', LesPlusProduits3: '', LesPlusProduits4: '',
  Compositions: '', Compositions1: '', Compositions2: '', Compositions3: '',
  ConseilsUtilisaton: '', InfosComplementaires: '',
  ImageProduit: '', ImageProduitSup: '',
  ImagesSupplementaires: [] as string[],
  Certificat: [] as string[], ScoreINCIBeauty: 0, ScoreYuka: 0, Etoiles: '',
  stock: 0, stockAlert: 5,
  active: true, besoinChoixCouleur: false, besoinChoixTaille: false,
  TexteBouton: 'Ajouter au panier', enStock: true
};

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState<Record<string, any>>(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!isNew && id) {
      apiGet(`/api/products/${id}`)
        .then((data: any) => {
          setForm({ ...emptyProduct, ...data, ImagesSupplementaires: data.ImagesSupplementaires || [] });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const toggleCert = (cert: string) => {
    const current: string[] = form.Certificat || [];
    set('Certificat', current.includes(cert) ? current.filter(c => c !== cert) : [...current, cert]);
  };

  const uploadImage = async (file: File, field: string, suppIndex?: number) => {
    const key = suppIndex != null ? `supp_${suppIndex}` : field;
    setUploadingField(key);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/products/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (suppIndex != null) {
        const imgs = [...(form.ImagesSupplementaires || [])];
        imgs[suppIndex] = data.path;
        set('ImagesSupplementaires', imgs);
      } else {
        set(field, data.path);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const ImageField = ({ field, label }: { field: string; label: string }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        {form[field] && (
          <img src={form[field]} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 6, display: 'block', border: '1px solid var(--border)' }} />
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" value={form[field] || ''} onChange={e => set(field, e.target.value)} placeholder="/images/Produits/..." style={{ flex: 1 }} />
          <button type="button" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}
            onClick={() => fileRef.current?.click()}
            disabled={uploadingField === field}
          >
            {uploadingField === field ? '...' : 'Uploader'}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, field); }} />
      </div>
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const BASE = process.env.REACT_APP_API_URL || '';
      const res = await fetch(isNew ? `${BASE}/api/products` : `${BASE}/api/products/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erreur'); }
      navigate('/products');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-page">Chargement...</div>;

  const suppImages: string[] = form.ImagesSupplementaires || [];

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>{isNew ? 'Nouveau produit' : 'Modifier le produit'}</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>Annuler</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSave} className="product-form">

        {/* ── Informations générales ── */}
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
                <label className="form-label">Type</label>
                <select className="input select" value={form.type || 'cosmetique'} onChange={e => set('type', e.target.value)}>
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Slug URL (to)</label>
                <input className="input" value={form.to || ''} onChange={e => set('to', e.target.value)} placeholder="EauNettoyante500ml" />
              </div>
              <div className="form-group">
                <label className="form-label">Quantité / Contenance</label>
                <input className="input" value={form.Qte || ''} onChange={e => set('Qte', e.target.value)} placeholder="500 ml" />
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
              <label className="form-label">Texte du bouton</label>
              <input className="input" value={form.TexteBouton || ''} onChange={e => set('TexteBouton', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description courte</label>
              <textarea className="input textarea" rows={4} value={form.Description || ''} onChange={e => set('Description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description longue (onglet)</label>
              <textarea className="input textarea" rows={3} value={form.Description2 || ''} onChange={e => set('Description2', e.target.value)} />
            </div>
          </div>

          {/* ── Stock & Statut ── */}
          <div className="card">
            <h3 className="card-section-title">Stock & Statut</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="input" value={form.stock || 0} onChange={e => set('stock', parseInt(e.target.value, 10))} />
              </div>
              <div className="form-group">
                <label className="form-label">Seuil d'alerte</label>
                <input type="number" className="input" value={form.stockAlert || 5} onChange={e => set('stockAlert', parseInt(e.target.value, 10))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Note (étoiles affichées)</label>
              <input className="input" value={form.Etoiles || ''} onChange={e => set('Etoiles', e.target.value)} placeholder="★ ★ ★ ★ ★" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Score INCI Beauty (/20)</label>
                <input type="number" step="0.1" min="0" max="20" className="input" value={form.ScoreINCIBeauty || 0} onChange={e => set('ScoreINCIBeauty', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Score Yuka (/100)</label>
                <input type="number" min="0" max="100" className="input" value={form.ScoreYuka || 0} onChange={e => set('ScoreYuka', parseInt(e.target.value, 10))} />
              </div>
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
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.active !== false} onChange={e => set('active', e.target.checked)} />
                <span>Produit actif (visible sur le site)</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.enStock !== false} onChange={e => set('enStock', e.target.checked)} />
                <span>En stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="card">
          <h3 className="card-section-title">Images</h3>
          <div className="form-grid-2">
            <ImageField field="ImageProduit" label="Image principale (carte produit)" />
            <ImageField field="ImageProduitSup" label="Image survol (carte produit)" />
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Images supplémentaires (galerie fiche produit)</label>
            {suppImages.map((img, i) => {
              const fileRef = React.createRef<HTMLInputElement>();
              return (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  {img && <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)', flexShrink: 0 }} />}
                  <input
                    className="input"
                    value={img}
                    onChange={e => { const imgs = [...suppImages]; imgs[i] = e.target.value; set('ImagesSupplementaires', imgs); }}
                    placeholder="/images/Produits/..."
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingField === `supp_${i}`}
                  >
                    {uploadingField === `supp_${i}` ? '...' : 'Upload'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, 'ImagesSupplementaires', i); }} />
                  <button type="button" className="btn btn-danger" style={{ padding: '6px 10px' }}
                    onClick={() => { const imgs = suppImages.filter((_, j) => j !== i); set('ImagesSupplementaires', imgs); }}>
                    ✕
                  </button>
                </div>
              );
            })}
            <button type="button" className="btn btn-secondary"
              onClick={() => set('ImagesSupplementaires', [...suppImages, ''])}>
              + Ajouter une image
            </button>
          </div>
        </div>

        {/* ── Les plus produit ── */}
        <div className="card">
          <h3 className="card-section-title">Les plus produit (avantages)</h3>
          <div className="form-grid-2">
            {(['', '1', '2', '3', '4'] as const).map(n => (
              <div key={n} className="form-group">
                <label className="form-label">Avantage {n === '' ? 'principal' : n}</label>
                <input className="input" value={form[`LesPlusProduits${n}`] || ''} onChange={e => set(`LesPlusProduits${n}`, e.target.value)} placeholder="✔️ ..." />
              </div>
            ))}
          </div>
        </div>

        {/* ── Compositions ── */}
        <div className="card">
          <h3 className="card-section-title">Composition / Ingrédients</h3>
          <div className="form-group">
            <label className="form-label">Composition principale</label>
            <textarea className="input textarea" rows={4} value={form.Compositions || ''} onChange={e => set('Compositions', e.target.value)} />
          </div>
          {['1', '2', '3'].map(n => (
            <div key={n} className="form-group">
              <label className="form-label">Composition {n} (complément)</label>
              <textarea className="input textarea" rows={2} value={form[`Compositions${n}`] || ''} onChange={e => set(`Compositions${n}`, e.target.value)} />
            </div>
          ))}
        </div>

        {/* ── Conseils & Infos ── */}
        <div className="form-grid-2">
          <div className="card">
            <h3 className="card-section-title">Conseils d'utilisation</h3>
            <div className="form-group">
              <textarea className="input textarea" rows={5} value={form.ConseilsUtilisaton || ''} onChange={e => set('ConseilsUtilisaton', e.target.value)} />
            </div>
          </div>
          <div className="card">
            <h3 className="card-section-title">Infos complémentaires</h3>
            <div className="form-group">
              <textarea className="input textarea" rows={5} value={form.InfosComplementaires || ''} onChange={e => set('InfosComplementaires', e.target.value)} placeholder="Poids, dimensions..." />
            </div>
          </div>
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
