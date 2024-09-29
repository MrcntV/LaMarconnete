import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transition1 } from '../transition';

type ProduitsItemsProps = {
  ImageProduit: string;
  ImageProduitSup: string;
  AltText: string;
  to: string;
  Titre: string;
  Etoiles: string;
  Prix: string;
};

const ProduitsItems: React.FC<ProduitsItemsProps> = ({
  ImageProduit,
  ImageProduitSup,
  AltText,
  Titre,
  Etoiles,
  Prix,
  to,
}) => {
  const imagePath = process.env.PUBLIC_URL + '/images/Produits/Fiche/' + ImageProduit;
  const imagePathSup = process.env.PUBLIC_URL + '/images/Produits/Fiche/' + ImageProduitSup;

  const handleItemClick = () => {
    // Fonction pour faire défiler la page vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      transition={transition1}
      whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
      viewport={{ once: true }}
      className="Carte-Produits-Items"
    >
      <Link
        className="Carte-Produits-Items-haut"
        to={to}
        onClick={handleItemClick} // Appel de la fonction pour faire défiler vers le haut
      >
        <img className="Carte-Produits-Items-haut-img" src={imagePath} alt={AltText} />
        <img className="Carte-Produits-Items-haut-img-supperpose" src={imagePathSup} alt={AltText} />
      </Link>
      <div className="Carte-Produits-Items-bas">
        <Link to={to}>
          <h6>{Titre}</h6>
        </Link>
        <p>{Etoiles}</p>
        <p>{Prix}</p>
        <Link to={to}>
          <button className="Panier">Ajouter au panier</button>
        </Link>
        <button className="Favori">Ajouter aux favoris</button>
      </div>
    </motion.div>
  );
};

export default ProduitsItems;
