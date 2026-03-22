import React, { useState, useRef, useEffect } from 'react';

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
    title: 'Colissimo',
    vars: ['COLISSIMO_API_KEY', 'COLISSIMO_ACCOUNT_NUMBER'],
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

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [buildStatus, setBuildStatus] = useState<Record<string, 'idle' | 'running' | 'done' | 'error'>>({ site: 'idle', admin: 'idle' });
  const [buildLog, setBuildLog] = useState<Record<string, string>>({ site: '', admin: '' });
  const logRef = useRef<HTMLPreElement>(null);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetch('/api/settings/env', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setEnvStatus(data); setEnvLoading(false); })
      .catch(() => setEnvLoading(false));
  }, []);

  const testStripe = async (mode: 'test' | 'live') => {
    setStripeTesting(s => ({ ...s, [mode]: true }));
    setStripeTest(s => ({ ...s, [mode]: null }));
    try {
      const res = await fetch('/api/settings/stripe/test', {
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
      const res = await fetch(`/api/build/${target}`, {
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
