import React, { useEffect, useState, useRef } from 'react';
import { apiGet, apiPut } from '../api';
import { ContentData } from '../types';

const BASE = process.env.REACT_APP_API_URL || '';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [tab, setTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [buildLog, setBuildLog] = useState('');
  const [iconUploading, setIconUploading] = useState<number | null>(null);
  const logRef = useRef<HTMLPreElement>(null);
  const token = localStorage.getItem('admin_token');

  const uploadIcon = async (file: File, idx: number) => {
    setIconUploading(idx);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${BASE}/api/media/content/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!content) return;
      const updated = [...content.engagementsPage.items];
      updated[idx] = { ...updated[idx], icon: data.path };
      setContent({ ...content, engagementsPage: { ...content.engagementsPage, items: updated } });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIconUploading(null);
    }
  };

  useEffect(() => {
    apiGet('/api/content')
      .then((data: unknown) => setContent(data as ContentData))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRebuild = async () => {
    setBuildStatus('running');
    setBuildLog('');
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/build/site', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Pas de flux');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setBuildLog(l => {
          const updated = l + decoder.decode(value);
          setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 0);
          return updated;
        });
      }
      setBuildStatus('done');
    } catch (err) {
      setBuildLog(l => l + '\nErreur : ' + (err instanceof Error ? err.message : String(err)));
      setBuildStatus('error');
    }
  };

  const saveSection = async (section: string) => {
    if (!content) return;
    setSaving(true);
    setSuccess('');
    try {
      await apiPut(`/api/content/${section}`, (content as any)[section]);
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

      <div className="alert alert-info" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span>Les modifications sont sauvegardées. Rebuilder le site pour les appliquer immédiatement.</span>
        <button
          className={`btn btn-sm ${buildStatus === 'running' ? 'btn-secondary' : buildStatus === 'done' ? 'btn-primary' : buildStatus === 'error' ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleRebuild}
          disabled={buildStatus === 'running'}
        >
          {buildStatus === 'running' ? '⏳ Build...' : buildStatus === 'done' ? '✓ Site rebuildé' : buildStatus === 'error' ? '✗ Erreur' : '🔨 Rebuilder le site'}
        </button>
      </div>
      {buildLog && (
        <pre ref={logRef} style={{ background: '#0f172a', color: '#94a3b8', padding: 10, borderRadius: 8, fontSize: 11, maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', marginBottom: 16 }}>
          {buildLog}
        </pre>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="status-tabs">
        {[
          { key: 'hero', label: "Page d'accueil" },
          { key: 'about', label: 'Notre Histoire' },
          { key: 'engagements', label: 'Nos Engagements' },
          { key: 'footer', label: 'Footer' },
          { key: 'seo', label: 'SEO' },
          { key: 'home', label: 'Accueil' },
          { key: 'histoire', label: 'Notre Histoire (page)' },
          { key: 'engagementsPage', label: 'Engagements (page)' },
          { key: 'livraison', label: 'Livraison' },
          { key: 'faq', label: 'FAQ' },
          { key: 'popup', label: 'Popup d\'accueil' },
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

      {tab === 'home' && content.home && (
        <div className="card">
          <h3 className="card-section-title">Accueil — Textes principaux</h3>
          {[
            { field: 'mainTitle', label: 'Titre principal' },
            { field: 'signature', label: 'Signature' },
            { field: 'sectionEngagesTitle', label: "Titre section engagements" },
            { field: 'badge1Title', label: 'Badge 1 — Titre' },
            { field: 'badge1Text', label: 'Badge 1 — Texte' },
            { field: 'badge2Title', label: 'Badge 2 — Titre' },
            { field: 'badge2Text', label: 'Badge 2 — Texte' },
            { field: 'badge3Title', label: 'Badge 3 — Titre' },
            { field: 'badge3Text', label: 'Badge 3 — Texte' },
            { field: 'badge4Title', label: 'Badge 4 — Titre' },
            { field: 'badge4Text', label: 'Badge 4 — Texte' },
          ].map(({ field, label }) => (
            <div key={field} className="form-group">
              <label className="form-label">{label}</label>
              <input className="input" value={(content.home as unknown as Record<string, string>)[field] || ''} onChange={e => setField(`home.${field}`, e.target.value)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Citation</label>
            <textarea className="input textarea" rows={4} value={content.home.citation || ''} onChange={e => setField('home.citation', e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('home')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'histoire' && content.histoire && (
        <div className="card">
          <h3 className="card-section-title">Notre Histoire (page)</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content.histoire.title || ''} onChange={e => setField('histoire.title', e.target.value)} />
          </div>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="form-group">
              <label className="form-label">Paragraphe {n}</label>
              <textarea className="input textarea" rows={4} value={(content.histoire as unknown as Record<string, string>)[`p${n}`] || ''} onChange={e => setField(`histoire.p${n}`, e.target.value)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Titre timeline</label>
            <input className="input" value={content.histoire.timelineTitle || ''} onChange={e => setField('histoire.timelineTitle', e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('histoire')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'engagementsPage' && content.engagementsPage && (
        <div className="card">
          <h3 className="card-section-title">Engagements (page)</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content.engagementsPage.title || ''} onChange={e => setField('engagementsPage.title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Intro</label>
            <textarea className="input textarea" rows={4} value={content.engagementsPage.intro || ''} onChange={e => setField('engagementsPage.intro', e.target.value)} />
          </div>
          {content.engagementsPage.items.map((item, idx) => (
            <div key={idx} className="engagement-row">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Engagement {idx + 1} — Icône</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http'))
                      ? <img src={`${BASE}${item.icon.startsWith('http') ? '' : ''}${item.icon}`} alt="" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border)', background: '#f8fafc' }} />
                      : item.icon
                        ? <span style={{ fontSize: 36, lineHeight: 1 }}>{item.icon}</span>
                        : <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 6, border: '1px solid var(--border)' }} />
                    }
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input
                        className="input"
                        value={item.icon}
                        placeholder="Emoji (✨) ou chemin image (/images/...)"
                        onChange={e => {
                          const updated = [...content.engagementsPage.items];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setContent({ ...content, engagementsPage: { ...content.engagementsPage, items: updated } });
                        }}
                      />
                      <label
                        htmlFor={`icon-upload-${idx}`}
                        className="btn btn-secondary"
                        style={{ cursor: 'pointer', textAlign: 'center', fontSize: 12 }}
                      >
                        {iconUploading === idx ? 'Upload...' : '📁 Uploader une image'}
                      </label>
                      <input
                        id={`icon-upload-${idx}`}
                        type="file"
                        accept="image/*,.svg"
                        style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadIcon(f, idx); e.target.value = ''; }}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Titre</label>
                  <input className="input" value={item.titre} onChange={e => {
                    const updated = [...content.engagementsPage.items];
                    updated[idx] = { ...updated[idx], titre: e.target.value };
                    setContent({ ...content, engagementsPage: { ...content.engagementsPage, items: updated } });
                  }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Texte</label>
                  <textarea className="input textarea" rows={3} value={item.texte} onChange={e => {
                    const updated = [...content.engagementsPage.items];
                    updated[idx] = { ...updated[idx], texte: e.target.value };
                    setContent({ ...content, engagementsPage: { ...content.engagementsPage, items: updated } });
                  }} />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('engagementsPage')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'livraison' && content.livraison && (
        <div className="card">
          <h3 className="card-section-title">Livraison</h3>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content.livraison.title || ''} onChange={e => setField('livraison.title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Intro</label>
            <textarea className="input textarea" rows={2} value={content.livraison.intro || ''} onChange={e => setField('livraison.intro', e.target.value)} />
          </div>
          <h4 style={{ margin: '16px 0 8px' }}>Tableau des modes de livraison</h4>
          {content.livraison.shipping.map((row, idx) => (
            <div key={idx} className="form-row" style={{ gap: 8, marginBottom: 8 }}>
              <div className="form-group">
                <label className="form-label">Mode</label>
                <input className="input" value={row.mode} onChange={e => {
                  const updated = [...content.livraison.shipping];
                  updated[idx] = { ...updated[idx], mode: e.target.value };
                  setContent({ ...content, livraison: { ...content.livraison, shipping: updated } });
                }} />
              </div>
              <div className="form-group">
                <label className="form-label">Détail</label>
                <input className="input" value={row.detail} onChange={e => {
                  const updated = [...content.livraison.shipping];
                  updated[idx] = { ...updated[idx], detail: e.target.value };
                  setContent({ ...content, livraison: { ...content.livraison, shipping: updated } });
                }} />
              </div>
              <div className="form-group">
                <label className="form-label">Délai</label>
                <input className="input" value={row.delay} onChange={e => {
                  const updated = [...content.livraison.shipping];
                  updated[idx] = { ...updated[idx], delay: e.target.value };
                  setContent({ ...content, livraison: { ...content.livraison, shipping: updated } });
                }} />
              </div>
              <div className="form-group">
                <label className="form-label">Prix</label>
                <input className="input" value={row.price} onChange={e => {
                  const updated = [...content.livraison.shipping];
                  updated[idx] = { ...updated[idx], price: e.target.value };
                  setContent({ ...content, livraison: { ...content.livraison, shipping: updated } });
                }} />
              </div>
            </div>
          ))}
          <h4 style={{ margin: '16px 0 8px' }}>Infos complémentaires</h4>
          {[
            { titleField: 'info1Title', textField: 'info1Text', label: 'Info 1' },
            { titleField: 'info2Title', textField: 'info2Text', label: 'Info 2' },
            { titleField: 'info3Title', textField: 'info3Text', label: 'Info 3' },
          ].map(({ titleField, textField, label }) => (
            <div key={titleField} className="form-row" style={{ gap: 8, marginBottom: 8 }}>
              <div className="form-group">
                <label className="form-label">{label} — Titre</label>
                <input className="input" value={(content.livraison as unknown as Record<string, string>)[titleField] || ''} onChange={e => setField(`livraison.${titleField}`, e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{label} — Texte</label>
                <textarea className="input textarea" rows={2} value={(content.livraison as unknown as Record<string, string>)[textField] || ''} onChange={e => setField(`livraison.${textField}`, e.target.value)} />
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('livraison')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'faq' && content.faq && (
        <div className="card">
          <h3 className="card-section-title">FAQ</h3>
          {content.faq.map((section, sIdx) => (
            <details key={sIdx} style={{ marginBottom: 16, border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: 8 }}>
                Section : {section.title}
              </summary>
              <div className="form-group">
                <label className="form-label">Titre de la section</label>
                <input className="input" value={section.title} onChange={e => {
                  const updated = [...content.faq];
                  updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                  setContent({ ...content, faq: updated });
                }} />
              </div>
              {section.items.map((item, iIdx) => (
                <div key={item.id} style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 8 }}>
                  <div className="form-group">
                    <label className="form-label">Q{iIdx + 1} — Question</label>
                    <input className="input" value={item.question} onChange={e => {
                      const updatedFaq = [...content.faq];
                      const updatedItems = [...updatedFaq[sIdx].items];
                      updatedItems[iIdx] = { ...updatedItems[iIdx], question: e.target.value };
                      updatedFaq[sIdx] = { ...updatedFaq[sIdx], items: updatedItems };
                      setContent({ ...content, faq: updatedFaq });
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Q{iIdx + 1} — Réponse</label>
                    <textarea className="input textarea" rows={3} value={item.answer} onChange={e => {
                      const updatedFaq = [...content.faq];
                      const updatedItems = [...updatedFaq[sIdx].items];
                      updatedItems[iIdx] = { ...updatedItems[iIdx], answer: e.target.value };
                      updatedFaq[sIdx] = { ...updatedFaq[sIdx], items: updatedItems };
                      setContent({ ...content, faq: updatedFaq });
                    }} />
                  </div>
                </div>
              ))}
            </details>
          ))}
          <button className="btn btn-primary" onClick={() => saveSection('faq')} disabled={saving}>Enregistrer</button>
        </div>
      )}

      {tab === 'popup' && (
        <div className="card">
          <h3 className="card-section-title">Popup d'accueil</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Affiché automatiquement aux visiteurs selon la fréquence choisie.
          </p>
          <div className="form-group">
            <label className="form-check">
              <input type="checkbox"
                checked={content?.welcomePopup?.active || false}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), active: e.target.checked } })} />
              <span>Popup actif</span>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="input" value={content?.welcomePopup?.titre || ''}
              onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), titre: e.target.value } })} />
          </div>
          <div className="form-group">
            <label className="form-label">Texte</label>
            <textarea className="input textarea" rows={3} value={content?.welcomePopup?.texte || ''}
              onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), texte: e.target.value } })} />
          </div>
          <div className="form-group">
            <label className="form-label">Image (URL ou chemin)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="input" value={content?.welcomePopup?.image || ''}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), image: e.target.value } })} />
              <label htmlFor="popup-img-upload" className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                📷 Uploader
              </label>
              <input id="popup-img-upload" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('image', file);
                  const res = await fetch(`${BASE}/api/media/content/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
                  const data = await res.json();
                  if (res.ok) setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), image: data.path } });
                }} />
            </div>
            {content?.welcomePopup?.image && (
              <img src={`${BASE}${content.welcomePopup.image}`} alt="" style={{ marginTop: 8, maxHeight: 120, borderRadius: 8, objectFit: 'contain' }} />
            )}
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Code promo affiché</label>
              <input className="input" placeholder="BIENVENUE10" value={content?.welcomePopup?.promoCode || ''}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), promoCode: e.target.value } })} />
            </div>
            <div className="form-group">
              <label className="form-label">Fréquence</label>
              <select className="input select" value={content?.welcomePopup?.frequency || 'once'}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), frequency: e.target.value } })}>
                <option value="once">Une seule fois</option>
                <option value="daily">Une fois par jour</option>
                <option value="always">À chaque visite</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Délai d'affichage (ms)</label>
              <input type="number" className="input" value={content?.welcomePopup?.delayMs || 1500}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), delayMs: parseInt(e.target.value) || 1500 } })} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Texte bouton CTA</label>
              <input className="input" placeholder="Découvrir nos produits" value={content?.welcomePopup?.ctaLabel || ''}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), ctaLabel: e.target.value } })} />
            </div>
            <div className="form-group">
              <label className="form-label">URL bouton CTA</label>
              <input className="input" placeholder="/produits" value={content?.welcomePopup?.ctaUrl || ''}
                onChange={e => setContent({ ...content!, welcomePopup: { ...(content?.welcomePopup || {}), ctaUrl: e.target.value } })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => saveSection('welcomePopup')} disabled={saving}>Enregistrer le popup</button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
