export type Track = {
    number: number;
    title: string;
};


export type Détails = {
    Question: string;
    Réponse: string;
};
export type LienPaiement = {
    couleur: string;
    lienDirect: string;
    priceId: string;
    productId: string;
    quantite: number;
}

export type produits = {
    id: string;
    Titre: string;
    type: string;

    enStock: boolean;

    ImageProduit: string;
    ImageProduitSup: string;

    AltText: string;
    to: string;

    Prix: number;

    Description: string;
    Description2?: string;

    LesPlusProduits: string;

    Compositions: string;

    ConseilsUtilisaton: string;
    ImagesSupplementaires: string[],
    ImagesUtilisateurs?: string[],
    TexteBouton: string,
    LienPaiementUnique?: LienPaiement[],

    LienPaiementTailleS?: LienPaiement[];
    LienPaiementTailleM?: LienPaiement[];
    LienPaiementTailleL?: LienPaiement[];
    LienPaiementTailleXL?: LienPaiement[];

    LienPaiementCouleur0?: LienPaiement[],
    LienPaiementCouleur1?: LienPaiement[],

    besoinChoixCouleur: boolean;
    besoinChoixTaille: boolean;

    OptionsCouleur?: string[];

    // Ajout de la liste des pistes pour les albums
    Tracks?: Track[];
    Détail?: Détails[];
};

