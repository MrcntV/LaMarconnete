import { motion } from 'framer-motion';

export default function CGV() {
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="legal-section">
                <h1>Conditions Générales de Vente</h1>
                <p className="legal-date">En vigueur au 01/01/2024</p>
                <div className="legal-content">

                    <div className="legal-block">
                        <h3>Article 1 – Champ d'application</h3>
                        <p>Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les ventes de produits effectuées par La marcOnnête (SASU au capital de 1 000 €, SIRET 898 414 594 00025) via le site internet lamarconnete.fr, auprès de tout consommateur (ci-après « le Client »).</p>
                        <p>Le Client déclare avoir pris connaissance des présentes CGV et les accepter avant de procéder à tout achat. Ces CGV prévalent sur tout autre document.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 2 – Produits</h3>
                        <p>Les produits proposés à la vente sont ceux présentés sur le site lamarconnete.fr au moment de la consultation par le Client. Les photographies et descriptions des produits sont présentées à titre indicatif. La marcOnnête s'engage à présenter les produits avec la plus grande exactitude possible.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 3 – Prix</h3>
                        <p>Les prix sont indiqués en euros toutes taxes comprises (TTC). La marcOnnête se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix facturé sera celui en vigueur au moment de la validation de la commande.</p>
                        <p>Les frais de livraison sont indiqués séparément avant la validation définitive de la commande.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 4 – Commande</h3>
                        <p>Le Client passe commande en ligne depuis le site lamarconnete.fr. La commande n'est définitive qu'après validation du paiement. Un email de confirmation est envoyé au Client dès réception du paiement.</p>
                        <p>La marcOnnête se réserve le droit d'annuler toute commande en cas d'indisponibilité du produit, d'un problème avec la commande reçue, ou d'un litige existant avec le Client.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 5 – Paiement</h3>
                        <p>Le paiement s'effectue en ligne par carte bancaire (Visa, MasterCard) ou tout autre moyen de paiement proposé sur le site. Le paiement est sécurisé par cryptage SSL. La marcOnnête ne stocke aucune donnée bancaire.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 6 – Livraison</h3>
                        <p>Les produits sont livrés à l'adresse indiquée par le Client lors de sa commande. Les délais de livraison sont indiqués à titre indicatif. En cas de retard, La marcOnnête ne pourra être tenue responsable.</p>
                        <p>Pour plus d'informations sur les modalités de livraison, consultez notre <a href="/Livraison">page Livraison</a>.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 7 – Transfert de propriété et des risques</h3>
                        <p>La propriété des produits vendus est transférée au Client au moment du paiement intégral du prix. Le transfert des risques intervient au moment de la livraison des produits.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 8 – Droit de rétractation</h3>
                        <p>Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
                        <p>Le Client doit notifier sa décision de rétractation par email à <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a> avant l'expiration du délai. Les produits doivent être retournés en parfait état, dans leur emballage d'origine.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 9 – Retours et remboursements</h3>
                        <p>En cas de rétractation, La marcOnnête remboursera le Client de la totalité des sommes versées, y compris les frais de livraison initiaux, dans un délai de 14 jours à compter de la réception des produits retournés.</p>
                        <p>Les frais de retour sont à la charge du Client, sauf si le produit est défectueux ou ne correspond pas à la commande.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 10 – Garanties</h3>
                        <p>Les produits vendus bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 11 – Responsabilité</h3>
                        <p>La marcOnnête ne peut être tenue responsable des dommages indirects causés par l'utilisation de ses produits. La responsabilité de La marcOnnête est limitée au montant de la commande passée par le Client.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 12 – Données personnelles</h3>
                        <p>Les données collectées lors de la commande sont nécessaires à son traitement. Elles peuvent être transmises aux prestataires de services intervenants dans le cadre de l'exécution de la commande. Conformément au RGPD, le Client dispose d'un droit d'accès, de rectification et de suppression de ses données en contactant <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a>.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 13 – Propriété intellectuelle</h3>
                        <p>Tout le contenu du site lamarconnete.fr est la propriété de La marcOnnête et est protégé par le droit d'auteur. Toute reproduction totale ou partielle est strictement interdite sans accord préalable écrit.</p>
                    </div>

                    <div className="legal-block">
                        <h3>Article 14 – Litiges et droit applicable</h3>
                        <p>Les présentes CGV sont soumises au droit français. En cas de litige, le Client peut recourir à une médiation conventionnelle ou à tout autre mode alternatif de règlement des différends. À défaut, les tribunaux français seront seuls compétents.</p>
                        <p>Pour tout réclamation, le Client peut contacter La marcOnnête à : <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a></p>
                    </div>

                </div>
            </section>
        </motion.main>
    );
}
