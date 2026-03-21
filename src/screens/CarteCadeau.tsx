import { motion } from 'framer-motion';
import { useState } from 'react';

const amounts = [10, 20, 30, 50, 75, 100];

export default function CarteCadeau() {
    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const finalAmount = selected ?? (custom ? Number(custom) : null);
    const isValid = finalAmount !== null && finalAmount >= 10 && finalAmount <= 100;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) setSubmitted(true);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="gift-section">
                <h1>Carte Cadeau</h1>
                <p className="gift-intro">Offrez la douceur de La marcOnnête à ceux que vous aimez ✨</p>

                {submitted ? (
                    <motion.div
                        className="gift-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="gift-success-icon">🎁</div>
                        <h3>Votre carte cadeau de {finalAmount}€ est prête !</h3>
                        <p>Vous recevrez votre carte cadeau par email sous 24h.</p>
                        <button onClick={() => { setSubmitted(false); setSelected(null); setCustom(''); }}>
                            Offrir une autre carte
                        </button>
                    </motion.div>
                ) : (
                    <form className="gift-form" onSubmit={handleSubmit}>
                        <div className="gift-card-preview">
                            <div className="gift-card-inner">
                                <p className="gift-card-brand">La marcOnnête</p>
                                <p className="gift-card-tagline">Soin naturel pour bébé</p>
                                <p className="gift-card-amount">
                                    {finalAmount && isValid ? `${finalAmount} €` : '- €'}
                                </p>
                            </div>
                        </div>

                        <h3>Choisissez un montant</h3>
                        <div className="gift-amounts">
                            {amounts.map(a => (
                                <motion.button
                                    key={a}
                                    type="button"
                                    className={`gift-amount-btn${selected === a ? ' active' : ''}`}
                                    onClick={() => { setSelected(a); setCustom(''); }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {a} €
                                </motion.button>
                            ))}
                        </div>

                        <div className="gift-custom">
                            <label htmlFor="custom-amount">Ou saisissez un montant (entre 10€ et 100€)</label>
                            <input
                                id="custom-amount"
                                type="number"
                                min={10}
                                max={100}
                                placeholder="Ex : 45"
                                value={custom}
                                onChange={e => { setCustom(e.target.value); setSelected(null); }}
                            />
                        </div>

                        <div className="gift-recipient">
                            <h3>Informations</h3>
                            <input type="text" placeholder="Votre prénom" required />
                            <input type="email" placeholder="Votre email" required />
                            <input type="text" placeholder="Prénom du destinataire" required />
                            <input type="email" placeholder="Email du destinataire" required />
                            <textarea placeholder="Message personnalisé (optionnel)" rows={3} />
                        </div>

                        <button
                            type="submit"
                            className="gift-submit-btn"
                            disabled={!isValid}
                            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
                        >
                            Offrir pour {isValid ? `${finalAmount} €` : '…'}
                        </button>
                        <p className="gift-note">Paiement sécurisé · Livraison par email sous 24h</p>
                    </form>
                )}
            </section>
        </motion.main>
    );
}
