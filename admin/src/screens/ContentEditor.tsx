import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api';
import { ContentData } from '../types';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [tab, setTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/content')
      .then((data: unknown) => setContent(data as ContentData))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (section: keyof ContentData) => {
    if (!content) return;
    setSaving(true);
    setSuccess('');
    try {
      await apiPut(`/api/content/${section}`, content[section]);
      setSuccess('Section enregistrée avec succès.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const setField = (path: string, value: unknown) => {
    if (!content) return;
    const parts = path.split('.');
    const updated = { ...content };
    let cur: Record<string, unknown> = updated as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = { ...(cur[parts[i]] as Record<string, unknown>) };
      cur = cur[parts[i]] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
    setContent(updated);
  };

  if (loading) return <div className="loading-page">Chargement...</div>;
  if (!content) return <div className="alert alert-error">Erreur chargement contenu</div>;

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Contenu du site</h2>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        Les modifications seront visibles après le prochain déploiement ou si le frontend est connecté à l'API.
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="status-tabs">
        {[
          { key: 'hero', label: "Page d'accueil" },
          { key: 'about', label: 'Notre Histoire' },
          { key: 'engagements', label: 'Nos Engagements' },
          { key: 'footer', label: 'Footer' },
          { key: 'seo', label: 'SEO' }
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'tab-btn-active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="card">
          <h3 className="card-section-title">Section Hero (page d'accueil)</h3>
          <div className="form-group">
            <label className="form-label">Titre principal</label>
            <input className="input" value={content.hero.title} onChange={e => setField('hero.title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Sous-titre</label>
            <textarea className="input textarea" rows={3} value={content.hero.subtitle} onChange={e => setField('hero.subtitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Texte du bouton</label>
            <input className="input" value={content.hero.buttonText} onChange={e => setField('hero.buttonText', e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('hero')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'about' && (
        <div className="card">
          <h3 className="card-section-title">Section Notre Histoire</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content.about.title} onChange={e => setField('about.title', e.target.value)} />
          </div>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="form-group">
              <label className="form-label">Paragraphe {n}</label>
              <textarea className="input textarea" rows={4} value={(content.about as unknown as Record<string, string>)[`text${n}`] || ''} onChange={e => setField(`about.text${n}`, e.target.value)} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('about')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'engagements' && (
        <div className="card">
          <h3 className="card-section-title">Nos Engagements</h3>
          {content.engagements.map((eng, idx) => (
            <div key={eng.id} className="engagement-row">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Engagement {idx + 1} — Titre</label>
                  <input
                    className="input"
                    value={eng.title}
                    onChange={e => {
                      const updated = [...content.engagements];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setContent({ ...content, engagements: updated });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte</label>
                  <textarea
                    className="input textarea"
                    rows={2}
                    value={eng.text}
                    onChange={e => {
                      const updated = [...content.engagements];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setContent({ ...content, engagements: updated });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('engagements')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'footer' && (
        <div className="card">
          <h3 className="card-section-title">Footer — Section Newsletter</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content.footer.newsletter.title} onChange={e => setField('footer.newsletter.title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Sous-titre</label>
            <textarea className="input textarea" rows={3} value={content.footer.newsletter.subtitle} onChange={e => setField('footer.newsletter.subtitle', e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('footer')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'seo' && (
        <div className="card">
          <h3 className="card-section-title">SEO</h3>
          <div className="form-group">
            <label className="form-label">Titre de la page d'accueil</label>
            <input className="input" value={content.seo.homeTitle} onChange={e => setField('seo.homeTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Meta description</label>
            <textarea className="input textarea" rows={4} value={content.seo.homeDescription} onChange={e => setField('seo.homeDescription', e.target.value)} />
            <p className="text-muted text-sm">{content.seo.homeDescription.length}/160 caractères recommandés</p>
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('seo')} disabled={saving}>Enregistrer</button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
