import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { produitsData } from '../data/produitsData';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowDown } from "react-icons/io";
import HomeMeilleursVentes from '../components/HomeMeilleursVentes';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProduitDetail = () => {
  const { productId } = useParams(); // Obtient l'ID du produit depuis l'URL

  // Recherche du produit correspondant en fonction de productId
  const produit = produitsData.find((produit) => produit.to === productId);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [infosOpen, setInfosOpen] = useState(false);
  const [caracteristiquesOpen, setCaracteristiquesOpen] = useState(false);
  const [compositionsOpen, setCompositionsOpen] = useState(false);
  const [UtilisationOpen, setUtilisationOpen] = useState(false)

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  const toggleInfos = () => {
    setInfosOpen(!infosOpen);
  };

  const toggleCaracteristiques = () => {
    setCaracteristiquesOpen(!caracteristiquesOpen);
  };

  const toggleCompositions = () => {
    setCompositionsOpen(!compositionsOpen);
  };
  const toggleUtilisation = () => {
    setUtilisationOpen(!UtilisationOpen);
  };


  const [quantite, setQuantite] = useState(1); // État de la quantité

  // Fonction pour incrémenter la quantité
  const incrementQuantite = () => {
    setQuantite(quantite + 1);
  };

  // Fonction pour décrémenter la quantité (minimum 1)
  const decrementQuantite = () => {
    if (quantite > 1) {
      setQuantite(quantite - 1);
    }
  };

  return (
    <main>
      {produit && (
        <div>
          <section className="produit-detail-container">
            <section className="produit-images">
              <div className="produit-supplementaires">
                <Slider
                  className='center'
                  centerPadding='60px'
                  dots={true}
                  dotsClass='slick-dots-test slick-thumb'
                  arrows={false}

                  customPaging={(i) => (
                    <a key={i}>
                      <img
                        src={produit.ImagesSupplementaires[i]}
                        alt={produit.AltText}
                        className="produit-supplementaire-image-puce"
                      />
                    </a>
                  )}

                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  responsive={
                    [{
                      breakpoint: 700,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                      }
                    }]
                  }>

                  {produit.ImagesSupplementaires.map((image, index) => (
                    <div className='produit-supplementaire-image-container' key={index}>
                      <img
                        src={image}
                        alt={produit.AltText}
                        className="produit-supplementaire-image"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </section>
            <section className="produit-info">
              <div className="produit-header">
                <div className="produit-titre-Qte">
                  <h2 className="produit-titre">{produit.Titre}</h2><h6 className="produit-Qte">({produit.Qte})</h6>
                </div>
                <div className="FlexCentre">
                  <p className="produit-etoiles">{produit.Etoiles}</p>
                  <h5 className="produit-prix"> {produit.Prix}</h5>
                </div>
                <p className="produit-description">{produit.Description}</p>
                <div className="LesPlusProduits">
                  <li>✔️{produit.LesPlusProduits}</li>
                  <li>✔️{produit.LesPlusProduits1}</li>
                  <li>✔️{produit.LesPlusProduits2}</li>
                  {/* <li>•{produit.LesPlusProduits3}</li>
                <li>•{produit.LesPlusProduits4}</li> */}
                </div>

                <p>Score Yuka : {produit.ScoreYuka}</p>
                <p>Score INCI Beauty : {produit.ScoreINCIBeauty}</p>
                <div className='Certficat'>
                  {produit.Certificat.map((image, index) => (
                    <div className='produit-supplementaire-image-container' key={index}>
                      <img
                        src={image}
                        alt={produit.AltText}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div>
                    <div className="quantite-select">
                      <label htmlFor="quantite">Quantité :</label>
                      <div className="quantite-controls">
                        <button className="quantite-btn" onClick={decrementQuantite}>-</button>
                        <input type="text" id="quantite" name="quantite" value={quantite} readOnly />
                        <button className="quantite-btn" onClick={incrementQuantite}>+</button>
                      </div>
                    </div>
                    <div className='disponibilite'>
                      <p>En stock</p>
                      <div className='dispo'></div>
                    </div>
                    <div className='ButtonAchat'>
                      <button className="produit-ajouter-panier">Ajouter au panier</button>
                      <button className="produit-ajouter-panier">Acheter en 1 clic</button>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div layout className="faq-item">
                <motion.h4 layout onClick={toggleDetails}>
                  Description{" "}
                  <IoIosArrowDown
                    className={`arrow-icon ${detailsOpen ? "open" : ""}`}
                    style={{ transform: detailsOpen ? "rotate(180deg)" : "" }}
                  />
                </motion.h4>
                <AnimatePresence>
                  {detailsOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="produit-details-text"
                      key="details"
                    >
                      {produit.Details}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div layout className="faq-item">
                <motion.h4 layout onClick={toggleCompositions}>
                  Composition{" "}
                  <IoIosArrowDown
                    className={`arrow-icon ${compositionsOpen ? "open" : ""}`}
                    style={{ transform: compositionsOpen ? "rotate(180deg)" : "" }}
                  />
                </motion.h4>
                <AnimatePresence>
                  {compositionsOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="produit-details-text compositons"
                      key="compositions"
                    >
                      {produit.Compositions} <br />{produit.Compositions1} <br /> {produit.Compositions2}  <br />{produit.Compositions3}
                    </motion.p>


                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div layout className="faq-item">
                <motion.h4 layout onClick={toggleUtilisation}>
                  Conseils d'utilisation{" "}
                  <IoIosArrowDown
                    className={`arrow-icon ${UtilisationOpen ? "open" : ""}`}
                    style={{ transform: UtilisationOpen ? "rotate(180deg)" : "" }}
                  />
                </motion.h4>
                <AnimatePresence>
                  {UtilisationOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="produit-details-text"
                      key="compositions"
                    >
                      {produit.ConseilsUtilisaton}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div layout className="faq-item">
                <motion.h4 layout onClick={toggleInfos}>
                  Infos complementaires{" "}
                  <IoIosArrowDown
                    className={`arrow-icon ${infosOpen ? "open" : ""}`}
                    style={{ transform: infosOpen ? "rotate(180deg)" : "" }}
                  />
                </motion.h4>
                <AnimatePresence>
                  {infosOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="produit-details-text"
                      key="infosComplementaires"
                    >
                      {produit.InfosComplementaires}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>


            </section>

          </section>
          <section>
            <div className='Carte-container'>

              <div className="form__routine">
                <input id="checkbox" name="checkbox" type="checkbox" required />
                <label htmlFor="checkbox">
                  <h6>
                    {produit.RoutineTitre}
                  </h6>
                </label>
              </div>

              <div className='Carte'>
                <div className='Carte-containerTextePrix'>
                  <p>{produit.RoutineTexte}</p>
                  <p>{produit.RoutineTexte1}</p>
                  <p>{produit.RoutineTexte2}</p>
                  <p>{produit.RoutinePrice}</p>
                </div>
                <div className='Carte-containerImage'>
                  <img src={produit.Routine} alt="" />
                </div>
              </div>
            </div>
          </section>
          <section className='VousAdorez'>
            <h2>Vous l'adorez !</h2>
            <Slider
              dots={false}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              responsive={
                [{
                  breakpoint: 700,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                  }
                }]
              }>
              {produit.ImagesUtilisateurs.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={produit.AltText}
                    className="produit-image-utilisateur"
                  />
                </div>
              ))}
            </Slider>
          </section>
        </div >

      )}

      <HomeMeilleursVentes titre='Vous pourriez également aimer' />
    </main >
  );
};

export default ProduitDetail;
