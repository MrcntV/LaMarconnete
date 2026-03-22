import React, { useState, useRef, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || '';

interface EnvVar {
  set: boolean;
  preview: string | null;
}

type EnvStatus = Record<string, EnvVar>;

interface StripeTestResult {
  ok: boolean;
  mode?: string;
  available?: string[];
  error?: string;
}

const ENV_GROUPS = [
  {
    title: 'Stripe — Mode Live',
    vars: ['STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  },
  {
    title: 'Stripe — Mode Test',
    vars: ['STRIPE_TEST_PUBLIC_KEY', 'STRIPE_TEST_SECRET_KEY', 'STRIPE_TEST_WEBHOOK_SECRET'],
  },
  {
    title: 'Base de données',
    vars: ['MONGODB_URI'],
  },
  {
    title: 'Authentification',
    vars: ['JWT_SECRET'],
  },
  {
    title: 'EmailJS',
    vars: ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY'],
  },
  {
    title: 'Colissimo (La Poste Pro)',
    vars: ['COLISSIMO_LOGIN', 'COLISSIMO_PASSWORD', 'COLISSIMO_CONTRACT'],
  },
  {
    title: 'Google Places API (avis)',
    vars: ['GOOGLE_PLACES_API_KEY', 'GOOGLE_PLACE_ID'],
  },
  {
    title: 'Instagram Graph API',
    vars: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID'],
  },
  {
    title: 'Domaines & Notifications',
    vars: ['SITE_DOMAIN', 'ADMIN_DOMAIN', 'ADMIN_EMAIL'],
  },
];

const Settings: React.FC = () => {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [stripeTest, setStripeTest] = useState<Record<string, StripeTestResult | null>>({ test: null, live: null });
  const [stripeTesting, setStripeTesting] = useState<Record<string, boolean>>({ test: false, live: false });

  // Google Reviews
  const [reviewsStatus, setReviewsStatus] = useState<any>(null);
  const [reviewsRefreshing, setReviewsRefreshing] = useState(false);
  const [reviewsMsg, setReviewsMsg] = useState('');

  // Instagram
  const [instaStatus, setInstaStatus] = useState<any>(null);
  const [instaRefreshing, setInstaRefreshing] = useState(false);
  const [instaMsg, setInstaMsg] = useState('');
  const [instaTokenMsg, setInstaTokenMsg] = useState('');

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [buildStatus, setBuildStatus] = useState<Record<string, 'idle' | 'running' | 'done' | 'error'>>({ site: 'idle', admin: 'idle' });
  const [buildLog, setBuildLog] = useState<Record<string, string>>({ site: '', admin: '' });
  const logRef = useRef<HTMLPreElement>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetch(`${BASE}/api/settings/env`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setEnvStatus(data); setEnvLoading(false); })
      .catch(() => setEnvLoading(false));

    // Load Google reviews status
    fetch(`${BASE}/api/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setReviewsStatus(data))
      .catch(() => {});

    // Load Instagram status
    fetch(`${BASE}/api/instagram/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setInstaStatus(data))
      .catch(() => {});
  }, []);

  const testStripe = async (mode: 'test' | 'live') => {
    setStripeTesting(s => ({ ...s, [mode]: true }));
    setStripeTest(s => ({ ...s, [mode]: null }));
    try {
      const res = await fetch(`${BASE}/api/settings/stripe/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      setStripeTest(s => ({ ...s, [mode]: data }));
    } catch (err: any) {
      setStripeTest(s => ({ ...s, [mode]: { ok: false, error: err.message } }));
    } finally {
      setStripeTesting(s => ({ ...s, [mode]: false }));
    }
  };

  const handleBuild = async (target: 'site' | 'admin') => {
    setBuildStatus(s => ({ ...s, [target]: 'running' }));
    setBuildLog(l => ({ ...l, [target]: '' }));
    try {
      const res = await fetch(`${BASE}/api/build/${target}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Pas de flux');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setBuildLog(l => {
          const updated = { ...l, [target]: l[target] + chunk };
          setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 0);
          return updated;
        });
      }
      setBuildStatus(s => ({ ...s, [target]: 'done' }));
    } catch (err) {
      setBuildLog(l => ({ ...l, [target]: l[target] + '\nErreur : ' + (err instanceof Error ? err.message : String(err)) }));
      setBuildStatus(s => ({ ...s, [target]: 'error' }));
    }
  };

  const handleSave = (section: string) => {
    setSaved(s => ({ ...s, [section]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 3000);
  };

  const refreshReviews = async () => {
    setReviewsRefreshing(true);
    setReviewsMsg('');
    try {
      const res = await fetch(`${BASE}/api/reviews/refresh`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviewsStatus(data);
      setReviewsMsg(`✓ ${data.reviews?.length || 0} avis importés de Google`);
    } catch (err: any) {
      setReviewsMsg(`✗ ${err.message}`);
    } finally {
      setReviewsRefreshing(false);
    }
  };

  const refreshInstagram = async () => {
    setInstaRefreshing(true);
    setInstaMsg('');
    try {
      const res = await fetch(`${BASE}/api/instagram/refresh`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInstaStatus(data);
      setInstaMsg(`✓ ${data.count} posts Instagram importés`);
    } catch (err: any) {
      setInstaMsg(`✗ ${err.message}`);
    } finally {
      setInstaRefreshing(false);
    }
  };

  const refreshInstaToken = async () => {
    setInstaTokenMsg('');
    try {
      const res = await fetch(`${BASE}/api/instagram/refresh-token`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInstaTokenMsg(`Nouveau token : ${data.newToken?.slice(0, 20)}... (expire dans ${Math.round(data.expiresIn / 86400)} jours) — Mettez à jour INSTAGRAM_ACCESS_TOKEN dans .env`);
    } catch (err: any) {
      setInstaTokenMsg(`✗ ${err.message}`);
    }
  };

  const StatusBadge = ({ v }: { v: EnvVar }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
      background: v.set ? '#dcfce7' : '#fee2e2',
      color: v.set ? '#166534' : '#991b1b',
    }}>
      {v.set ? '✓ Configuré' : '✗ Manquant'}
      {v.preview && <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 4 }}>{v.preview}</span>}
    </span>
  );

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Paramètres</h2>
      </div>

      {/* ── État des variables d'environnement ──────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-section-title">État des variables d'environnement (.env)</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Lecture en temps réel depuis le serveur. Pour modifier, éditez le fichier <code>.env</code> sur le serveur et redémarrez.
        </p>
        {envLoading ? (
          <p>Chargement...</p>
        ) : !envStatus ? (
          <p style={{ color: 'red' }}>Impossible de charger l'état des variables.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {ENV_GROUPS.map(group => (
              <div key={group.title}>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--text-muted)' }}>{group.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {group.vars.map(key => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      <code style={{ fontSize: 12 }}>{key}</code>
                      {envStatus[key] ? <StatusBadge v={envStatus[key]} /> : <span style={{ fontSize: 11, color: '#999' }}>—</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Test connexion Stripe ──────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-section-title">Test connexion Stripe</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Vérifie que les clés API Stripe sont valides en appelant l'API Stripe directement depuis le serveur.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {(['test', 'live'] as const).map(mode => (
            <div key={mode} style={{ flex: 1, minWidth: 200 }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginBottom: 8 }}
                onClick={() => testStripe(mode)}
                disabled={stripeTesting[mode]}
              >
                {stripeTesting[mode] ? 'Test en cours...' : `Tester mode ${mode}`}
              </button>
              {stripeTest[mode] && (
                <div style={{
                  padding: '8px 12px', borderRadius: 6, fontSize: 12,
                  background: stripeTest[mode]!.ok ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${stripeTest[mode]!.ok ? '#bbf7d0' : '#fecaca'}`,
                  color: stripeTest[mode]!.ok ? '#15803d' : '#b91c1c',
                }}>
                  {stripeTest[mode]!.ok ? (
                    <>
                      <strong>Connexion OK</strong><br />
                      Mode réel : <strong>{stripeTest[mode]!.mode}</strong><br />
                      Solde : {stripeTest[mode]!.available?.join(', ') || '0.00 EUR'}
                    </>
                  ) : (
                    <>
                      <strong>Erreur</strong><br />
                      {stripeTest[mode]!.error}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-grid">
        {/* ── Compte admin ──────────────────────────────────── */}
        <div className="card">
          <h3 className="card-section-title">Compte admin</h3>
          {saved.password && <div className="alert alert-success">Mot de passe mis à jour</div>}
          <div className="form-group">
            <label className="form-label">Mot de passe actuel</label>
            <input type="password" className="input" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input type="password" className="input" value={passwordForm.newPass} onChange={e => setPasswordForm(f => ({ ...f, newPass: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input type="password" className="input" value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('password')}>Changer le mot de passe</button>
        </div>

        {/* ── Boutique ──────────────────────────────────────── */}
        <div className="card">
          <h3 className="card-section-title">Boutique</h3>
          {saved.shop && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Taux TVA (%)</label>
            <input type="number" className="input" defaultValue="20" />
          </div>
          <div className="form-group">
            <label className="form-label">Devise</label>
            <select className="input select" defaultValue="EUR">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Seuil livraison gratuite (€)</label>
            <input type="number" className="input" defaultValue="50" />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('shop')}>Enregistrer</button>
        </div>
      </div>

      {/* ── Google Reviews ──────────────────────────────────── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-section-title">Avis Google</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Les avis sont récupérés depuis la <strong>Google Places API</strong> et affichés sur la page d'accueil.
          Ils se rafraîchissent automatiquement toutes les 24h.<br />
          Variables requises : <code>GOOGLE_PLACES_API_KEY</code> + <code>GOOGLE_PLACE_ID</code>
        </p>
        {reviewsStatus && (
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            {reviewsStatus.configured ? (
              <span style={{ color: '#166534' }}>
                ✓ {reviewsStatus.reviews?.length || 0} avis en cache
                {reviewsStatus.rating && ` · Note : ${reviewsStatus.rating}/5`}
                {reviewsStatus.lastRefreshed && ` · Mis à jour : ${new Date(reviewsStatus.lastRefreshed).toLocaleString('fr-FR')}`}
              </span>
            ) : (
              <span style={{ color: '#991b1b' }}>✗ Non configuré — avis statiques affichés</span>
            )}
          </div>
        )}
        {reviewsMsg && <div className={`alert ${reviewsMsg.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 10 }}>{reviewsMsg}</div>}
        <button className="btn btn-primary" onClick={refreshReviews} disabled={reviewsRefreshing}>
          {reviewsRefreshing ? 'Rafraîchissement...' : '🔄 Rafraîchir les avis Google'}
        </button>
      </div>

      {/* ── Instagram ──────────────────────────────────────── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-section-title">Feed Instagram</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Les posts sont récupérés depuis l'<strong>Instagram Graph API</strong> et affichés dans le carrousel du footer.
          Mise à jour automatique toutes les 24h.<br />
          Variables requises : <code>INSTAGRAM_ACCESS_TOKEN</code> + <code>INSTAGRAM_USER_ID</code>
        </p>
        {instaStatus && (
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            {instaStatus.configured ? (
              <span style={{ color: '#166534' }}>
                ✓ {instaStatus.postCount} posts en cache
                {instaStatus.lastRefreshed && ` · Mis à jour : ${new Date(instaStatus.lastRefreshed).toLocaleString('fr-FR')}`}
              </span>
            ) : (
              <span style={{ color: '#991b1b' }}>✗ Non configuré — images statiques affichées</span>
            )}
          </div>
        )}
        {instaMsg && <div className={`alert ${instaMsg.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 10 }}>{instaMsg}</div>}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          <button className="btn btn-primary" onClick={refreshInstagram} disabled={instaRefreshing}>
            {instaRefreshing ? 'Rafraîchissement...' : '🔄 Rafraîchir le feed Instagram'}
          </button>
          <button className="btn btn-secondary" onClick={refreshInstaToken}>
            🔑 Renouveler le token
          </button>
        </div>
        {instaTokenMsg && (
          <div className={`alert ${instaTokenMsg.startsWith('✗') ? 'alert-error' : 'alert-success'}`} style={{ fontSize: 12, wordBreak: 'break-all' }}>
            {instaTokenMsg}
          </div>
        )}
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}>Comment obtenir les identifiants Instagram ?</summary>
          <div style={{ fontSize: 12, lineHeight: 1.7, marginTop: 8, padding: '10px', background: 'var(--bg)', borderRadius: 6 }}>
            <ol style={{ margin: 0, paddingLeft: 16 }}>
              <li>Créez une <strong>application Facebook</strong> sur <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">developers.facebook.com</a></li>
              <li>Ajoutez le produit <strong>Instagram Basic Display</strong></li>
              <li>Connectez votre compte Instagram Business dans les paramètres de l'app</li>
              <li>Générez un token d'accès utilisateur (valide 60 jours)</li>
              <li>Récupérez votre <strong>User ID</strong> via <code>GET /me?access_token=TOKEN</code></li>
              <li>Ajoutez dans <code>.env</code> : <code>INSTAGRAM_ACCESS_TOKEN=...</code> et <code>INSTAGRAM_USER_ID=...</code></li>
              <li>Le token expire tous les 60 jours — utilisez "Renouveler le token" avant expiration</li>
            </ol>
          </div>
        </details>
      </div>

      {/* ── Déploiement ──────────────────────────────────────── */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-section-title">Déploiement</h3>
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
          Rebuild les applications React directement depuis le panel.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className={`btn ${buildStatus.site === 'running' ? 'btn-secondary' : buildStatus.site === 'done' ? 'btn-primary' : buildStatus.site === 'error' ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => handleBuild('site')}
            disabled={buildStatus.site === 'running' || buildStatus.admin === 'running'}
          >
            {buildStatus.site === 'running' ? '⏳ Build site...' : buildStatus.site === 'done' ? '✓ Site buildé' : buildStatus.site === 'error' ? '✗ Erreur site' : '🔨 Build site'}
          </button>
          <button
            className={`btn ${buildStatus.admin === 'running' ? 'btn-secondary' : buildStatus.admin === 'done' ? 'btn-primary' : buildStatus.admin === 'error' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => handleBuild('admin')}
            disabled={buildStatus.site === 'running' || buildStatus.admin === 'running'}
          >
            {buildStatus.admin === 'running' ? '⏳ Build admin...' : buildStatus.admin === 'done' ? '✓ Admin buildé' : buildStatus.admin === 'error' ? '✗ Erreur admin' : '🔨 Build admin'}
          </button>
        </div>

        {(buildLog.site || buildLog.admin) && (
          <pre
            ref={logRef}
            style={{
              marginTop: 16, background: '#0f172a', color: '#94a3b8',
              padding: 12, borderRadius: 8, fontSize: 11,
              maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}
          >
            {buildLog.site || buildLog.admin}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Settings;
