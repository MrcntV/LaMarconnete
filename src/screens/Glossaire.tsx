import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Ingredient {
    nom: string;
    description: string;
}

interface Produit {
    id: string;
    titre: string;
    lien: string;
    ingredients: Ingredient[];
}

const produitsGlossaire: Produit[] = [
    {
        id: 'GEL',
        titre: 'Gel lavant corps & cheveux',
        lien: 'Boutique/GelLavant',
        ingredients: [
            { nom: 'Aqua (eau)', description: "D'origine minérale, je sers de solvant pour dissoudre les actifs de la formule." },
            { nom: 'Caprylyl/capryl glucoside', description: "Tensioactif à base de sucre, je permets de nettoyer en douceur, sans agresser les peaux les plus délicates." },
            { nom: 'Glycerin', description: "D'origine végétale, je sers à hydrater en profondeur et à protéger des agressions extérieures les peaux sensibles des bébés grâce à mon pouvoir occlusif." },
            { nom: 'Bentonite', description: "Argile obtenue à partir de cendres volcaniques, je permets de lier la formule et d'obtenir une texture agréable." },
            { nom: 'Xanthan gum', description: "Gomme obtenue par fermentation d'un sucre, je suis utilisée pour stabiliser la formule et renforcer la texture gel." },
            { nom: 'Acid citric', description: "Principal actif naturellement présent dans le citron, je permets d'équilibrer le pH pour m'ajuster à celui de la peau de bébé." },
            { nom: 'Aloe barbadensis leaf powder', description: "Reconnue depuis des siècles, je sers à maintenir l'hydratation et apaiser en soulageant les irritations." },
            { nom: 'Sodium benzoate & Potassium sorbate', description: "Nous sommes là pour assurer la sécurité du produit et une bonne durée de conservation." },
        ],
    },
    {
        id: 'SOIN',
        titre: 'Soin Hydratant Visage & Corps',
        lien: 'Boutique/SoinHydratant',
        ingredients: [
            { nom: 'Aqua (eau)', description: "D'origine minérale, je sers de solvant pour dissoudre les actifs de la formule." },
            { nom: 'Cococaprylate/caprate', description: "Huile estérifiée, je permets d'adoucir et assouplir la peau." },
            { nom: 'Glycerin', description: "D'origine végétale, je sers à hydrater en profondeur et à protéger des agressions extérieures les peaux sensibles des bébés grâce à mon pouvoir occlusif." },
            { nom: 'Cetearyl alcohol', description: "Alcool gras d'origine naturelle, parfois confondu avec l'alcool asséchant, je permets d'adoucir et protéger la peau sans effet gras." },
            { nom: 'Cetearyl glucoside', description: "Tensioactif non ionique d'origine naturelle, je suis émulsifiant permettant de favoriser les mélanges entre liquides non miscibles." },
            { nom: 'Xanthan gum', description: "Gomme obtenue par fermentation d'un sucre, je suis utilisée pour stabiliser la formule et renforcer la texture gel." },
            { nom: 'Sodium levulinate, Acid levulinic', description: "Nous aidons à la conservation du produit." },
            { nom: 'Acid citric, Sodium hydroxide', description: "Nous permettons de réguler le pH afin de l'ajuster à celui de la peau de bébé." },
            { nom: 'Aloe barbadensis leaf powder', description: "Reconnue depuis des siècles, je sers à maintenir l'hydratation et apaiser en soulageant les irritations." },
            { nom: 'Sodium benzoate', description: "Je suis là pour assurer la sécurité du produit et une bonne durée de conservation." },
        ],
    },
    {
        id: 'EAU',
        titre: 'Eau nettoyante visage et corps',
        lien: 'Boutique/EauNettoyante',
        ingredients: [
            { nom: 'Aqua (eau)', description: "D'origine minérale, je sers de solvant pour dissoudre les actifs de la formule." },
            { nom: 'Caprylyl/capryl glucoside', description: "Tensioactif à base de sucre, je permets de nettoyer en douceur, sans agresser les peaux les plus délicates." },
            { nom: 'Glycerin', description: "D'origine végétale, je sers à hydrater en profondeur et à protéger des agressions extérieures les peaux sensibles des bébés grâce à mon pouvoir occlusif." },
            { nom: 'Sodium levulinate, Acid levulinic', description: "Nous sommes là pour assurer la sécurité du produit et une bonne durée de conservation." },
            { nom: 'Aloe barbadensis leaf powder', description: "Reconnue depuis des siècles, je sers à maintenir l'hydratation et apaiser en soulageant les irritations." },
            { nom: 'Acid citric', description: "Principal actif naturellement présent dans le citron, je permets d'équilibrer le pH pour m'ajuster à celui de la peau de bébé." },
            { nom: 'Sodium benzoate', description: "Je suis là pour assurer la sécurité du produit et une bonne durée de conservation." },
        ],
    },
];

export default function Glossaire() {
    const [activeTab, setActiveTab] = useState('GEL');

    const produit = produitsGlossaire.find(p => p.id === activeTab)!;

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="glossaire-section">
                <h1>Glossaire & Ingrédients</h1>
                <p className="glossaire-intro">
                    Tous les ingrédients de nos produits pour une parfaite transparence.
                    Une question ? Un terme à définir ? <Link to="/Contact">Écrivez-nous !</Link>
                </p>

                {/* Navigation onglets */}
                <div className="glossaire-tabs">
                    {produitsGlossaire.map(p => (
                        <button
                            key={p.id}
                            className={`glossaire-tab ${activeTab === p.id ? 'glossaire-tab-active' : ''}`}
                            onClick={() => setActiveTab(p.id)}
                        >
                            {p.titre}
                        </button>
                    ))}
                </div>

                {/* Contenu */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="glossaire-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="glossaire-product-header">
                            <h2>{produit.titre}</h2>
                            <Link to={`/${produit.lien}`} className="glossaire-product-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                Voir la fiche produit →
                            </Link>
                        </div>

                        <div className="glossaire-table-wrapper">
                            <table className="glossaire-table">
                                <thead>
                                    <tr>
                                        <th>Ingrédient (INCI)</th>
                                        <th>Son rôle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produit.ingredients.map((ing, i) => (
                                        <motion.tr
                                            key={ing.nom}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <td className="glossaire-nom">{ing.nom}</td>
                                            <td className="glossaire-desc">{ing.description}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>
        </motion.main>
    );
}
