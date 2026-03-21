import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const defaultShipping = [
    { mode: "Point relais", detail: "Retrait en bureau de poste ou point relais", delay: "2 – 5 jours ouvrés", price: "6,10 €" },
    { mode: "À domicile sans signature", detail: "Dépôt dans la boîte aux lettres ou devant la porte", delay: "2 – 5 jours ouvrés", price: "6,95 €" },
    { mode: "À domicile avec signature", detail: "Remise en main propre contre signature", delay: "2 – 5 jours ouvrés", price: "8,35 €" },
];

export default function Livraison() {
    const content = useContent();
    const livraison = content.livraison || {};
    const shipping = livraison.shipping || defaultShipping;

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="livraison-section">
                <h1>{livraison.title || "Modalités de livraison"}</h1>

                <motion.p
                    className="livraison-intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {livraison.intro || "Nous livrons exclusivement en France métropolitaine, en Corse et à Monaco."}
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
                            {shipping.map((row: { mode: string; detail: string; delay: string; price: string }, i: number) => (
                                <tr key={i}>
                                    <td>
                                        <strong>{row.mode}</strong>
                                        <span className="livraison-detail">{row.detail}</span>
                                    </td>
                                    <td>{row.delay}</td>
                                    <td className="livraison-prix">{row.price}</td>
                                </tr>
                            ))}
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
                            <strong>{livraison.info1Title || "Suivi de commande"}</strong>
                            <p>{livraison.info1Text || "Un numéro de suivi vous est envoyé par e-mail dès l'expédition, utilisable sur laposte.fr."}</p>
                        </div>
                    </div>
                    <div className="livraison-info-card">
                        <span className="livraison-info-icon">⏱️</span>
                        <div>
                            <strong>{livraison.info2Title || "Délai de traitement"}</strong>
                            <p>{livraison.info2Text || "Les commandes sont traitées sous 1 à 2 jours ouvrés après confirmation du paiement."}</p>
                        </div>
                    </div>
                    <div className="livraison-info-card">
                        <span className="livraison-info-icon">❓</span>
                        <div>
                            <strong>{livraison.info3Title || "Un problème de livraison ?"}</strong>
                            <p>{livraison.info3Text || "Contactez notre service client via le formulaire de contact ou à contact@lamarconnete.fr"}</p>
                        </div>
                    </div>
                </motion.div>
            </section>
        </motion.main>
    );
}
