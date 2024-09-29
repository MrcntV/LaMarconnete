import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

const timelineData = [
    {
        id: 1,
        title: "La simplicité",
        description: "Ici, pas de superflu ! Je suis convaincue que les produits les plus simples sont souvent les meilleurs c’est pourquoi, je vais à l’essentiel en proposant des produits formulés avec un minimum d’ingrédients ",
    },
    {
        id: 2,
        title: "Le naturel et la BIO",
        description: "Toute la gamme est certifiée BIO par COSMECERT. Je vais au-delà des exigences de la charte COSMEBIO avec un minimum de 98,9% d’ingrédients d’origine naturelle ",
    },
    {
        id: 3,
        title: "Le sans parfum même naturel",
        description: "Tous les parfums sont bannis car il s’agit du premier allergène des cosmétiques ! Les huiles essentielles sont également exclues des formules afin d’éviter d’éventuelles irritations ou réactions allergiques ",
    },
    {
        id: 4,
        title: "La sécurité et la douceur",
        description: "Les substances controversées sont exclues des formules. Les produits d’hygiène renferment un tensioactif à base de sucre afin de nettoyer en douceur, sans agresser. Tous les produits sont testés sous contrôle pédiatrique ou dermatologique pour être utilisés en toute sécurité dès la naissance",
    },
    {
        id: 5,
        title: "Le respect de l'environnement",
        description: "Les procédés de fabrication nocifs pour l’Homme ou l’environnement sont bannis et les ingrédients naturels et biodégradables privilégiés. Les produits n’ont pas de sur-emballages et leur conditionnement est 100% recyclable. Je certifie tous les éléments de communication FSC, PEFC ou Imprim’vert",
    },
    {
        id: 6,
        title: "La fabrication francaise",
        description: "Fière de valoriser le savoir-faire français en proposant des produits de haute qualité. Ce choix permet également de soutenir l’économie de notre beau pays et de limiter l’empreinte carbone en favorisant les circuits courts !",
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
                <img className="Timeline-contenant-image" src={`images/MesEngagements/${id}.jpg`} alt="Engagements La Marconnete" />
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
