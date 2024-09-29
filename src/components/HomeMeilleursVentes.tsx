import React from 'react';
import { motion } from 'framer-motion';
import { transition1 } from "../transition"
import ProduitsItems from './ProduitsItems';

interface HomeMeilleursVentesProps {
  titre: string;
}

const HomeMeilleursVentes: React.FC<HomeMeilleursVentesProps> = ({ titre }) => {
  return (
    <section className="MeilleurVente">
      <motion.h2
        initial={{ opacity: 0, translateX: "-200px" }}
        transition={transition1}
        whileInView={{ opacity: 1, translateX: "0px" }}
        viewport={{ once: true }}
      >
        {titre}
      </motion.h2>
      <div className="MeilleurVente-container">
        <ProduitsItems
          ImageProduit="LaitToiletteSup.jpeg"
          ImageProduitSup="LaitToilette.jpeg"
          AltText="Lait de toilette"
          to="Boutique/LaitToilette"
          Titre="Lait de toilette visage & corps (500mL)"
          Etoiles="★ ★ ★ ★ ★"
          Prix="19,45€"
        />
        <ProduitsItems
          ImageProduit="GelLavant.jpeg"
          ImageProduitSup="GelLavantSup.jpeg"
          AltText="Gel lavant"
          to="Boutique/GelLavant"
          Titre="Gel lavant corps & cheveux (200mL)"
          Etoiles="★ ★ ★ ★ ★"
          Prix="18,60€"
        />
      </div>
    </section>
  );
};

export default HomeMeilleursVentes;
