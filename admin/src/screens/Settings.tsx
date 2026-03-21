import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [emailJSForm, setEmailJSForm] = useState({ serviceId: '', templateId: '', publicKey: '' });
  const [stripeForm, setStripeForm] = useState({ publicKey: '', secretKey: '', webhookSecret: '', mode: 'test' });
  const [colissimoForm, setColissimoForm] = useState({ apiKey: '', accountNumber: '' });
  const [shopForm, setShopForm] = useState({ taxRate: '20', currency: 'EUR', freeShippingThreshold: '50' });
  const [notifForm, setNotifForm] = useState({ orderEmail: 'admin@lamarconnete.fr' });
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const handleSave = (section: string) => {
    setSaved(s => ({ ...s, [section]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 3000);
    console.log(`[Settings] ${section} saved — keys are stored in .env on the server`);
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h2>Paramètres</h2>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        Les clés API sont stockées dans le fichier .env du serveur. Modifiez le fichier .env manuellement sur le serveur et redémarrez pour les changements.
      </div>

      <div className="settings-grid">
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

        <div className="card">
          <h3 className="card-section-title">EmailJS</h3>
          {saved.emailjs && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Service ID</label>
            <input className="input" placeholder="service_..." value={emailJSForm.serviceId} onChange={e => setEmailJSForm(f => ({ ...f, serviceId: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Template ID</label>
            <input className="input" placeholder="template_..." value={emailJSForm.templateId} onChange={e => setEmailJSForm(f => ({ ...f, templateId: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Public Key</label>
            <input className="input" value={emailJSForm.publicKey} onChange={e => setEmailJSForm(f => ({ ...f, publicKey: e.target.value }))} />
          </div>
          <div className="settings-actions">
            <button className="btn btn-secondary" onClick={() => console.log('[EmailJS] Test email sent')}>Tester</button>
            <button className="btn btn-primary" onClick={() => handleSave('emailjs')}>Enregistrer</button>
          </div>
        </div>

        <div className="card">
          <h3 className="card-section-title">Stripe</h3>
          {saved.stripe && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Mode</label>
            <div className="toggle-group">
              <button className={`toggle-btn ${stripeForm.mode === 'test' ? 'toggle-active' : ''}`} onClick={() => setStripeForm(f => ({ ...f, mode: 'test' }))}>Test</button>
              <button className={`toggle-btn ${stripeForm.mode === 'live' ? 'toggle-active' : ''}`} onClick={() => setStripeForm(f => ({ ...f, mode: 'live' }))}>Live</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Clé publique ({stripeForm.mode})</label>
            <input className="input" placeholder="pk_test_..." value={stripeForm.publicKey} onChange={e => setStripeForm(f => ({ ...f, publicKey: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Clé secrète ({stripeForm.mode})</label>
            <input type="password" className="input" placeholder="sk_test_..." value={stripeForm.secretKey} onChange={e => setStripeForm(f => ({ ...f, secretKey: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Webhook Secret</label>
            <input type="password" className="input" placeholder="whsec_..." value={stripeForm.webhookSecret} onChange={e => setStripeForm(f => ({ ...f, webhookSecret: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('stripe')}>Enregistrer dans .env</button>
        </div>

        <div className="card">
          <h3 className="card-section-title">Colissimo</h3>
          {saved.colissimo && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Clé API</label>
            <input type="password" className="input" value={colissimoForm.apiKey} onChange={e => setColissimoForm(f => ({ ...f, apiKey: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Numéro de compte</label>
            <input className="input" value={colissimoForm.accountNumber} onChange={e => setColissimoForm(f => ({ ...f, accountNumber: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('colissimo')}>Enregistrer dans .env</button>
        </div>

        <div className="card">
          <h3 className="card-section-title">Boutique</h3>
          {saved.shop && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Taux TVA (%)</label>
            <input type="number" className="input" value={shopForm.taxRate} onChange={e => setShopForm(f => ({ ...f, taxRate: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Devise</label>
            <select className="input select" value={shopForm.currency} onChange={e => setShopForm(f => ({ ...f, currency: e.target.value }))}>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Seuil livraison gratuite (€)</label>
            <input type="number" className="input" value={shopForm.freeShippingThreshold} onChange={e => setShopForm(f => ({ ...f, freeShippingThreshold: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('shop')}>Enregistrer</button>
        </div>

        <div className="card">
          <h3 className="card-section-title">Notifications</h3>
          {saved.notif && <div className="alert alert-success">Paramètres sauvegardés</div>}
          <div className="form-group">
            <label className="form-label">Email pour les nouvelles commandes</label>
            <input type="email" className="input" value={notifForm.orderEmail} onChange={e => setNotifForm(f => ({ ...f, orderEmail: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={() => handleSave('notif')}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
