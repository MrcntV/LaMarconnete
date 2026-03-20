import { motion } from 'framer-motion';

const timelineData = [
    { id: 1, title: "Octobre 2019", description: "Obtention de mon doctorat de chimie" },
    { id: 2, title: "Novembre 2019", description: "Naissance de ma petite merveille Léana" },
    { id: 3, title: "Mai 2021", description: "Naissance de La marcOnnête" },
    { id: 4, title: "Septembre 2021", description: "Mise sur le marché des 3 premiers produits, première vente en magasin BIO et aux particuliers" },
    { id: 5, title: "Octobre 2021", description: "1ère vente en pharmacie" },
    { id: 6, title: "Janvier 2023", description: "Mise sur le marché d'un 4ème produit : l'eau nettoyante visage et corps" },
    { id: 7, title: "Mars 2023", description: "1ère vente en maternité" },
    { id: 8, title: "Avril 2023", description: "1ère vente en crèche" },
];

export default function MyTimeline() {
    return (
        <div className="vtl-wrapper">
            {timelineData.map((item, i) => (
                <motion.div
                    key={item.id}
                    className="vtl-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                    <div className="vtl-left">
                        <div className="vtl-dot">
                            <img
                                src={`images/Timeline/${item.id}.jpg`}
                                alt={item.title}
                                className="vtl-img"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        {i < timelineData.length - 1 && <div className="vtl-line" />}
                    </div>
                    <div className="vtl-content">
                        <strong className="vtl-date">{item.title}</strong>
                        <p className="vtl-desc">{item.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
