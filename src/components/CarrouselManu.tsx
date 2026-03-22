import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import CommentairesItems from './CommentairesItems';
import { motion } from 'framer-motion';
import { transition1 } from '../transition';

// ── Avis de secours (affichés si Google n'est pas configuré) ─────────────────
const fallbackData = [
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Le gel lavant et la crème hydratante sont extra !!! Mon fils a la peau hyper bien hydratée, n'a plus de soucis de peau. Je recommande à 100%", Auteur: "LAURA" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Il n'y a que votre savon que ma fille supporte. Elle fait beaucoup d'eczéma et tout autre savon sont terribles. Les plaques ont cessé dès lors que j'ai utilisé vos produits. Merci !", Auteur: "CHLOE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Le soin est un très bon produit qui hydrate bien la peau. Texture légère, je suis ravie de mon achat!", Auteur: "PATRICIA" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Ma fille a la peau très sensible et ces produits sont géniaux. Ils ne collent pas et laissent la peau propre et douce. La composition est incroyable !", Auteur: "NATHALIE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Très bon produit, j'utilise le lait en démaquillant. J'ai toute la gamme, les produits sont top. Je recommande à 100%", Auteur: "JULIE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "J'ai acheté toute la gamme et très franchement j'ai adopté ! Des produits sans aucun danger pour la peau des bébés et uniquement français.", Auteur: "VICTORIA" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "J'utilise le lait de toilette depuis quelques semaines sur mon bébé et j'en suis très satisfaite ! La formule est douce, apaisante.", Auteur: "YSOLIE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "J'ai testé le gel lavant c'est un très bon produit doux et efficace je recommande vivement !", Auteur: "MARIE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Après une belle journée à la plage, j'applique la crème hydratante à mes enfants. Le lendemain la peau est douce, hydratée, sans rougeurs.", Auteur: "GAELLE" },
    { Etoiles: "⭐⭐⭐⭐⭐", Texte: "Le gel lavant est super. Plus de sécheresse après la douche, plus de croûte dans le cuir chevelu de mon fils.", Auteur: "KATY" },
];

const starsFromRating = (rating: number) => '⭐'.repeat(Math.round(rating));

const CarrouselManu: React.FC = () => {
    const [reviews, setReviews] = useState(fallbackData);
    const [globalRating, setGlobalRating] = useState<number | null>(null);
    const [totalRatings, setTotalRatings] = useState<number | null>(null);
    const [fromGoogle, setFromGoogle] = useState(false);

    useEffect(() => {
        fetch('/api/reviews')
            .then(r => r.json())
            .then(data => {
                if (data.configured && data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews.map((r: any) => ({
                        Etoiles: starsFromRating(r.rating),
                        Texte: r.text,
                        Auteur: r.author,
                        rating: r.rating,
                        relativeTime: r.relativeTime,
                        profilePhoto: r.profilePhoto,
                    })));
                    setGlobalRating(data.rating);
                    setTotalRatings(data.totalRatings);
                    setFromGoogle(true);
                }
            })
            .catch(() => {}); // garde les fallback silencieusement
    }, []);

    const settings = {
        className: 'center',
        centerMode: true,
        centerPadding: '12px',
        dotsClass: 'slick-dots-comment slick-thumb-comment',
        dots: true,
        arrows: true,
        speed: 500,
        autoplay: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, dots: false } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2, dots: true } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } },
        ],
    };

    return (
        <div>
            {fromGoogle && globalRating && (
                <div className="google-rating-summary">
                    <img
                        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                        alt="Google"
                        className="google-logo"
                    />
                    <span className="google-stars">{'⭐'.repeat(Math.round(globalRating))}</span>
                    <span className="google-score">{globalRating.toFixed(1)}/5</span>
                    {totalRatings && <span className="google-total">({totalRatings} avis)</span>}
                </div>
            )}
            <Slider {...settings}>
                {reviews.map((commentaire: any, index: number) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={transition1}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="slide"
                        key={index}
                    >
                        <CommentairesItems
                            Etoiles={commentaire.Etoiles}
                            Texte={commentaire.Texte}
                            Auteur={commentaire.Auteur}
                        />
                    </motion.div>
                ))}
            </Slider>
        </div>
    );
};

export default CarrouselManu;
