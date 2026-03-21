import { motion } from 'framer-motion';

export default function MentionsLegales() {
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="legal-section">
                <h1>Mentions Légales</h1>
                <div className="legal-content">

                    <div className="legal-block">
                        <h3>1. Éditeur du site</h3>
                        <p><strong>Raison sociale :</strong> La marcOnnête</p>
                        <p><strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)</p>
                        <p><strong>Capital social :</strong> 1 000 €</p>
                        <p><strong>SIRET :</strong> 898 414 594 00025</p>
                        <p><strong>Numéro de TVA intracommunautaire :</strong> FR48898414594</p>
                        <p><strong>Email :</strong> <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a></p>
                    </div>

                    <div className="legal-block">
                        <h3>2. Directrice de la publication</h3>
                        <p>La directrice de la publication est la Présidente de La marcOnnête.</p>
                    </div>

                    <div className="legal-block">
                        <h3>3. Hébergement</h3>
                        <p><strong>Hébergeur :</strong> OVH SAS</p>
                        <p><strong>Adresse :</strong> 2 rue Kellermann – 59100 Roubaix – France</p>
                        <p><strong>Site :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">www.ovhcloud.com</a></p>
                    </div>

                    <div className="legal-block">
                        <h3>4. Propriété intellectuelle</h3>
                        <p>L'ensemble des éléments constituant le site lamarconnete.fr (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de La marcOnnête ou de ses partenaires. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans l'autorisation écrite préalable de La marcOnnête.</p>
                    </div>

                    <div className="legal-block">
                        <h3>5. Données personnelles</h3>
                        <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@lamarconnete.fr">contact@lamarconnete.fr</a>.</p>
                        <p>Pour en savoir plus sur la gestion de vos données, consultez notre <a href="/Politique-confidentialite">Politique de confidentialité</a>.</p>
                    </div>

                    <div className="legal-block">
                        <h3>6. Cookies</h3>
                        <p>Le site lamarconnete.fr peut utiliser des cookies afin d'améliorer l'expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti lorsqu'un cookie est envoyé.</p>
                    </div>

                    <div className="legal-block">
                        <h3>7. Liens hypertextes</h3>
                        <p>Le site lamarconnete.fr peut contenir des liens vers d'autres sites. La marcOnnête n'est pas responsable du contenu de ces sites externes et ne peut être tenue pour responsable des dommages résultant de leur utilisation.</p>
                    </div>

                    <div className="legal-block">
                        <h3>8. Droit applicable</h3>
                        <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
                    </div>

                </div>
            </section>
        </motion.main>
    );
}
