import { motion } from 'framer-motion';

const engagements = [
    {
        icon: '✨',
        titre: 'La simplicité',
        texte: "Nous sommes convaincus que les produits les plus simples sont bien souvent les meilleurs ! C'est pourquoi nous allons à l'essentiel en proposant des produits formulés avec un minimum d'ingrédients vraiment essentiels.",
    },
    {
        icon: '🚫',
        titre: 'Le sans parfum',
        texte: "Tous les parfums sont bannis de nos produits car il s'agit de la première cause de réactions allergiques ! Les huiles essentielles, qui sont également des cocktails d'allergènes, sont aussi exclues des formules afin d'éviter d'éventuelles irritations ou autres réactions cutanées.",
    },
    {
        icon: '🌿',
        titre: 'La bio',
        texte: "Toute notre gamme est certifiée BIO par COSMECERT. Nous allons au-delà des exigences de la charte COSMEBIO avec un minimum de 98,9% d'ingrédients d'origine naturelle. Plus qu'une simple certification, c'est une véritable philosophie.",
    },
    {
        icon: '⭐',
        titre: 'La qualité',
        texte: "Les substances controversées (phénoxyéthanol, parabènes, BHT, perturbateurs endocriniens…) et les composés irritants sont exclus des formules. Nos produits d'hygiène renferment un tensioactif non-ionique doux à base de sucre afin de nettoyer en délicatesse, sans agresser. Tous nos produits font l'objet de nombreux tests garantissant une haute tolérance pour être utilisés en toute sécurité dès la naissance.",
    },
    {
        icon: '♻️',
        titre: 'Le respect de l\'environnement',
        texte: "Les procédés de fabrication nocifs pour l'Homme ou l'environnement sont bannis et les ingrédients naturels et biodégradables privilégiés. Nos produits sont dépourvus de sur-emballages et leur conditionnement est 100% recyclable et garanti sans bisphénol A. Tous nos supports de communication sont certifiés FSC, PEFC voire Imprim'vert.",
    },
    {
        icon: '🇫🇷',
        titre: 'La fabrication française',
        texte: "Nous sommes fiers de valoriser notre savoir-faire français en proposant des produits de haute qualité. Ce choix nous permet également de soutenir l'économie de notre beau pays et de limiter notre empreinte carbone en favorisant les circuits courts !",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1 },
    }),
};

const MesEngagements = () => {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <section className="engagements-hero">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Mes Engagements
                </motion.h1>
                <motion.p
                    className="engagements-intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Chez La marcOnnête, nous croyons en la puissance des actions concrètes et responsables.
                    Prendre des engagements, ce n'est pas simplement parler, c'est avant tout agir !
                    À travers chacune de ses actions, La marcOnnête s'engage pour le bien-être de vos tout-petits
                    et de notre planète en proposant une gamme spécialement conçue pour la préservation des peaux
                    comme de l'environnement.
                </motion.p>
            </section>

            <section className="engagements-grid-section">
                <div className="engagements-grid">
                    {engagements.map((eng, i) => (
                        <motion.div
                            key={eng.titre}
                            className="engagement-card"
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <span className="engagement-icon">{eng.icon}</span>
                            <h3 className="engagement-titre">{eng.titre}</h3>
                            <p className="engagement-texte">{eng.texte}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.main>
    );
};

export default MesEngagements;
