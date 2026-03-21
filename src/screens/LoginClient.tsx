import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginClient: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptCGV: false
  });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
      localStorage.setItem('customer_token', data.token);
      localStorage.setItem('customer_user', JSON.stringify(data.customer));
      navigate('/mon-compte');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!regForm.acceptCGV) {
      setRegError('Vous devez accepter les conditions générales de vente');
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regForm.firstName,
          lastName: regForm.lastName,
          email: regForm.email,
          password: regForm.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription');
      localStorage.setItem('customer_token', data.token);
      localStorage.setItem('customer_user', JSON.stringify(data.customer));
      navigate('/mon-compte');
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="login-client-page"
    >
      <div className="login-client-container">
        <div className="login-client-header">
          <h1>Mon compte</h1>
          <p>La marcOnnête</p>
        </div>

        <div className="login-client-tabs">
          <button
            className={`login-client-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Se connecter
          </button>
          <button
            className={`login-client-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Créer un compte
          </button>
        </div>

        {activeTab === 'login' && (
          <form className="login-client-form" onSubmit={handleLogin}>
            {loginError && <div className="login-client-error">{loginError}</div>}
            <div className="login-client-field">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="login-client-field">
              <label>Mot de passe</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="login-client-btn" disabled={loginLoading}>
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form className="login-client-form" onSubmit={handleRegister}>
            {regError && <div className="login-client-error">{regError}</div>}
            <div className="login-client-row">
              <div className="login-client-field">
                <label>Prénom *</label>
                <input
                  type="text"
                  value={regForm.firstName}
                  onChange={e => setRegForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="login-client-field">
                <label>Nom *</label>
                <input
                  type="text"
                  value={regForm.lastName}
                  onChange={e => setRegForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="login-client-field">
              <label>Email *</label>
              <input
                type="email"
                value={regForm.email}
                onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="login-client-row">
              <div className="login-client-field">
                <label>Mot de passe *</label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
              <div className="login-client-field">
                <label>Confirmer *</label>
                <input
                  type="password"
                  value={regForm.confirmPassword}
                  onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>
            <label className="login-client-check">
              <input
                type="checkbox"
                checked={regForm.acceptCGV}
                onChange={e => setRegForm(f => ({ ...f, acceptCGV: e.target.checked }))}
              />
              <span>J'accepte les <a href="/CGV" target="_blank" rel="noreferrer">conditions générales de vente</a></span>
            </label>
            <button type="submit" className="login-client-btn" disabled={regLoading}>
              {regLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default LoginClient;
