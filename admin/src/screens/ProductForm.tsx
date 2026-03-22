import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet } from '../api';
import ImageManager from '../components/ImageManager';

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
  OptionsCouleur: '',
  poids: 0, longueur: 0, largeur: 0, hauteur: 0,
};


const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState<Record<string, any>>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.besoinChoixCouleur || false} onChange={e => set('besoinChoixCouleur', e.target.checked)} />
                <span>Choix de couleur requis</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.besoinChoixTaille || false} onChange={e => set('besoinChoixTaille', e.target.checked)} />
                <span>Choix de taille requis</span>
              </label>
            </div>
            {form.besoinChoixCouleur && (
              <div className="form-group">
                <label className="form-label">Options couleurs (séparées par des virgules)</label>
                <input className="input" value={form.OptionsCouleur || ''} onChange={e => set('OptionsCouleur', e.target.value)} placeholder="Blanc, Beige, Rose" />
              </div>
            )}
          </div>
        </div>

        {/* ── Images ── */}
        <div className="card">
          <h3 className="card-section-title">Images</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Uploadez vos images puis assignez leur rôle : <strong>Principale</strong> (carte produit), <strong>Survol</strong> (hover carte) ou <strong>Galerie</strong> (fiche produit).
          </p>
          <ImageManager
            productId={form.id || ''}
            selected={form.ImagesSupplementaires || []}
            featured={form.ImageProduit || ''}
            featuredHover={form.ImageProduitSup || ''}
            onChangeSelected={paths => set('ImagesSupplementaires', paths)}
            onChangeFeatured={path => set('ImageProduit', path)}
            onChangeFeaturedHover={path => set('ImageProduitSup', path)}
          />
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

        {/* ── Livraison / Colissimo ── */}
        <div className="card">
          <h3 className="card-section-title">Livraison / Colissimo</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Le poids est utilisé pour afficher les informations de livraison sur la fiche produit.
          </p>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Poids (grammes)</label>
              <input type="number" min="0" className="input" value={form.poids || 0} onChange={e => set('poids', parseInt(e.target.value, 10) || 0)} placeholder="ex : 548" />
            </div>
            <div className="form-group">
              <label className="form-label">Longueur (mm)</label>
              <input type="number" min="0" className="input" value={form.longueur || 0} onChange={e => set('longueur', parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Largeur (mm)</label>
              <input type="number" min="0" className="input" value={form.largeur || 0} onChange={e => set('largeur', parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hauteur (mm)</label>
              <input type="number" min="0" className="input" value={form.hauteur || 0} onChange={e => set('hauteur', parseInt(e.target.value, 10) || 0)} />
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
