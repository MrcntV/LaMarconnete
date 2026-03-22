import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const STORAGE_KEY = 'marconnete_popup_seen';

const WelcomePopup: React.FC = () => {
  const content = useContent();
  const popup = content.welcomePopup;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popup?.active) return;
    // Reset daily or per-session based on setting
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    const frequency = popup.frequency || 'once'; // 'once' | 'daily' | 'always'
    let shouldShow = false;
    if (frequency === 'always') {
      shouldShow = true;
    } else if (frequency === 'daily') {
      const today = new Date().toDateString();
      shouldShow = lastSeen !== today;
    } else {
      shouldShow = !lastSeen;
    }

    if (shouldShow) {
      const delay = parseInt(popup.delayMs) || 1500;
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const close = () => {
    setVisible(false);
    const freq = popup?.frequency || 'once';
    localStorage.setItem(STORAGE_KEY, freq === 'daily' ? new Date().toDateString() : 'true');
  };

  if (!popup?.active || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="popup-box"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="popup-close" onClick={close} aria-label="Fermer">✕</button>

            {popup.image && (
              <div className="popup-image-container">
                <img src={popup.image} alt={popup.titre || ''} className="popup-image" />
              </div>
            )}

            {popup.titre && <h2 className="popup-titre">{popup.titre}</h2>}
            {popup.texte && <p className="popup-texte">{popup.texte}</p>}

            {popup.promoCode && (
              <div className="popup-promo">
                <span className="popup-promo-label">Code promo :</span>
                <span className="popup-promo-code">{popup.promoCode}</span>
              </div>
            )}

            {popup.ctaLabel && popup.ctaUrl && (
              <a href={popup.ctaUrl} className="popup-cta" onClick={close}>
                {popup.ctaLabel}
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
