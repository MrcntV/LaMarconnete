import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiGet, apiPost, apiDelete } from '../api';
import { NewsletterSubscriber } from '../types';

const Newsletter: React.FC = () => {
  const [tab, setTab] = useState<'subscribers' | 'send'>('subscribers');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = () => {
    setLoading(true);
    apiGet('/api/newsletter/subscribers')
      .then((data: unknown) => setSubscribers(Array.isArray(data) ? data as NewsletterSubscriber[] : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDelete(`/api/newsletter/subscribers/${deleteId}`);
      setSubscribers(s => s.filter(sub => sub.id !== deleteId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendResult('');
    try {
      const result = await apiPost('/api/newsletter/send', { subject, htmlContent, testEmail: testEmail || undefined }) as { message: string };
      setSendResult(result.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  const exportCSV = () => {
    const active = subscribers.filter(s => s.active);
    const csv = ['Email,Prénom,Date inscription', ...active.map(s => `${s.email},${s.firstName || ''},${new Date(s.subscribedAt).toLocaleDateString('fr-FR')}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_abonnes.csv';
    a.click();
  };

  const filtered = subscribers.filter(s => !search || s.email.toLowerCase().includes(search.toLowerCase()) || (s.firstName || '').toLowerCase().includes(search.toLowerCase()));
  const activeCount = subscribers.filter(s => s.active).length;

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Newsletter</h2>
        <span className="text-muted">{activeCount} abonné(s) actif(s)</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="status-tabs">
        <button className={`tab-btn ${tab === 'subscribers' ? 'tab-btn-active' : ''}`} onClick={() => setTab('subscribers')}>
          Abonnés ({activeCount})
        </button>
        <button className={`tab-btn ${tab === 'send' ? 'tab-btn-active' : ''}`} onClick={() => setTab('send')}>
          Envoyer une newsletter
        </button>
      </div>

      {tab === 'subscribers' && (
        <div className="card">
          <div className="card-header">
            <input className="input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-secondary" onClick={exportCSV}>Exporter CSV</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Email</th><th>Prénom</th><th>Inscrit le</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="table-loading">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="table-empty">Aucun abonné</td></tr>
                ) : (
                  filtered.map(sub => (
                    <tr key={sub.id}>
                      <td>{sub.email}</td>
                      <td>{sub.firstName || '—'}</td>
                      <td>{new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}</td>
                      <td><Badge status={sub.active ? 'active' : 'inactive'} label={sub.active ? 'Abonné' : 'Désinscrit'} /></td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(sub.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'send' && (
        <div className="card">
          <div className="alert alert-warning" style={{ marginBottom: 16 }}>
            EmailJS doit être configuré dans les paramètres pour l'envoi réel.
          </div>
          {sendResult && <div className="alert alert-success">{sendResult}</div>}
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">Objet de la newsletter *</label>
              <input className="input" value={subject} onChange={e => setSubject(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contenu HTML</label>
              <textarea className="input textarea" rows={12} value={htmlContent} onChange={e => setHtmlContent(e.target.value)} placeholder="<h1>Bonjour !</h1><p>Votre message...</p>" required />
            </div>
            {htmlContent && (
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Aperçu</label>
                <div className="html-preview" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email de test (optionnel)</label>
              <input type="email" className="input" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="test@exemple.com" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Envoi...' : testEmail ? `Envoyer au test (${testEmail})` : `Envoyer à ${activeCount} abonnés`}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'abonné"
        message="Confirmer la suppression de cet abonné ?"
        confirmLabel="Supprimer"
        danger
      />
    </div>
  );
};

export default Newsletter;
