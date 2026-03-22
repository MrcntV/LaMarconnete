import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet } from '../api';

const PRODUCT_TYPES = ['cosmetique', 'vetement', 'album', 'accessoire'];
const CERTIFICATIONS = ['BIO', 'VEGAN', 'Made in France'];
const BASE = process.env.REACT_APP_API_URL || '';

const empty: Record<string, any> = {
  Titre: '', reference: '', type: 'cosmetique', to: '', Qte: '',
  Prix: 0, PrixBarre: null, TexteBouton: 'Ajouter au panier',
  Description: '', Description2: '',
  LesPlusProduits: '', LesPlusProduits1: '', LesPlusProduits2: '',
  LesPlusProduits3: '', LesPlusProduits4: '',
  Compositions: '', Compositions1: '', Compositions2: '', Compositions3: '',
  ConseilsUtilisaton: '', InfosComplementaires: '',
  ImageProduit: '', ImageProduitSup: '',
  ImagesSupplementaires: [] as string[],
  Certificat: [] as string[], ScoreINCIBeauty: 0, ScoreYuka: 0, Etoiles: '',
  stock: 0, stockAlert: 5,
  active: true, enStock: true, besoinChoixCouleur: false, besoinChoixTaille: false,
};

function imageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE}${path}`;
}

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState<Record<string, any>>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!isNew && id) {
      apiGet(`/api/products/${id}`)
        .then((data: any) => setForm({ ...empty, ...data, ImagesSupplementaires: data.ImagesSupplementaires || [] }))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const toggleCert = (cert: string) => {
    const cur: string[] = form.Certificat || [];
    set('Certificat', cur.includes(cert) ? cur.filter(c => c !== cert) : [...cur, cert]);
  };

  const handleUpload = async (file: File, field: string, suppIdx?: number) => {
    const key = suppIdx != null ? `supp_${suppIdx}` : field;
    setUploading(key);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${BASE}/api/products/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      if (suppIdx != null) {
        const imgs = [...(form.ImagesSupplementaires as string[])];
        imgs[suppIdx] = data.path;
        set('ImagesSupplementaires', imgs);
      } else {
        set(field, data.path);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        isNew ? `${BASE}/api/products` : `${BASE}/api/products/${id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
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

        {/* ── Infos générales ── */}
        <div className="form-grid-2">
          <div className="card">
            <h3 className="card-section-title">Informations générales</h3>
            <div className="form-group">
              <label className="form-label">Nom du produit *</label>
              <input className="input" value={form.Titre} onChange={e => set('Titre', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Référence</label>
                <input className="input" value={form.reference} onChange={e => set('reference', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="input select" value={form.type} onChange={e => set('type', e.target.value)}>
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Slug URL (to)</label>
                <input className="input" value={form.to} onChange={e => set('to', e.target.value)} placeholder="GelLavant500ml" />
              </div>
              <div className="form-group">
                <label className="form-label">Contenance / Qté</label>
                <input className="input" value={form.Qte} onChange={e => set('Qte', e.target.value)} placeholder="500 mL" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prix (€) *</label>
                <input type="number" step="0.01" className="input" value={form.Prix} onChange={e => set('Prix', parseFloat(e.target.value))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Prix barré (€)</label>
                <input type="number" step="0.01" className="input" value={form.PrixBarre ?? ''} onChange={e => set('PrixBarre', e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Texte du bouton</label>
              <input className="input" value={form.TexteBouton} onChange={e => set('TexteBouton', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description courte</label>
              <textarea className="input textarea" rows={4} value={form.Description} onChange={e => set('Description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (onglet)</label>
              <textarea className="input textarea" rows={3} value={form.Description2} onChange={e => set('Description2', e.target.value)} />
            </div>
          </div>

          {/* ── Stock & Statut ── */}
          <div className="card">
            <h3 className="card-section-title">Stock & Statut</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="input" value={form.stock} onChange={e => set('stock', parseInt(e.target.value, 10))} />
              </div>
              <div className="form-group">
                <label className="form-label">Seuil d'alerte</label>
                <input type="number" className="input" value={form.stockAlert} onChange={e => set('stockAlert', parseInt(e.target.value, 10))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Étoiles affichées</label>
              <input className="input" value={form.Etoiles} onChange={e => set('Etoiles', e.target.value)} placeholder="★★★★★" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Score INCI Beauty (/20)</label>
                <input type="number" step="0.1" min="0" max="20" className="input" value={form.ScoreINCIBeauty} onChange={e => set('ScoreINCIBeauty', parseFloat(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Score Yuka (/100)</label>
                <input type="number" min="0" max="100" className="input" value={form.ScoreYuka} onChange={e => set('ScoreYuka', parseInt(e.target.value, 10))} />
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
          <div className="form-grid-2" style={{ marginBottom: 20 }}>
            {/* Image principale */}
            <div className="form-group">
              <label className="form-label">Image principale (carte produit)</label>
              {form.ImageProduit && (
                <img src={imageUrl(form.ImageProduit)} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8, display: 'block' }} />
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={form.ImageProduit} onChange={e => set('ImageProduit', e.target.value)} placeholder="/images/Produits/..." style={{ flex: 1 }} />
                <label htmlFor="up-main" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {uploading === 'ImageProduit' ? 'Upload...' : 'Uploader'}
                </label>
                <input id="up-main" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'ImageProduit'); e.target.value = ''; }} />
              </div>
            </div>

            {/* Image survol */}
            <div className="form-group">
              <label className="form-label">Image survol (carte produit)</label>
              {form.ImageProduitSup && (
                <img src={imageUrl(form.ImageProduitSup)} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8, display: 'block' }} />
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={form.ImageProduitSup} onChange={e => set('ImageProduitSup', e.target.value)} placeholder="/images/Produits/..." style={{ flex: 1 }} />
                <label htmlFor="up-sup" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {uploading === 'ImageProduitSup' ? 'Upload...' : 'Uploader'}
                </label>
                <input id="up-sup" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'ImageProduitSup'); e.target.value = ''; }} />
              </div>
            </div>
          </div>

          {/* Images supplémentaires (galerie) */}
          <div className="form-group">
            <label className="form-label">Images galerie (fiche produit)</label>
            {suppImages.map((img, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                {img && (
                  <img src={imageUrl(img)} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }} />
                )}
                {!img && uploading === `supp_${i}` && (
                  <div style={{ width: 56, height: 56, background: 'var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>...</div>
                )}
                <input className="input" value={img} onChange={e => { const imgs = [...suppImages]; imgs[i] = e.target.value; set('ImagesSupplementaires', imgs); }} placeholder="/images/Produits/..." style={{ flex: 1 }} />
                <label htmlFor={`up-supp-${i}`} className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {uploading === `supp_${i}` ? '...' : 'Upload'}
                </label>
                <input id={`up-supp-${i}`} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'ImagesSupplementaires', i); e.target.value = ''; }} />
                <button type="button" className="btn btn-danger" style={{ padding: '6px 10px', flexShrink: 0 }}
                  onClick={() => set('ImagesSupplementaires', suppImages.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
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
              <div key={`lpp-${n}`} className="form-group">
                <label className="form-label">Avantage {n === '' ? 'principal' : n}</label>
                <input className="input" value={form[`LesPlusProduits${n}`] || ''} onChange={e => set(`LesPlusProduits${n}`, e.target.value)} placeholder="Certifié BIO et VEGAN" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Composition ── */}
        <div className="card">
          <h3 className="card-section-title">Composition / Ingrédients</h3>
          <div className="form-group">
            <label className="form-label">Composition principale</label>
            <textarea className="input textarea" rows={4} value={form.Compositions} onChange={e => set('Compositions', e.target.value)} />
          </div>
          {['1', '2', '3'].map(n => (
            <div key={`comp-${n}`} className="form-group">
              <label className="form-label">Complément {n}</label>
              <textarea className="input textarea" rows={2} value={form[`Compositions${n}`] || ''} onChange={e => set(`Compositions${n}`, e.target.value)} />
            </div>
          ))}
        </div>

        {/* ── Conseils & Infos ── */}
        <div className="form-grid-2">
          <div className="card">
            <h3 className="card-section-title">Conseils d'utilisation</h3>
            <textarea className="input textarea" rows={6} value={form.ConseilsUtilisaton} onChange={e => set('ConseilsUtilisaton', e.target.value)} />
          </div>
          <div className="card">
            <h3 className="card-section-title">Infos complémentaires</h3>
            <textarea className="input textarea" rows={6} value={form.InfosComplementaires} onChange={e => set('InfosComplementaires', e.target.value)} placeholder="Poids : 0,548 kg" />
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
