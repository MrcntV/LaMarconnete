import { motion } from 'framer-motion';

export default function Livraison() {
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="livraison-section">
                <h1>Modalités de livraison</h1>

                <motion.p
                    className="livraison-intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Nous livrons exclusivement en <strong>France métropolitaine</strong>, en <strong>Corse</strong> et à <strong>Monaco</strong>.
                </motion.p>

                <motion.div
                    className="livraison-table-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <table className="livraison-table">
                        <thead>
                            <tr>
                                <th>Mode de livraison</th>
                                <th>Délai estimé</th>
                                <th>Tarif</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Point relais</strong>
                                    <span className="livraison-detail">Retrait en bureau de poste ou point relais</span>
                                </td>
                                <td>2 – 5 jours ouvrés</td>
                                <td className="livraison-prix">6,10 €</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>À domicile sans signature</strong>
                                    <span className="livraison-detail">Dépôt dans la boîte aux lettres ou devant la porte</span>
                                </td>
                                <td>2 – 5 jours ouvrés</td>
                                <td className="livraison-prix">6,95 €</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>À domicile avec signature</strong>
                                    <span className="livraison-detail">Remise en main propre contre signature</span>
                                </td>
                                <td>2 – 5 jours ouvrés</td>
                                <td className="livraison-prix">8,35 €</td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>

                <motion.div
                    className="livraison-infos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="livraison-info-card">
                        <span className="livraison-info-icon">📦</span>
                        <div>
                            <strong>Suivi de commande</strong>
                            <p>Un numéro de suivi vous est envoyé par e-mail dès l'expédition, utilisable sur laposte.fr.</p>
                        </div>
                    </div>
                    <div className="livraison-info-card">
                        <span className="livraison-info-icon">⏱️</span>
                        <div>
                            <strong>Délai de traitement</strong>
                            <p>Les commandes sont traitées sous 1 à 2 jours ouvrés après confirmation du paiement.</p>
                        </div>
                    </div>
                    <div className="livraison-info-card">
                        <span className="livraison-info-icon">❓</span>
                        <div>
                            <strong>Un problème de livraison ?</strong>
                            <p>Contactez notre service client via le formulaire de <a href="/Contact">contact</a> ou à <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a></p>
                        </div>
                    </div>
                </motion.div>
            </section>
        </motion.main>
    );
}
