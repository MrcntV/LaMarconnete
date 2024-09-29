import { motion } from 'framer-motion';
import { transition1 } from "../transition"

export const Coupon = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transition1}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="Newsletter-coupon">
            <motion.h4
                initial={{ opacity: 0, translateX: "-200px" }}
                exit={{ opacity: 0, translateX: "200px" }}
                transition={transition1}
                whileInView={{ opacity: 1, translateX: "0px" }}
                viewport={{ once: true }}
            >
                Profitez de -10%</motion.h4>

            <p className="Newsletter-coupon-texte">sur votre 1ère commande en vous abonnant à la newsletter !</p>
            <div className="Newsletter-coupon-input"><input type="email" placeholder="Email" /><button>Je m'inscris !</button></div>
            <div className="form__privacy">
                <input id="checkbox" name="checkbox" type="checkbox" required />
                <label htmlFor="checkbox">
                    J'accepte la <a href="#">Politique de Confidentialité</a>
                </label>
            </div>

        </motion.div>

    )
}
