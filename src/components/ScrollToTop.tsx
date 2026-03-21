import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function scrollPageToTop(smooth = false) {
    const el = document.scrollingElement || document.documentElement;
    if (smooth) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        el.scrollTop = 0;
        window.scrollTo(0, 0);
    }
}

// Auto-scroll to top on every route change (instant, no animation)
export function ScrollToTopOnNav() {
    const { pathname } = useLocation();
    useEffect(() => {
        scrollPageToTop(false);
    }, [pathname]);
    return null;
}

// Floating scroll-to-top button
export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = document.scrollingElement || document.documentElement;
        const onScroll = () => setVisible((el.scrollTop || window.scrollY) > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    className="scroll-top-btn"
                    onClick={() => scrollPageToTop(true)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Retour en haut"
                >
                    ↑
                </motion.button>
            )}
        </AnimatePresence>
    );
}
