import { motion } from 'framer-motion';
import { Coupon } from '../components/Coupon';
export const Newsletter = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <section className="Newsletter-section">
                <div className="Newsletter-description">
                    <h1 className="NeNewsletter-titre">Bienvenue chez La marcOnnête</h1>
                    <p className="NeNewsletter-texte">Soyez aux premières loges des bienfaits de la simplicité et de la douceur pour tout-petits en vous inscrivant
                        à ma newsletter ! Découvrez en exclusivité nos conseils, astuces et articles sur l’hygiène et les soins certifiés BIO, les rituels de douceur
                        et les moments priviligiés avec votre bébé. Rejoignez notre communauté bienveillante pour des partages enrichissants
                        et des offres spéciales tout au long de l'année ! </p>
                </div>
                <Coupon />
            </section>
        </motion.main>
    )
}
