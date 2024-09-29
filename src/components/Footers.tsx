import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"
import CarrouselAuto from "./CarrouselAuto";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


export const Footers = () => {
    const [isProduitsMenuOpen, setIsProduitsMenuOpen] = useState(false);
    const [isMarconnenteMenuOpen, setIsMarconnenteMenuOpen] = useState(false);
    const [isAideMenuOpen, setIsAideMenuOpen] = useState(false);


    // Utilisez useEffect pour détecter la taille de l'écran au chargement de la page
    useEffect(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 768) {
            // Écran large, ouvrez les menus par défaut
            setIsProduitsMenuOpen(true);
            setIsMarconnenteMenuOpen(true);
            setIsAideMenuOpen(true);
        }
        if (screenWidth < 768) {
            // Écran large, ouvrez les menus par défaut
            setIsProduitsMenuOpen(false);
            setIsMarconnenteMenuOpen(false);
            setIsAideMenuOpen(false);
        }
    }, []);

    const toggleProduitsMenu = () => {
        setIsProduitsMenuOpen(!isProduitsMenuOpen);
    };

    const toggleMarconnenteMenu = () => {
        setIsMarconnenteMenuOpen(!isMarconnenteMenuOpen);
    };

    const toggleAideMenu = () => {
        setIsAideMenuOpen(!isAideMenuOpen);
    };
    return (
        <footer>
            <div className="Footer-section">
                <div className="Footer-Top">
                    <h2>Suivez-nous sur instagram !</h2>
                    <p>
                        <a href="https://www.instagram.com/lamarconnete/">@lamarconnete</a>
                    </p>
                </div>
                <div className="Footer-Bottom-image">
                    <CarrouselAuto />
                    <div className="Footer-Bottom">
                        <div className="Footer-Bottom-gauche">
                            <h5 onClick={toggleProduitsMenu}>
                                <IoIosArrowDown className={`arrow ${isProduitsMenuOpen ? "rotate-arrow" : ""}`} />
                                PRODUITS</h5>
                            <AnimatePresence>
                                {isProduitsMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }} >
                                        <ul>
                                            <li>
                                                <a href="/Boutique">Hygiène</a>
                                            </li>
                                            <li>
                                                <a href="/Boutique">Soin</a>
                                            </li>
                                            <li>
                                                <a href="/Boutique">Accessoires</a>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="Footer-Bottom-mid">
                            <h5 onClick={toggleMarconnenteMenu}>
                                <IoIosArrowDown className={`arrow ${isMarconnenteMenuOpen ? "rotate-arrow" : ""}`} /> LA MARCONNETE</h5>
                            <AnimatePresence>
                                {isMarconnenteMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }} >
                                        <ul>
                                            <li>
                                                <a href="/MonHistoire">Histoire</a>
                                            </li>
                                            <li>
                                                <a href="/NewsLetter">S’abonner</a>
                                            </li>
                                            <li>
                                                <a href="/Parrainage">Parrainage</a>
                                            </li>
                                            <li>
                                                <a href="">Partenaires</a>
                                            </li>
                                            <li>
                                                <a href="">Devenir partenaire</a>
                                            </li>
                                            <li>
                                                <a href="">Recrutement</a>
                                            </li>
                                            <li>
                                                <a href="">CGV</a>
                                            </li>
                                            <li>
                                                <a href="">Politique de confidentialité</a>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="Footer-Bottom-droite">

                            <h5 onClick={toggleAideMenu}>
                                <IoIosArrowDown className={`arrow ${isAideMenuOpen ? "rotate-arrow" : ""}`} />AIDE
                            </h5>

                            <AnimatePresence>
                                {isAideMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ul>
                                            <li><a href="/Contact">Contact</a></li>
                                            <li> <NavLink to='/FAQ'>Questions Fréquentes</NavLink></li>
                                            <li><a href="">Livraison</a></li>
                                            <li><a href="">Plan du site</a></li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="Footer-Bottom-coupon">
                            <h5>-10% reduction de réduction <br /> sur votre première commande </h5>
                            <p>Abonnez-vous à la newsletter et soyez au <br />courant des nouveautés recevez des conseils et des offres</p>
                            <input type="email" placeholder="Email" />
                            <p> <input type="checkbox" /> J'accepte la <a href="/Politique-confidentialite">politique de confidentialité</a></p>
                            <button>Je m'inscris</button>
                        </div>
                    </div>


                    <div className="Footer-Bottom-Reseaux">
                        <FaFacebook style={{ fontSize: '2em', color: "#546863" }} />
                        <FaInstagram style={{ fontSize: '2em', color: "#546863" }} />
                        <FaLinkedin style={{ fontSize: '2em', color: "#546863" }} />
                    </div>
                    <div className="Signature">
                        <p>Mentions légales © 2023 La marcOnnête – Tous droits réservés</p>
                    </div>
                </div>
            </div>
        </footer >

    )
}
