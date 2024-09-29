import HomeMeilleursVentes from '../components/HomeMeilleursVentes';

import { motion } from 'framer-motion';
import MyTimeline from '../components/Timeline';
import MyTimelinetest from '../components/Timeline2';

const MonHistoire: React.FC = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} >
            <section>
                <div>
                    <div className='HomeContainer'>
                        <div className='HomeContainerGauche'>
                            <h2>Une histoire d’amour et de simplicité </h2>
                            <p>Peu de temps après l’obtention d’un doctorat en chimie, je donne naissance à ma fille, Léana, qui apporte avec elle une profonde transformation. Cette petite merveille a transformé mon monde, apportant une nouvelle inspiration et une motivation inégalée. </p>
                            <p>Sa douceur et sa fragilité me rappelaient constamment de faire de mon mieux pour protéger sa peau et sa santé. Cependant, face à un marché saturé d'ingrédients aussi complexes que superflus, je me suis rapidement aperçue que la quête de produits respectueux de cette vulnérabilité était ardue.</p>
                            <p>C’est alors que j'ai ressenti le besoin pressant de revenir à l'essentiel, de privilégier le minimalisme et d’en faire bénéficier d’autres parents. C'est ainsi qu'est née La marcOnnête, fruit de l'amour maternel et de l'expertise scientifique.</p>
                            <p>Chaque produit incarne une intention simple mais puissante : prendre soin de la peau des bébés et de leur santé avec des formules simples, sans artifice. </p>
                        </div>
                        <div className='HomeContainerDroit'>
                            <img src="images/AnaisLeanavP.png" alt="" />
                        </div>
                    </div>
                    <div>
                        <img src="" alt="" />
                    </div>
                </div>
            </section>
            <h2>Quelques dates clés …</h2>
            <section className="Timeline-container-2">
                <MyTimeline />
            </section>
            <section className="Timeline-container-test">
                <MyTimelinetest />
            </section>
            <HomeMeilleursVentes titre='Meilleurs Ventes' />
        </motion.main>
    )
}

export default MonHistoire;