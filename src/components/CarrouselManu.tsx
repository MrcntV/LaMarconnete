import React from 'react';
import Slider from 'react-slick';
import CommentairesItems from './CommentairesItems';
import { motion } from 'framer-motion';
import { transition1 } from '../transition';

const CommentairesData = [
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Le gel lavant et la crème hydratante sont extra !!! Mon fils a la peau hyper bien hydratée, n’a plus de soucis de peau, la crème ne colle pas, le gel lavant ne lui cause aucun soucis niveau cuir chevelu ni sécheresse de la peau après … Et en prime les produits sont top pour nous aussi, moi qui ai la même peau que lui c’est super !!  Donc merci pour ces super produits!",
        Autheur: "LAURA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Mon fils a retrouvé une peau comme neuve avec vos produits ! C’est impressionnant ! Merci beaucoup",
        Autheur: "LAURA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Il n’y a que votre savon que ma fille supporte. Elle fait beaucoup d’ecxèma et tout autre savon, même les plus recommandés et achetés en pharmacie sont terribles. Vraiment les plaques ont cessées dès lors que j’ai utilisé vos produits. Donc merci !",
        Autheur: "CHLOE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Le soin est un très bon produit qui hydrate bien la peau. Texture légère, je suis ravie de mon achat!",
        Autheur: "PATRICIA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Ma fille a la peau très sensible et ces produits sont géniaux. Ils sentent bons, ne collent pas et laissent la peau propre et douce. La composition est incroyable ! Merci",
        Autheur: "NATHALIE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Très bon produit, j’utilise le lait en démaquillant. J’ai toute la gamme, les produits sont top. Ils laissent une belle peau et hydratée, en plus ils sont efficaces sur les problèmes de peau. Le top… Je recommande à 100%",
        Autheur: "JULIE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Nous avons adopté le p’tit 3ème de la gamme de produits de soin bébé. Sa texture est onctueuse, fini doux et soyeux, hydratation intense ! On adore !",
        Autheur: "ANNE-CLAIRE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "J’ai acheté toute la gamme de produits et très franchement j’ai adopté ! Des produits sans aucun danger pour la peau des bébés et uniquement français. Je recommande les yeux fermés",
        Autheur: "VICTORIA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "J’utilise le lait de toilette depuis quelques semaines sur mon bébé et j’en suis très satisfaite ! La formule est douce, apaisante, et nettoie parfaitement la peau de mon bébé ! Je recommande !",
        Autheur: "YSOLIE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "J’ai testé le gel lavant c’est un très bon produit doux et efficace je recommande vivement !",
        Autheur: "MARIE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Très bon produit, le lait de toilette nettoie correctement les fesses bébé ! Il laisse également la peau douce et hydratée. Je le recommande vivement !",
        Autheur: "LAURA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Après une belle journée à la plage, j’applique à mes enfants la crème hydratante. Elle fait du bien, nourrit la peau en profondeur. Le lendemain la peau est douce, hydratée, sans rougeurs. On adore… Je recommande vraiment ces produits        ",
        Autheur: "GAELLE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Le soin hydratant nourrit, protège et apaise la peau et il est à base d’aloe vera. Mon fils avait quelques boutons et le résultat fut à la hauteur de ce que j’attendais, boutons asséchés et peau hydratée ",
        Autheur: "JULIE"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "Le gel lavant est super. Plus de sécheresse après la douche, plus de croûte dans le cuir chevelu de mon fils. La petite odeur légère est agréable également !",
        Autheur: "LAURA"
    },
    {
        Etoiles: "⭐⭐⭐⭐⭐",
        Texte: "La formule est douce, apaisante et nettoie super bien la peau de ma princesse, sans agressivité, ni résidus. C’est naturel, sans parfum ni huiles essentielles. Je vous recommande !",
        Autheur: "KATY"
    }
];

const CarrouselManu: React.FC = () => {
    const settings = {
      className: 'center',
      centerMode: true,
      centerPadding: '12px',
      dotsClass: 'slick-dots-comment slick-thumb-comment',
      dots: true,
      arrows: true,
      speed: 500,
      autoplay: false,
      autoplaySpeed: 0,
      slidesToShow: 4,
      slidesToScroll: 1,
      
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            dots: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
          },
        },
      ],
    };
  
    return (
      <Slider {...settings}>
        {CommentairesData.map((commentaire, index) => (
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
              Auteur={commentaire.Autheur}
            />
          </motion.div>
        ))}
      </Slider>
    );
  };
  
  export default CarrouselManu;