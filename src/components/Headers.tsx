import { FaQuestion } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"
import { IoIosMail } from "react-icons/io"
import { FaUserFriends } from "react-icons/fa"

import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion';


export const Headers: React.FC = () => {
  const [scrollingUp, setScrollingUp] = useState(true);
  const headersNavBasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setScrollingUp(false);
      } else {
        setScrollingUp(true);
      }
    };

    const handleMouseEnter = () => {
      if (!scrollingUp) {

      }
    };

    window.addEventListener('scroll', handleScroll);

    if (headersNavBasRef.current) {
      headersNavBasRef.current.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (headersNavBasRef.current) {
        headersNavBasRef.current.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }


  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}>
      <div className="Headers-Nav">
        <div className={`Headers-Nav-haut ${scrollingUp ? 'scrolling-up' : 'scrolling-down'}`}>

          <div className="Headers-Nav-Gauche">
            <div className='Headers-Nav-haut-gauche'>
              <NavLink to="/NewsLetter">
                <button className='custom-btn'>
                  <span><IoIosMail style={{ fontSize: '1.5em' }} /><p>-10% offerts</p> </span>
                </button>
              </NavLink>
              <NavLink to="/Parrainage">
                <button className='custom-btn'>
                  <span><FaUserFriends style={{ fontSize: '1.5em' }} /><p>Parrainage</p>  </span>
                </button>
              </NavLink>
            </div>
          </div>

          <div className="Headers-Nav-Centre">
            <a className='Headers-Nav-haut-mid' href="/"><img src="/images/Logo/Fichier étiquette.png" alt="Logo la MarcOnnête" /></a>
          </div>
          <div className={`Headers-Nav-haut ${scrollingUp ? 'scrolling-up' : 'scrolling-down'}`}>
            <div className="Headers-Nav-Droite">
              <div className='Headers-Nav-haut-droite'>
                <div className='icon'><NavLink to='/FAQ'><FaQuestion style={{ fontSize: '1.2em', color: "#a6b4aa" }} /></NavLink></div>
                <div className='icon'><a href="https://lamarconnete.fr/mon-compte/"><FaUserAlt style={{ fontSize: '1.2em', color: "#a6b4aa" }} /></a></div>
                <div className='icon'><FaCartShopping style={{ fontSize: '1.2em', color: "#a6b4aa" }} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`Headers-Nav-bas ${scrollingUp ? 'scrolling-up' : 'scrolling-down'}`}>
          <nav>
            <NavLink to='/Boutique' onClick={scrollToTop} >BOUTIQUE</NavLink>
            <NavLink to='/MonHistoire' onClick={scrollToTop} > HISTOIRE</NavLink>
            <NavLink to='/MesEngagements' onClick={scrollToTop} >ENGAGEMENTS</NavLink>
            <NavLink to='/NousTrouver' onClick={scrollToTop} >OU TROUVER <br />LES PRODUITS ?</NavLink>
          </nav>
        </div>

      </div>
    </motion.header >
  )
}

export default Headers;