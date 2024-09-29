import { motion } from 'framer-motion';
import { useState } from 'react';

// const images = [
//     // Remplacez les src et alt par vos propres valeurs d'image
//     { src: '/images/MesEngagements/Image1.png', alt: 'Image 1', text: 'Texte pour Image 1' },
//     { src: '/images/MesEngagements/Image2.png', alt: 'Image 2', text: 'Texte pour Image 2' },
//     { src: '/images/MesEngagements/Image3.png', alt: 'Image 3', text: 'Texte pour Image 3' },
//     { src: '/images/MesEngagements/Image4.png', alt: 'Image 4', text: 'Texte pour Image 4' },
//     { src: '/images/MesEngagements/Image5.png', alt: 'Image 5', text: 'Texte pour Image 5' },
// ];

const MesEngagements = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <motion.main>
            <section>
                <h1>Mes Engagements
                </h1>
                <p>Chez La marcOnnête, nous croyons en la puissance des actions concrètes et responsables. Prendre des
                    engagements, ce n'est pas simplement parler, c’est avant tout agir ! A travers chacune de ses action, La marcOnnête
                    s’engage pour le bien-être de vos tout-petits et de notre planète en proposant une gamme </p>
                {/* <div className="image-container-test">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className="image-wrapper-test"
                        >
                            <motion.div
                                className={`circle circle-${index}`}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                            >
                                <span>i</span>
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }} // Commence avec une largeur nulle
                                    animate={{ opacity: hoveredIndex === index ? 1 : 0, scaleX: hoveredIndex === index ? 1 : 0 }} // Anime l'opacité et la largeur
                                    transition={{ duration: 0.2 }}
                                    className="circle-text"
                                >
                                    {image.text}
                                </motion.div>
                            </motion.div>
                            <motion.img
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                src={image.src} alt={image.alt} />
                        </motion.div>
                    ))}
                </div> */}
            </section>

        </motion.main>
    );
};

export default MesEngagements;
