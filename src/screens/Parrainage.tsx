import { motion } from 'framer-motion';
export const Parrainage = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <section className="Newsletter-section">
                <div className='Container-img-Parrainage'>
                    <img src="/images/Parrainage/Parrainage.jpg" alt="" />
                </div>
                <h1>Parrainez vos amis et recevez un code promo de 5€ !</h1>
                <div className='Parrainage'>
                    <p>Remplissez les informations ci-dessous pour obtenir votre lien personnalisé. <br />
                        Offrez à vos amis 5€ sur leur première commande et recevez le même montant une fois leur achat effectué.
                    </p>
                </div>
                <p>Les informations de parrainage à votre adresse e-mail</p>
                <input type="email" placeholder='Email' />
                <button>Recevoir mon lien</button>

                <div className='CommentCaMarche'>
                    <h3>Comment ça marche ?</h3>
                    <p>✔️ Partagez votre lien</p>
                    <p>✔️ Votre ami passe une commande (supérieure à 30 €)</p>
                    <p>✔️ Vous recevez un code de réduction de 10€ sur votre prochaine commande</p>
                </div>
            </section>
        </motion.main>
    )
}
