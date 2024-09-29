import ProduitsItems from "../components/ProduitsItems";
import { motion } from 'framer-motion';
import { produitsData } from '../data/produitsData';
import { accessoiresData } from '../data/accesoiresData';

import { transition1 } from "../transition";



export const Boutique = () => {
    return (
        <motion.main >
            <section>

                <div className="Container-column">

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                        viewport={{ once: true }}
                        className="column">
                        <div className="inner-column">
                            <motion.h1
                                initial={{ opacity: 0, scale: 0 }}
                                transition={transition1}
                                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                                viewport={{ once: true }}>
                                Boutique
                            </motion.h1>
                            <p>Découvrez les 4 indispensables bébés et enfantsà travers une gamme :</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                        viewport={{ once: true }}
                        className="column">
                        <img src="/images/Produits/Illustration_elephant_tableau_V2.png" alt="" />
                    </motion.div>

                </div>
            </section>
            <section>
                <motion.h2
                    initial={{ opacity: 0, scale: 0 }}
                    transition={transition1}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                    viewport={{ once: true }}>Nos Produits
                </motion.h2>

                <div className="NosProduits">
                    {produitsData.map((produit) => (
                        <ProduitsItems
                            key={produit.to}
                            ImageProduit={produit.ImageProduit}
                            ImageProduitSup={produit.ImageProduitSup}
                            AltText={produit.AltText}
                            to={produit.to}
                            Titre={produit.Titre}
                            Etoiles={produit.Etoiles}
                            Prix={produit.Prix}
                        />
                    ))}
                </div>
            </section>

            <section>
                <motion.h2
                    initial={{ opacity: 0, scale: 0 }}
                    transition={transition1}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                    viewport={{ once: true }}>Nos Accessoires
                </motion.h2>
                <div className="NosAccessoires">
                    {accessoiresData.map((accessoire) => (
                        <ProduitsItems
                            key={accessoire.to}
                            ImageProduit={accessoire.ImageProduit}
                            ImageProduitSup={accessoire.ImageProduitSup}
                            AltText={accessoire.AltText}
                            to={accessoire.to}
                            Titre={accessoire.Titre}
                            Etoiles={accessoire.Etoiles}
                            Prix={accessoire.Prix}
                        />
                    ))}
                </div>

            </section>
        </motion.main >
    );
};
