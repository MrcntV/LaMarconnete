import ProduitsItems from "../components/ProduitsItems";
import { motion } from 'framer-motion';
import { transition1 } from "../transition";
import { useEffect, useState } from "react";

export const Boutique = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then((data: any[]) => {
                const active = data.filter(p => p.active !== false);
                setProducts(active);
            })
            .catch(() => {});
    }, []);

    return (
        <motion.main>
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
                            <p>Découvrez les 4 indispensables bébés et enfants à travers une gamme :</p>
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
                    {products.map((produit) => (
                        <ProduitsItems
                            key={produit.to || produit.id}
                            ImageProduit={produit.ImageProduit}
                            ImageProduitSup={produit.ImageProduitSup}
                            AltText={produit.AltText}
                            to={produit.to}
                            Titre={produit.Titre}
                            Etoiles={produit.Etoiles ?? ""}
                            Prix={String(produit.Prix)}
                            enStock={produit.enStock && produit.stock > 0}
                        />
                    ))}
                </div>
            </section>
        </motion.main>
    );
};