export const produitsData: produits[] = [

    //Vêtements
    {
        id: "1234567",
        Titre: "Tshirt Pulsar Col Rond", type: "vetement", AltText: "T-shirt Pulsar Col Rond CLASSIC", to: "TshirtPulsarColRond",
        enStock: true,
        ImageProduit: "TshirtColRond/Transparent-TshirtAv800.png",
        ImageProduitSup: "TshirtColRond/Transparent-TshirtAr800.png",
        ImagesSupplementaires:
            [
                "/images/Produits/Fiche/TshirtColRond/Transparent-TshirtAv800Détails.png",
                "/images/Produits/Fiche/TshirtColRond/Transparent-TshirtAr800Détails.png",
            ],
        Détail: [
            { Question: "Forme du col", Réponse: "Col Rond" },
            { Question: "Motif / Couleur", Réponse: "Noir" },
            { Question: "Imprimé", Réponse: "Blanc" },
            { Question: "Taille & Coupe", Réponse: "Classique" },
            { Question: "Silhouette", Réponse: "Droit" },
            { Question: "Longueur", Réponse: "Normale" },
            { Question: "Longueur des manches", Réponse: "Manches courtes" },
            { Question: "Conseils d'entretien", Réponse: "Lavage en machine à 30°C, lavage textiles délicats" },
        ],


        Prix: 22.00,
        Description: "Précommandez dès maintenant. Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",

        Compositions: "Coton peigné avec lavage aux enzymes. Finition double aiguille bas de manche et bas de vêtement. Certifié STANDARD 100 by OEKO-TEX®, IFTH. Grammage 180 g/m2; Coloris unis : 100% coton.",

        ConseilsUtilisaton: "",
        LesPlusProduits: "",

        TexteBouton: "Précommander",
        besoinChoixCouleur: false,
        besoinChoixTaille: true,

        LienPaiementTailleS: [
            {
                lienDirect: "https://book.stripe.com/00g3dcbnr2nO5AAeUW",
                priceId: "price_1OK4gcCik0FZhKhASWzdUH5o",
                productId: "prod_P8LNyiroFXZkeC",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleM: [
            {
                lienDirect: "https://book.stripe.com/6oE1540IN6E41kk5kn",
                priceId: "price_1OKzeSCik0FZhKhAdqH7H3mW",
                productId: "prod_P9IEJHaVKRrH2n",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleL: [
            {
                lienDirect: "https://book.stripe.com/9AQ9BA77b5A01kk004",
                priceId: "price_1OKzfXCik0FZhKhAWsZElK5Z",
                productId: "prod_P9IGprd8TorIOz",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleXL: [
            {
                lienDirect: "https://book.stripe.com/28oeVU0IN5A0e767sx",
                priceId: "price_1OKznHCik0FZhKhA6gsMTqwN",
                productId: "prod_P9IOi7sIxk1vxC",
                quantite: 1,
                couleur: "",
            }
        ],

    },

    // --T-shirt Pulsar femme
    {
        id: "1234568",
        Titre: "Tshirt Pulsar COL V", type: "vetement", AltText: "T-Shirt Pulsar Col en V CLASSIC", to: "TshirtPulsarColV",
        enStock: true,
        ImageProduit: "TshirtColV/Transparent-TshirtAv800.png",
        ImageProduitSup: "TshirtColV/Transparent-TshirtAr800.png",
        ImagesSupplementaires:
            [
                "/images/Produits/Fiche/TshirtColV/Transparent-TshirtAv800Détails.png",
                "/images/Produits/Fiche/TshirtColV/Transparent-TshirtAr800Détails.png",
            ],

        Détail: [
            { Question: "Forme du col", Réponse: "Col V" },
            { Question: "Motif / Couleur", Réponse: "Noir" },
            { Question: "Imprimé", Réponse: "Blanc" },
            { Question: "Taille & Coupe", Réponse: "Classique" },
            { Question: "Silhouette", Réponse: "Cintré" },
            { Question: "Longueur", Réponse: "Normale" },
            { Question: "Longueur des manches", Réponse: "Manches courtes" },
            { Question: "Conseils d'entretien", Réponse: "Lavage en machine à 30°C, lavage textiles délicats" },
        ],

        Prix: 22.00,
        Description: " Précommandez dès maintenant. Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",

        Compositions: " Coton peigné avec lavage aux enzymes. Bande de propreté à l'encolure. Finition double aiguille bas de manche et bas de vêtement. Certifié STANDARD 100 by OEKO-TEXN CQ1007, IFTH.",

        ConseilsUtilisaton: "",
        LesPlusProduits: "",

        ImagesUtilisateurs:
            [
                "",
                "",
                "",
            ],


        TexteBouton: "Précommander",

        besoinChoixCouleur: false,
        besoinChoixTaille: true,

        LienPaiementTailleS: [
            {
                lienDirect: "https://book.stripe.com/9AQ2981MR7I8gfe5kr",
                priceId: "price_1OK4ikCik0FZhKhAFqp2MyfD",
                productId: "prod_P8LPuTN6iXzvfy",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleM: [
            {
                lienDirect: "https://book.stripe.com/fZe154fDHe6wfba28g",
                priceId: "price_1OKzVGCik0FZhKhAwzrR5bwy",
                productId: "prod_P9I5a9KriUkUXW",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleL: [
            {
                lienDirect: "https://book.stripe.com/4gw7ts1MR8Mc9QQeV4",
                priceId: "price_1OKzW2Cik0FZhKhAoqAQEMGL",
                productId: "prod_P9I6fClA5evZ7y",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleXL: [
            {
                lienDirect: "https://book.stripe.com/fZecNMcrvfaAgfebIR",
                priceId: "price_1OKzWgCik0FZhKhAdKF5uOAI",
                productId: "prod_P9I6EbckofYDH1",
                quantite: 1,
                couleur: "",
            }
        ],
    },

    // --Sweat à capuche
    {
        id: "1234569",
        Titre: "SWEAT à capuche brodé", type: "vetement", AltText: "SWEAT à capuche Pulsar CLASSIC ", to: "SweatPulsar",
        enStock: true,

        ImageProduit: "/Sweat/Transpparent-SWEATav.png",
        ImageProduitSup: "/Sweat/Transparent-SWEATar.png",
        ImagesSupplementaires:
            [
                "/images/Produits/Fiche/Sweat/Transpparent-SWEATavDétails.png",
                "/images/Produits/Fiche/Sweat/Transparent-SWEATarDétails.png",
                "/images/Produits/Fiche/Sweat/Transpparent-SWEATcotDDétails.png",
                "/images/Produits/Fiche/Sweat/Transpparent-SWEATcotGDétails.png",
            ],

        Détail: [
            { Question: "Col", Réponse: "Capuche" },
            { Question: "Poche", Réponse: "Kangourou" },
            { Question: "Capuche", Réponse: "Capuche avec cordon de serrage" },
            { Question: "Imprimé", Réponse: "Blanc" },
            { Question: "Taille & Coupe", Réponse: "Large" },
            { Question: "Silhouette", Réponse: "Droit" },
            { Question: "Longueur", Réponse: "Normale" },
            { Question: "Longueur des manches", Réponse: "Manches longues" },
            { Question: "Informations additionnelles", Réponse: "Taille élastique, Broderie" },
        ],

        Prix: 42.00,
        Description: " Précommandez dès maintenant. Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",

        Compositions: "80% coton / 20% polyester. Traitement LSF ( Low Shrinkage Fleece ). Moileton gratté 3 fils en coton peigné. Manches montées. Bande de propreté contrasté à l'encolure. Capuche doublée en d'abeille avec un cordon de serrage. Poches kangourou. Finition bord-cote poignets et de bas vêtement. Certtifié STANDARD 100 by OEKO-TEX® - TEXN CQ1007/7. IFTH.",

        ConseilsUtilisaton: "",
        LesPlusProduits: "",

        besoinChoixCouleur: false,
        besoinChoixTaille: true,

        TexteBouton: "Précommander",

        LienPaiementTailleS: [
            {
                lienDirect: "https://book.stripe.com/28o6pocrv3rS6EE6oz",
                priceId: "price_1OL01zCik0FZhKhAl4DQrdyi",
                productId: "prod_P8LKH5eqTCqZ6o",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleM: [
            {
                lienDirect: "https://book.stripe.com/3cs7tsezD0fG4ww9AM",
                priceId: "price_1OKl6TCik0FZhKhAh8dDif8Q",
                productId: "prod_P93COwpwVZATEs",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleL: [
            {
                lienDirect: "https://book.stripe.com/cN29BA77b9Qg7II4gu",
                priceId: "price_1OKl7WCik0FZhKhAgPz9g5uc",
                productId: "prod_P93D7lvKm1CXIe",
                quantite: 1,
                couleur: "",
            }
        ],
        LienPaiementTailleXL: [
            {
                lienDirect: "https://book.stripe.com/28ocNM4Z39Qg1kkdR3",
                priceId: "price_1OKzvfCik0FZhKhAl4x2G0TM",
                productId: "prod_P93FHtb7MN2c4h",
                quantite: 1,
                couleur: "",
            }
        ],
    },
    // --Casquette
    {
        id: "12345610",
        Titre: "Casquette brodée", type: "vetement", AltText: "Casquette Pulsar CLASSIC", to: "CasquettePulsar",
        enStock: true,

        ImageProduit: "/Casquette/Transparent-Casquette800.png",
        ImageProduitSup: "/Casquette/Transparent-Casquette800noir.png",
        ImagesSupplementaires:
            [
                "/images/Produits/Fiche/Casquette/Transparent-Casquette800Détails.png",
                "/images/Produits/Fiche/Casquette/Transparent-Casquette800noirDétails.png",
            ],

        Détail: [
            { Question: "Taille", Réponse: "Réglable" },
            { Question: "Conseils d'entretien", Réponse: "Blanchiment interdit, ne pas laver" },
        ],


        Prix: 18.00,
        Description: " Précommandez dès maintenant. Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",

        Compositions: "Coton sergé brossé épais haute qualité. Tissage solide et résistant. Certifié STANDARD 100 by OEKO-TEX N CQ 1007/8, IFTH.100%. Fermeture arrière réglable par boucle métalique argent + passant",

        ConseilsUtilisaton: "",
        LesPlusProduits: "",

        besoinChoixCouleur: true,
        besoinChoixTaille: false,
        TexteBouton: "Précommander",

        OptionsCouleur: ["Noir", "Blanc"],

        LienPaiementCouleur0: [
            {
                lienDirect: "https://book.stripe.com/14kcNM9fjfaA8MMbIX",
                priceId: "price_1OK4kVCik0FZhKhA3ZJxTQQT",
                productId: "prod_P8LReMBUHpDZDi",
                quantite: 1,
                couleur: "Blanc",
            }
        ],

        LienPaiementCouleur1: [
            {
                lienDirect: "https://book.stripe.com/14k4hg1MR4vW1kk14k",
                priceId: "price_1OY9icCik0FZhKhAs2yFxN9D",
                productId: "prod_PMtVXpHYlsmtVn",
                quantite: 1,
                couleur: "Noir",
            }
        ]

    },

    //ALBUMS

    // --Refléxions
    {
        id: "12345611",
        type: "album", Titre: "Reflexions", to: "AlbumRéflexions",
        enStock: true,
        ImageProduit: "/Albums/Réflexions.png",
        ImageProduitSup: "/Albums/RéflexionsAr.png",
        ImagesSupplementaires: [
            "/images/Produits/Fiche/Albums/Présentation Réflexions (1).mp4",
            "/images/Produits/Fiche/Albums/Réflexions.png",
            "/images/Produits/Fiche/Albums/RéflexionsAr.png"
        ],
        AltText: "",
        Prix: 20.00,
        Description: "Découvrez 'REFLEXIONS', l'innovant album du rappeur Mitchy. Sorti en 2022, cet opus de 54 minutes se démarque par son concept unique : une clé USB dans un miroir encadré. Avec 15 titres captivants, 'REFLEXIONS' fusionne art et technologie, offrant une expérience musicale riche qui reflète la créativité de Mitchy.",
        Description2: "Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",
        Compositions: "",
        ConseilsUtilisaton: "",
        LesPlusProduits: "",
        TexteBouton: "Acheter",
        LienPaiementUnique:
            [
                {
                    lienDirect: "https://buy.stripe.com/28o3dcbnr6E4e76aEK",
                    priceId: "price_1OL09aCik0FZhKhAZVvkROPZ",
                    productId: "prod_P9IlTz8Is0awIq",
                    quantite: 1,
                    couleur: "",
                }
            ],

        Tracks: [
            { number: 1, title: "Intro" },
            { number: 2, title: "Même si" },
            { number: 3, title: "Impatient" },
            { number: 4, title: "Missile" },
            { number: 5, title: "Ok ok" },
            { number: 6, title: "Mômes (feat Osen)" },
            { number: 7, title: "Immensité" },
            { number: 8, title: "Horizon (feat. Ophéwilk)" },
            { number: 9, title: "Wouaï" },
            { number: 10, title: "Salut terre" },
            { number: 11, title: "Coup de choeur" },
            { number: 12, title: "Dépassé" },
            { number: 13, title: "Mayday" },
            { number: 14, title: "Jump" },
            { number: 15, title: "Réflexion" },
        ],

        besoinChoixCouleur: false,
        besoinChoixTaille: false,
    },

    // --Genesis
    {
        id: "12345612",
        type: "album", Titre: "Genesis", to: "AlbumGenesis",

        enStock: true,
        ImageProduit: "/Albums/Genesis.png",
        ImageProduitSup: "/Albums/GenesisAr.png",
        ImagesSupplementaires:
            [
                "/images/Produits/Fiche/Albums/GenesisAvAr.png",
                "/images/Produits/Fiche/Albums/Genesis.png",

                "/images/Produits/Fiche/Albums/GenesisAr.png",
            ],
        AltText: "Album GENESIS Mitchy",

        Prix: 10.00,
        Description: "'GENESIS' de Mitchy, un concentré d'énergie musicale en 23 minutes. Sorti en 2019, cet album offre une expérience intense, marquant un tournant audacieux dans le parcours de Mitchy. Un incontournable pour les amateurs de rythmes captivants.",
        Description2: "Livraison FRANCE METROPOLITAINE UNIQUEMENT. Frais de livraison non inclus.",

        Compositions: "",

        ConseilsUtilisaton: "",
        LesPlusProduits: "",

        TexteBouton: "Acheter",
        LienPaiementUnique:
            [
                {
                    lienDirect: "https://buy.stripe.com/28o5lkbnrfaA5AA289",
                    priceId: "price_1OL0HbCik0FZhKhAnNLKR73b",
                    productId: "prod_P9ItFEQeNf8xWC",
                    quantite: 1,
                    couleur: "",
                }
            ],

        Tracks: [
            { number: 1, title: "Mini Jim'" },
            { number: 2, title: "Ineffable" },
            { number: 3, title: "Bande à part (feat Shae)" },
            { number: 4, title: "Grande" },
            { number: 5, title: "Solo" },
            { number: 6, title: "Shake it up" },
            { number: 7, title: "Sayonara" },
        ],
        besoinChoixCouleur: false,
        besoinChoixTaille: false,
    },
]