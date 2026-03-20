import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CallToAction() {
    return (
        <motion.div
            className="cta-banner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="cta-content">
                <h3 className="cta-title">Prête à offrir le meilleur à votre bébé ?</h3>
                <p className="cta-subtitle">Des formules bio, sans parfum, fabriquées en France — dès la naissance.</p>
            </div>
            <Link to="/produits" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <button className="cta-btn">Découvrir nos produits</button>
            </Link>
        </motion.div>
    );
}
