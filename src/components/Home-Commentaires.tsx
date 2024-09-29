import CarrouselManu from "./CarrouselManu"

import { motion } from 'framer-motion';
import { transition1 } from "../transition"

export const HomeCommentaires = () => {
    return (

        <section className='Commantaires'>
            <motion.h2
                initial={{ opacity: 0, translateX: "-200px" }}
                exit={{ opacity: 0, translateX: "200px" }}
                transition={transition1}
                whileInView={{ opacity: 1, translateX: "0px" }}
                viewport={{ once: true }}>
                C'est vous qui en parlez le mieux</motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={transition1}
                whileInView={{ opacity: 1}}
                viewport={{ once: true }} className="Carte-Commentaires-Items-Slider-Container">
                <CarrouselManu />
            </motion.div>
        </section>

    )
}
