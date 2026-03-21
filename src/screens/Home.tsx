import { motion } from 'framer-motion';
import { transition1 } from "../transition"

import { FaTruckFast } from "react-icons/fa6"
import { IoIosMail, } from "react-icons/io"
import { CiCreditCard1 } from "react-icons/ci"
import { IoEarthOutline } from "react-icons/io5"

import HomeMeilleursVentes from '../components/HomeMeilleursVentes';
import { HomeCommentaires } from '../components/Home-Commentaires';
import { Coupon } from '../components/Coupon';
import Bouton from '../components/Bouton';
import { useContent } from '../contexts/ContentContext';

export const Home = () => {
    const content = useContent();
    const home = content.home || {};

    return (
        <main className="Home">

            <section className=''>
                <div className='HomeContainer'>
                    <div className='HomeContainerGauche'>
                        <h1>{home.mainTitle || "Moins c'est mieux !"}</h1>

                        <blockquote className="citation">
                            {home.citation || "A la naissance de ma fille, j'ai été confrontée au marché des cosmétiques bébé, force est de constater que les produits renfermaient trop d'ingrédients, trop du superflu, trop trop de substances inutiles voire nocives. J'ai alors décidé de revenir à l'essentiel en proposant des formules minimalistes qui respectent VRAIMENT la peau de nos bébés parce que MOINS c'est MIEUX !"}
                            <p className='signature'>{home.signature || "Anaïs & Léana"}</p>
                        </blockquote>


                        <div className='Home-Container-Logo1'>
                            <div className='Home-Container-logo-compo'>
                                <img src="images/IconWeb/logo_0_gel_4x-removebg-preview.png" alt="" />
                            </div>
                            <div className='Home-Container-logo-compo'>
                                <img src="images/IconWeb/FabricationFrancaise.png" alt="" />
                            </div>
                            <div className='Home-Container-logo-compo'>
                                <img src="images/IconWeb/cosmebio.png" alt="" />

                            </div>
                            <div className='Home-Container-logo-compo'>
                                <img src="images/IconWeb/cosmocert.png" alt="" />

                            </div>
                        </div>
                    </div>
                    <div className='HomeContainerDroit'>
                        <img src="images/AnaisLeanavP.png" alt="" />
                        {/* <img src="images/AnaisLeanaHistoire.png" alt="" />
                        <img src="images/AnaisLeanaHistoire2.png" alt="" />
                        <img src="images/AnaisLeanaHistoire5.png" alt="" /> */}


                        <Bouton
                            lien='/'
                            NomBtn='Je découvre les produits'
                        />
                    </div>
                </div>
            </section>
            <div className='Presentoire-transition'>
                <img src="images/IconWeb/FontHomeSectionBas.png" alt="" />
            </div>
            <section className='Presentoire'>
                <h1>{home.sectionEngagesTitle || "La marcOnnête s'engage pour des produits :"}</h1>
                <div className='PresentoireContainer'>
                    <img src="images/La_marcOnnete_Homepage_v2.png" alt="" />
                </div>

            </section>
            <div className='Presentoire-transition'>
                <img src="images/IconWeb/FontHomeSectionHaut.png" alt="" />
            </div>

            <HomeMeilleursVentes titre='Meilleurs Ventes' />
            <HomeCommentaires />
            <section>
                <Coupon />
            </section>
            <section>
                <div className='Home-Container-Logo'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} className='Home-Container-logo-compo'>
                        <IoEarthOutline style={{ fontSize: '3.5em', color: "#546863" }} />
                        <h4>{home.badge1Title || "Produits engagés"}</h4>
                        <p>{home.badge1Text || "Vegan et recyclables"}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} className='Home-Container-logo-compo'>
                        <FaTruckFast style={{ fontSize: '3.5em', color: "#546863" }} />
                        <h4>{home.badge2Title || "Livraison rapide"}</h4>
                        <p>{home.badge2Text || "Sous 2 à 5 jours et neutre en carbonne"}</p>
                    </motion.div>
                    <a href="/Contact" className='Home-Container-logo-compo'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={transition1}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }} className='Home-Container-logo-compo'>

                            <IoIosMail style={{ fontSize: '3.5em', color: "#546863" }} />
                            <h4>{home.badge3Title || "Service client"}</h4>
                            <p>{home.badge3Text || "C'est par ici"}</p>

                        </motion.div>      </a>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} className='Home-Container-logo-compo'>
                        <CiCreditCard1 style={{ fontSize: '3.5em', color: "#546863" }} />
                        <h4>{home.badge4Title || "Paiement sécurisé"}</h4>
                        <p>{home.badge4Text || "Par carte bancaire ou Paypal"}</p>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
