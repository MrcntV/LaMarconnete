import { motion } from 'framer-motion';

const timelineData = [
    { id: 1, title: "Oct. 2019", description: "Doctorat de chimie" },
    { id: 2, title: "Nov. 2019", description: "Naissance de Léana" },
    { id: 3, title: "Mai 2021", description: "Naissance de La marcOnnête" },
    { id: 4, title: "Sept. 2021", description: "1ers produits en vente, magasins BIO & particuliers" },
    { id: 5, title: "Oct. 2021", description: "1ère vente en pharmacie" },
    { id: 6, title: "Jan. 2023", description: "4ème produit : eau nettoyante visage & corps" },
    { id: 7, title: "Mars 2023", description: "1ère vente en maternité" },
    { id: 8, title: "Avr. 2023", description: "1ère vente en crèche" },
];

export default function MyTimelinetest() {
    return (
        <div className="htl-wrapper">
            {/* Ligne horizontale */}
            <div className="htl-line" />

            {timelineData.map((item, i) => {
                const isAbove = i % 2 === 0;
                return (
                    <motion.div
                        key={item.id}
                        className={`htl-item ${isAbove ? 'htl-above' : 'htl-below'}`}
                        initial={{ opacity: 0, y: isAbove ? -20 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                        {isAbove && (
                            <div className="htl-text htl-text-above">
                                <strong className="htl-date">{item.title}</strong>
                                <p className="htl-desc">{item.description}</p>
                            </div>
                        )}
                        <div className="htl-dot">
                            <img
                                src={`images/Timeline/${item.id}.jpg`}
                                alt={item.title}
                                className="htl-img"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        {!isAbove && (
                            <div className="htl-text htl-text-below">
                                <strong className="htl-date">{item.title}</strong>
                                <p className="htl-desc">{item.description}</p>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
