import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DevenirPartenaire() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/Contact', { replace: true });
    }, [navigate]);

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <section>
                <p>Redirection en cours…</p>
            </section>
        </motion.main>
    );
}
