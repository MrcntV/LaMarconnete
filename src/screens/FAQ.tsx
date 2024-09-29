import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQSectionProps {
    title: string;
    items: FAQItem[];
}

function FAQSection({ title, items }: FAQSectionProps) {
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const toggleQuestion = (id: number) => {
        if (openQuestion === id) {
            setOpenQuestion(null);
        } else {
            setOpenQuestion(id);
        }
    };

    const transition1 = {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.3 },
    };

    // Divisez les éléments en deux colonnes
    const halfItemCount = Math.ceil(items.length / 2);
    const leftColumnItems = items.slice(0, halfItemCount);
    const rightColumnItems = items.slice(halfItemCount);

    return (
        <div className="faq-section">
            <motion.h2
                onClick={toggleAccordion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <IoIosArrowDown className={`arrow-icon ${isOpen ? "open" : ""}`} />
                {title}
            </motion.h2>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="faq-block"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transition1}
                    >
                        <div className="column">
                            {leftColumnItems.map((item: FAQItem, index: number) => (
                                <motion.div
                                    className="faq-item"
                                    key={item.id}
                                    layout
                                    onClick={() => toggleQuestion(item.id)}
                                >
                                    <motion.h4 layout>
                                        {item.question}{" "}
                                        {openQuestion === item.id ? (
                                            <IoIosArrowDown className="arrow-icon open" />
                                        ) : (
                                            <IoIosArrowDown className="arrow-icon" />
                                        )}
                                    </motion.h4>
                                    {openQuestion === item.id && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            layout
                                        >
                                            {item.answer}
                                        </motion.p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <div className="column">
                            {rightColumnItems.map((item: FAQItem, index: number) => (
                                <motion.div
                                    className="faq-item"
                                    key={item.id}
                                    layout
                                    onClick={() => toggleQuestion(item.id)}
                                >
                                    <motion.h4 layout>
                                        {item.question}{" "}
                                        {openQuestion === item.id ? (
                                            <IoIosArrowDown className="arrow-icon open" />
                                        ) : (
                                            <IoIosArrowDown className="arrow-icon" />
                                        )}
                                    </motion.h4>
                                    {openQuestion === item.id && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            layout
                                        >
                                            {item.answer}
                                        </motion.p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FAQSection;


export const FAQ = () => {
    const faqData = [
        {
            title: "Généralités",
            items: [
                {
                    id: 1,
                    question: "Où sont fabriqués vos produits ?",
                    answer: "Toutes nos formules sont développées et produites en France.",
                },
                {
                    id: 2,
                    question: "Vos produits contiennent-ils des allergènes ou des produits controversés ?",
                    answer: "Tous nos produits ne contiennent aucun ingrédient chimique controversé et sont totalement sains pour le corps. Par exemple, ils ne contiennent pas de parfum (qui est le premier allergène des cosmétiques), d'huiles essentielles, de sulfates ni de parabènes ou de phtalates.",
                },
                {
                    id: 3,
                    question: "Vos produits sont-ils vegan ?",
                    answer: "Oui, nos formules sont 100% vegan et aucun de nos ingrédients n'est issu de l'exploitation animale ni testé sur eux conformément à la réglementation européenne.",
                },
                {
                    id: 4,
                    question: "Vos produits sont-ils certifiés BIO ?",
                    answer: "Oui, tous nos produits sont certifiés biologiques Cosmos Organic par l'organisme Cosmécert. De plus, la marcOnnête est une marque adhérente à l'association Cosmébio.",
                },
                {
                    id: 5,
                    question: "Dois-je rincer après l'utilisation de l'eau nettoyante ?",
                    answer: "Notre eau nettoyante a été développée pour être utilisée sans rinçage. Les tensioactifs sélectionnés sont particulièrement doux pour ne pas faire réagir la peau. Si toutefois, vous souhaitez rincer le produit après utilisation, cela n'impactera pas les propriétés de notre eau nettoyante car votre peau aura été démaquillée et purifiée au préalable.",
                },
                {
                    id: 6,
                    question: "Est-ce que je peux utiliser l'eau nettoyante pour me démaquiller ?",
                    answer: "Oui, c'est tout à fait possible. Notre eau nettoyante a été développée pour nettoyer efficacement tout en douceur. Elle est également efficace sur le maquillage.",
                },
                {
                    id: 7,
                    question: "Vos produits conviennent-ils aux peaux sensibles ou à tendance atopique ?",
                    answer: "Nous avons pris soin de proposer des formules 'clean' sans ingrédients controversés, sans parfum, même naturel, et sans aucun allergène. À la différence des produits classiques, nos formules renferment des tensioactifs doux, d'origine naturelle, et sont enrichies en glycérine végétale et Aloe vera BIO permettant de nettoyer sans dessécher la peau. Enfin, nos ingrédients ont été sélectionnés spécialement pour être bien tolérés par ce type de peau.",
                },
                {
                    id: 8,
                    question: "À partir de quel âge vos produits sont-ils utilisés ?",
                    answer: "Tous nos produits sont utilisables dès la naissance de votre bébé. La qualité et la sécurité de nos produits sont notre priorité, c'est pourquoi ils sont spécialement conçus pour répondre aux besoins de la peau fragile des bébés et des enfants.",
                },
                {
                    id: 9,
                    question: "J'ai une question sur un produit et je n'ai pas trouvé ma réponse dans la FAQ, à qui m'adresser ?",
                    answer: "Pour poser une question concernant un produit ou la marque, vous pouvez nous écrire via le formulaire de contact en ligne disponible ici ou par mail à contact@lamarconnete.fr",
                },
            ],
        },
        {
            title: "Livraison",
            items: [
                {
                    id: 1,
                    question: "Livrez-vous à l'international ?",
                    answer: "Nous livrons uniquement en France métropolitaine, Andorre, en Corse et à Monaco.",
                },
                {
                    id: 2,
                    question: "Quel est le montant des frais de port ?",
                    answer: "Pour toute commande en France métropolitaine, Corse et Monaco, les tarifs de livraison à domicile sans signature sont de 6,95 €. 1,40€ supplémentaire sera demandé pour une livraison contre signature. En revanche, si vous optez pour une livraison en point relais la tarif sera de seulement 6,10 €.",
                },
                {
                    id: 3,
                    question: "Quel est le délai de livraison ?",
                    answer: "Le délai de livraison est de 2 à 5 jours ouvrés.",
                },
                {
                    id: 4,
                    question: "Comment puis-je suivre ma livraison ?",
                    answer: "Une fois votre commande remise au transporteur, ce dernier vous enverra votre numéro de suivi par e-mail, utilisable sur le site laposte.fr, afin que vous puissiez suivre votre commande.",
                },
                {
                    id: 5,
                    question: "Je rencontre un problème avec la livraison de ma commande, que faire ?",
                    answer: "Vous pouvez joindre notre service client en nous écrivant via le formulaire en ligne disponible ici ou à l'adresse suivante : contact@lamarconnete.fr, nous serons ravis de pouvoir vous aider !",
                },
                {
                    id: 6,
                    question: "J'ai reçu des produits endommagés, comment faire ?",
                    answer: "Vous pouvez contacter notre SAV en remplissant le formulaire de contact en ligne disponible ici ou en nous écrivant à contact@lamarconnete.fr. Merci de nous joindre une ou plusieurs photos de vos produits abîmés. Si le colis dans lequel vous avez reçu vos produits était également en mauvais état alors n'hésitez pas à en faire aussi une photo. Nous reviendrons rapidement vers vous.",
                },
            ],
        },
        {
            title: "Commandes",
            items: [
                {
                    id: 1,
                    question: "Comment passer commande ?",
                    answer: "Passer commande sur le site de La marcOnnête est facile et sécurisé. Il vous suffit de sélectionner le ou les articles de votre choix, puis sélectionnez le bouton 'Ajouter au panier' sur la page de descriptif du produit. Une fois que vous avez terminé vos achats, cliquez sur 'Mon panier' dans le coin supérieur droit de la page et suivez les instructions pour effectuer le paiement. Vous recevrez un e-mail de confirmation de votre commande comprenant votre numéro de commande. Pour toute question, n'hésitez pas à contacter notre service client via notre formulaire de contact en ligne disponible ici ou par mail à contact@lamarconnete.fr",
                },
                {
                    id: 2,
                    question: "Puis-je modifier ou annuler ma commande ?",
                    answer: "Nous vous remercions pour votre commande. Nous vous invitons à prendre contact au plus vite avec notre service client via le formulaire de contact en ligne disponible ici ou à l'adresse e-mail suivante contact@lamarconnete.fr précisant votre nom/prénom et votre numéro de commande. En fonction du statut de votre commande, nous vous proposerons la solution la plus adaptée.",
                },
                {
                    id: 3,
                    question: "Le paiement est-il sécurisé ?",
                    answer: "Oui, nous prenons votre sécurité très au sérieux, c'est pourquoi nous utilisons l'approbation 3D Secure pour tous les paiements et le certificat SSL, pour protéger vos données personnelles et vos informations de carte de crédit contre tout accès non autorisé.",
                },
                {
                    id: 4,
                    question: "Puis-je régler ma commande en chèque cadeaux ?",
                    answer: "Non, malheureusement nous n'acceptons pas les chèques cadeaux pour régler une commande.",
                },
                {
                    id: 5,
                    question: "Comment utiliser un code de réduction (code promo) ?",
                    answer: "Une fois que vos articles ont été placés dans votre panier, vous verrez une section pour entrer le code de réduction avec une zone de texte. Entrez simplement le code dans la case et cliquez sur Appliquer. Votre code sera automatiquement appliqué à votre commande et le montant total sera mis à jour. Attention, vous ne pouvez utiliser qu'un seul code de réduction par commande.",
                },
                {
                    id: 6,
                    question: "Mon code de réduction ne fonctionne pas, que faire ?",
                    answer: "Nous sommes désolés pour ce désagrément, nous vous invitons à vérifier la date de validité de votre code de réduction, la conformité à la communication qui en a été faite (orthographe, majuscule, minuscule), association avec une autre promotion. S'il ne fonctionne toujours pas, nous vous invitons à prendre contact avec notre service client via le formulaire de contact en ligne disponible ici ou à l'adresse mail suivante contact@lamarconnete.fr",
                },
                {
                    id: 7,
                    question: "Quand vais-je recevoir les informations de suivi pour ma commande ?",
                    answer: "Vous recevrez un e-mail du transporteur dans les 1 à 3 jours ouvrés indiquant votre numéro de suivi après l'expédition de votre commande. Si vous ne recevez pas d'e-mail, veuillez contacter notre service client via le formulaire de contact en ligne disponible ici ou à l'adresse mail suivante : contact@lamarconnete.fr",
                },
                {
                    id: 8,
                    question: "Est-ce que je peux me faire livrer sur mon lieu de travail ?",
                    answer: "Oui, vous pouvez vous faire livrer sur votre lieu de travail. Il vous suffit d'indiquer cette adresse de livraison lors de votre commande.",
                },
                {
                    id: 9,
                    question: "Comment supprimer mon compte ?",
                    answer: "Si vous désirez supprimer votre compte, nous vous invitons à contacter notre service clients via le formulaire de contact en ligne disponible ici ou à l'adresse mail suivante : contact@lamarconnete.fr",
                },
            ],
        },
    ];

    return (
        <main>
            <section>
                <h1>Bonjour, comment puis-je vous aider ?</h1>
                <SearchBar />
                {faqData.map((section, index) => (
                    <FAQSection key={index} title={section.title} items={section.items} />
                ))}
            </section>
        </main>
    );
};
