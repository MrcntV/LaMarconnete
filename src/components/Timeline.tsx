import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

const timelineData = [
    {
        id: 1,
        title: "Octobre 2019",
        description: "Obtention de mon doctorat de chimie",
    },
    {
        id: 2,
        title: "Novembre 2019",
        description: "Naissance de ma petite merveille Léana",
    },
    {
        id: 3,
        title: "Mai 2021",
        description: "Naissance de la MarcÔnnete ",
    },
    {
        id: 4,
        title: "Septembre 2021",
        description: "mise sur le marché des 3 premiers produits, première vente en magasin BIO et aux particulier",
    },
    {
        id: 5,
        title: "octobre 2021",
        description: "1ère vente en pharmacie",
    },
    {
        id: 6,
        title: "Janvier 2023",
        description: "mise sur le marché d'un 4ème produits : l'eau nettoyante visage et corps",
    },
    {
        id: 7,
        title: "Mars 2023",
        description: "1ère vente en maternité",
    },
    {
        id: 8,
        title: "Avril 2023",
        description: "1ère vente en crèche",
    },
];

function Timeline({ id, title, description }: { id: number | string, title?: string, description: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const y = useParallax(scrollYProgress, 500);
    const pY = useParallax(scrollYProgress, 200);

    return (
        <section className="Timeline-container">
            <div className="Timeline-contenant" ref={ref}>
                <img className="Timeline-contenant-image" src={`images/Timeline/${id}.jpg`} alt="Engagements La Marconnete" />
            </div>
            <motion.h2 className='h2-Timeline' style={{ y }}>{`${title}`}</motion.h2>
            <motion.p className='p-Timeline' style={{ y: pY }}>{`${description}`}</motion.p>
            <div className="Timeline-trait-noir" style={{ height: '100%', backgroundColor: '#546863', width: '2px' }}></div>
        </section>
    );
}

export default function MyTimeline2() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            {timelineData.map((item) => (
                <Timeline key={item.id} id={item.id} title={item.title} description={item.description} />
            ))}
            {/* <motion.div className="progress" style={{ scaleX }} /> */}
        </>
    );
}
