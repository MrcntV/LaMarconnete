import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowDown } from "react-icons/io";
import HomeMeilleursVentes from '../components/HomeMeilleursVentes';
import { useCart } from '../contexts/CartContext';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TAILLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const estimerDelai = (poids: number): string => {
  if (!poids || poids <= 0) return 'Livraison Colissimo 2-3 jours ouvrés';
  if (poids <= 500) return 'Livraison Colissimo 2-3 jours ouvrés (petit colis ≤ 500g)';
  if (poids <= 2000) return 'Livraison Colissimo 2-3 jours ouvrés (colis ≤ 2 kg)';
  return 'Livraison Colissimo 2-3 jours ouvrés (colis > 2 kg)';
};

const ProduitDetail = () => {
  const { productId } = useParams();
  const { addItem, totalItems } = useCart();

  const [produit, setProduit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [infosOpen, setInfosOpen] = useState(false);
  const [compositionsOpen, setCompositionsOpen] = useState(false);
  const [UtilisationOpen, setUtilisationOpen] = useState(false);

  const toggleDetails = () => setDetailsOpen(!detailsOpen);
  const toggleInfos = () => setInfosOpen(!infosOpen);
  const toggleCompositions = () => setCompositionsOpen(!compositionsOpen);
  const toggleUtilisation = () => setUtilisationOpen(!UtilisationOpen);

  const [quantite, setQuantite] = useState(1);
  const incrementQuantite = () => setQuantite(q => q + 1);
  const decrementQuantite = () => setQuantite(q => Math.max(1, q - 1));

  const [couleur, setCouleur] = useState('');
  const [taille, setTaille] = useState('');
  const [ajoutConfirm, setAjoutConfirm] = useState(false);
  const [erreurVariant, setErreurVariant] = useState('');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products?to=${encodeURIComponent(productId)}`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (data && data.length > 0) setProduit(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleAjouterPanier = () => {
    if (!produit) return;
    if (produit.besoinChoixCouleur && !couleur) {
      setErreurVariant('Veuillez choisir une couleur.');
      return;
    }
    if (produit.besoinChoixTaille && !taille) {
      setErreurVariant('Veuillez choisir une taille.');
      return;
    }
    setErreurVariant('');
    addItem({
      id: produit._id || produit.id || produit.to || produit.Titre,
      titre: produit.Titre,
      prix: produit.Prix,
      image: produit.ImageProduit || (produit.ImagesSupplementaires?.[0] ?? ''),
      quantite,
      couleur: couleur || undefined,
      taille: taille || undefined,
      reference: produit.reference,
    });
    setAjoutConfirm(true);
    setTimeout(() => setAjoutConfirm(false), 2500);
  };

  const handleAchat1Clic = () => {
    handleAjouterPanier();
    // TODO: redirect to checkout
  };

  if (loading) return <main><p style={{ textAlign: 'center', padding: '4rem' }}>Chargement...</p></main>;

  const enStock = produit?.enStock !== false && (produit?.stock == null || produit?.stock > 0);
  const couleurs: string[] = produit?.OptionsCouleur
    ? (Array.isArray(produit.OptionsCouleur) ? produit.OptionsCouleur : produit.OptionsCouleur.split(',').map((c: string) => c.trim()).filter(Boolean))
    : [];

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
                        src={(produit.ImagesSupplementaires ?? [])[i]}
                        alt={produit.AltText}
                        className="produit-supplementaire-image-puce"
                      />
                    </a>
                  )}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  responsive={[{
                    breakpoint: 700,
                    settings: { slidesToShow: 1, slidesToScroll: 1, dots: true }
                  }]}>
                  {(produit.ImagesSupplementaires ?? []).map((image: string, index: number) => (
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
                  <h2 className="produit-titre">{produit.Titre}</h2>
                  <h6 className="produit-Qte">({produit.Qte})</h6>
                </div>
                <div className="FlexCentre">
                  <p className="produit-etoiles">{produit.Etoiles}</p>
                  <h5 className="produit-prix">
                    {produit.PrixBarre && (
                      <span className="produit-prix-barre">{Number(produit.PrixBarre).toFixed(2)} €</span>
                    )}
                    {Number(produit.Prix).toFixed(2)} €
                  </h5>
                </div>
                <p className="produit-description">{produit.Description}</p>
                <div className="LesPlusProduits">
                  {produit.LesPlusProduits && <li>✔️{produit.LesPlusProduits}</li>}
                  {produit.LesPlusProduits1 && <li>✔️{produit.LesPlusProduits1}</li>}
                  {produit.LesPlusProduits2 && <li>✔️{produit.LesPlusProduits2}</li>}
                  {produit.LesPlusProduits3 && <li>✔️{produit.LesPlusProduits3}</li>}
                  {produit.LesPlusProduits4 && <li>✔️{produit.LesPlusProduits4}</li>}
                </div>

                {produit.ScoreYuka != null && <p>Score Yuka : {produit.ScoreYuka}</p>}
                {produit.ScoreINCIBeauty != null && <p>Score INCI Beauty : {produit.ScoreINCIBeauty}</p>}
                <div className='Certficat'>
                  {(produit.Certificat ?? []).map((image: string, index: number) => (
                    <div className='produit-supplementaire-image-container' key={index}>
                      <img src={image} alt={produit.AltText} />
                    </div>
                  ))}
                </div>

                {/* Choix couleur */}
                {produit.besoinChoixCouleur && couleurs.length > 0 && (
                  <div className="variant-select">
                    <label className="variant-label">Couleur :</label>
                    <div className="variant-options">
                      {couleurs.map((c: string) => (
                        <button
                          key={c}
                          type="button"
                          className={`variant-btn${couleur === c ? ' selected' : ''}`}
                          onClick={() => setCouleur(c)}
                        >{c}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choix taille */}
                {produit.besoinChoixTaille && (
                  <div className="variant-select">
                    <label className="variant-label">Taille :</label>
                    <div className="variant-options">
                      {TAILLES.map(t => (
                        <button
                          key={t}
                          type="button"
                          className={`variant-btn${taille === t ? ' selected' : ''}`}
                          onClick={() => setTaille(t)}
                        >{t}</button>
                      ))}
                    </div>
                  </div>
                )}

                {erreurVariant && <p className="variant-erreur">{erreurVariant}</p>}

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
                    <p style={{ color: enStock ? '#16a34a' : '#dc2626' }}>
                      {enStock ? 'En stock' : 'Rupture de stock'}
                    </p>
                    <div className='dispo' style={{ background: enStock ? '#16a34a' : '#dc2626' }}></div>
                  </div>

                  {ajoutConfirm && (
                    <div className="ajout-confirm">
                      ✓ Ajouté au panier ({totalItems} article{totalItems > 1 ? 's' : ''})
                    </div>
                  )}

                  <div className='ButtonAchat'>
                    <button
                      className="produit-ajouter-panier"
                      onClick={handleAjouterPanier}
                      disabled={!enStock}
                    >
                      {produit.TexteBouton || 'Ajouter au panier'}
                    </button>
                    <button
                      className="produit-ajouter-panier"
                      onClick={handleAchat1Clic}
                      disabled={!enStock}
                    >
                      Acheter en 1 clic
                    </button>
                  </div>

                  {/* Livraison */}
                  <div className="produit-livraison">
                    <p className="produit-livraison-titre">🚚 Livraison</p>
                    <p>{estimerDelai(produit.poids)}</p>
                    {produit.poids > 0 && (
                      <p className="produit-livraison-poids">Poids : {produit.poids < 1000 ? `${produit.poids} g` : `${(produit.poids / 1000).toFixed(2)} kg`}</p>
                    )}
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
                      {produit.Description2 || produit.Details}
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
                      key="utilisation"
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
                  <h6>{produit.RoutineTitre}</h6>
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
              responsive={[{
                breakpoint: 700,
                settings: { slidesToShow: 1, slidesToScroll: 1, dots: false }
              }]}>
              {(produit.ImagesUtilisateurs ?? []).map((image: string, index: number) => (
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
        </div>
      )}

      <HomeMeilleursVentes titre='Vous pourriez également aimer' />
    </main>
  );
};

export default ProduitDetail;
