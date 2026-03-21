import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { appRoutes } from '../data/routes';

const categories = appRoutes
    .filter(r => r.showInSitemap)
    .map(r => r.category)
    .filter((cat, i, arr) => arr.indexOf(cat) === i);

export default function PlanDuSite() {
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section className="sitemap-section">
                <h1>Plan du site</h1>
                <p className="sitemap-intro">Retrouvez toutes les pages du site en un coup d'œil.</p>
                <div className="sitemap-grid">
                    {categories.map((cat, ci) => (
                        <motion.div
                            key={cat}
                            className="sitemap-category"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ci * 0.1 }}
                        >
                            <h3 className="sitemap-cat-title">{cat}</h3>
                            <ul className="sitemap-list">
                                {appRoutes
                                    .filter(r => r.category === cat && r.showInSitemap)
                                    .map(r => (
                                        <li key={r.path}>
                                            <Link
                                                to={r.path}
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            >
                                                {r.label}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.main>
    );
}
