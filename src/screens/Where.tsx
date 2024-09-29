import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Boutiques {
    id: number;
    Titre: string;
    Nom: string;
    Rue: string;
    CodePostale: string;
    Département: string;
    Ville: string;
    Tel: string;
    Image: string;
}

const BoutiquesData: Boutiques[] = [
    {
        id: 1,
        Titre: "Pharmacie du Soleil​",
        Nom: "Pharmacie du Soleil",
        Rue: "10, Avenue Gazan",
        Département: "06",
        CodePostale: "06600",
        Ville: "ANTIBES",
        Tel: " 04 93 34 63 03",
        Image: "./images/PointsDeVentes/Pharmacie-du-Soleil-Antibes-300x204.png",
    },
    {
        id: 2,
        Titre: "Pharmacie Fontmerle​",
        Nom: "Pharmacie Fontmerle",
        Rue: "320, Boulevard pierre delmas",
        Département: "06",
        CodePostale: "06600",
        Ville: "ANTIBES",
        Tel: " 04 93 33 25 66",
        Image: "./images/PointsDeVentes/Pharmacie-Fontmerle-Antibes-300x200.png",
    },
    {
        id: 3,
        Titre: "Pharmacie Sagrandi Renoir​",
        Nom: "Pharmacie Sagrandi Renoir",
        Rue: "29, Avenue Auguste Renoir",
        Département: "06",
        CodePostale: "06800",
        Ville: "CAGNES-SUR-MER",
        Tel: "04 93 20 64 58",
        Image: "./images/PointsDeVentes/Pharmacie-Renoir-cagnes-sur-mer-300x225.jpg",
    },
    {
        id: 4,
        Titre: "Pharmacie du Val Fleuri​",
        Nom: "Pharmacie du Val Fleuri",
        Rue: "50, chemin du val fleuri",
        Département: "06",
        CodePostale: "06800",
        Ville: "CAGNES-SUR-MER",
        Tel: "04 93 31 17 70",
        Image: "./images/PointsDeVentes/Pharmacie-du-Val-Fleuri-cagnes-sur-mer-300x134.jpg",
    },
    {
        id: 5,
        Titre: "Pharmacie Gambetta​",
        Nom: "Pharmacie Gambetta",
        Rue: "1, Place Gambetta",
        Département: "06",
        CodePostale: "06400",
        Ville: "CANNES",
        Tel: "04 93 39 11 37",
        Image: "./images/PointsDeVentes/Phie-gambetta-cannes-300x225.jpg",
    },
    {
        id: 6,
        Titre: "Pharmacie du Soleil​",
        Nom: "Pharmacie du Soleil",
        Rue: "7, rue du Dr Pierre Gazagnaire",
        Département: "06",
        CodePostale: "06400",
        Ville: "CANNES",
        Tel: "04 93 39 25 74",
        Image: "./images/PointsDeVentes/pharmacie-Soleil-Cannes-300x169.jpg",
    },
    {
        id: 7,
        Titre: "Pharmacie de Châteauneuf​",
        Nom: "Pharmacie de Châteauneuf",
        Rue: "19, Chemin du cabanon",
        Département: "06",
        CodePostale: "06740",
        Ville: "CHATEAUNEUF-GRASSE",
        Tel: "04 93 42 56 43",
        Image: "./images/PointsDeVentes/phie-cahteauneuf.jpg",
    },
    {
        id: 8,
        Titre: "Pharmacie des jardins​",
        Nom: "Pharmacie des jardins",
        Rue: "2, Rue Partouneaux",
        Département: "06",
        CodePostale: "06500",
        Ville: "MENTON",
        Tel: "04 93 35 70 64",
        Image: "./images/PointsDeVentes/Phie-des-jardins-menton-300x225.jpg",
    },
    {
        id: 9,
        Titre: "Pharmacie de Mougins le haut​",
        Nom: "Pharmacie de Mougins le haut",
        Rue: "6, Place des Arcades",
        Département: "06",
        CodePostale: "06250",
        Ville: "MOUGINS",
        Tel: "04 93 67 80 31",
        Image: "./images/PointsDeVentes/Capture-decran-2023-02-12-a-16.25.52-300x139.png",
    },
    {
        id: 10,
        Titre: "Pharmacie de l’Avenue​",
        Nom: "Pharmacie de l’Avenue",
        Rue: "45, Avenue Jean Médecin",
        Département: "06",
        CodePostale: "06000",
        Ville: "NICE",
        Tel: "09 73 64 13 02",
        Image: "./images/PointsDeVentes/Pharmacie-de-lAvenue-Nice-300x125.png",
    },
    {
        id: 11,
        Titre: "Pharmacie Simon​",
        Nom: "Pharmacie Simon",
        Rue: "98, corniche André de Joly",
        Département: "06",
        CodePostale: "06300",
        Ville: "NICE",
        Tel: "04 93 01 19 83",
        Image: "./images/PointsDeVentes/PHARMACIE-SIMON-300x225.jpg",
    },

    {
        id: 12,
        Titre: "Pharmacie Nice TNL​",
        Nom: "Pharmacie Nice TNL",
        Rue: "15, Boulevard Général Louis Delfino",
        Département: "06",
        CodePostale: "06300",
        Ville: "NICE",
        Tel: "04 93 56 82 70",
        Image: "./images/PointsDeVentes/Pharmacie-TNL-300x202.png",
    },
    {
        id: 13,
        Titre: "Pharmacie des Magnolias​",
        Nom: "Pharmacie des Magnolias",
        Rue: "121 Bis Bv. Napoléon III",
        Département: "06",
        CodePostale: "06200",
        Ville: "NICE",
        Tel: "04 93 83 49 53",
        Image: "./images/PointsDeVentes/Pharmacie-des-magnolias-Nice-300x225.jpg",
    },
    {
        id: 14,
        Titre: "Pharmacie Magnan​",
        Nom: "Pharmacie Magnan",
        Rue: "11, Avenue de la Californie",
        Département: "06",
        CodePostale: "06200",
        Ville: "NICE",
        Tel: "04 93 41 02 21",
        Image: "./images/PointsDeVentes/Pharmacie-de-Magan-Nice-300x125.png",
    },

    {
        id: 15,
        Titre: "Pharmacie Saint-Antoine​",
        Nom: "Pharmacie Saint-Antoine",
        Rue: "340, chemin de la Ginestière",
        Département: "06",
        CodePostale: "06200",
        Ville: "NICE",
        Tel: "04.93.86.79.36",
        Image: "./images/PointsDeVentes/Pharmacie-Saint-Antoine-300x195.png",
    },
    {
        id: 16,
        Titre: "Pharmacie de la libération​",
        Nom: "Pharmacie de la libération",
        Rue: "30, avenue Malaussena",
        Département: "06",
        CodePostale: "06000",
        Ville: "NICE",
        Tel: "04.93.82.02.63",
        Image: "./images/PointsDeVentes/phie-de-la-liberation-300x195.jpg",
    },


    {
        id: 17,
        Titre: "Pharmacie du plan​",
        Nom: "Pharmacie du plan",
        Rue: "Quartier les Plans, D2085,",
        Département: "06",
        CodePostale: "06330",
        Ville: "ROQUEFORT-LES-PINS",
        Tel: "04 93 77 08 18",
        Image: "./images/PointsDeVentes/phie-du-plan-roquefort-les-pins.jpg",
    },

    {
        id: 18,
        Titre: "Pharmacie Clémenceau​",
        Nom: "Pharmacie Clémenceau",
        Rue: "19, Avenue Georges Clémenceau",
        Département: "06",
        CodePostale: "06220",
        Ville: "VALLAURIS",
        Tel: "04 93 64 17 05",
        Image: "./images/PointsDeVentes/phie-clemenceau-vallauris-300x225.jpg",
    },
    {
        id: 19,
        Titre: "Bio&Co Le marché Vallauris​",
        Nom: "Bio&Co Le marché Vallauris",
        Rue: "1955, chemin de Saint-Bernard",
        Département: "06",
        CodePostale: "06220",
        Ville: "VALLAURIS",
        Tel: "04 97 28 80 00",
        Image: "./images/PointsDeVentes/bioCo-vallauris-300x225.jpg",
    },
    {
        id: 20,
        Titre: "Bio&Co​ ​",
        Nom: "Bio&Co",
        Rue: "90, chemin de la Pioline - Le Marché Aix en Provence",
        Département: "13",
        CodePostale: "13290",
        Ville: "AIX-EN-PROVENCE",
        Tel: "04.42.33.20.25",
        Image: "./images/PointsDeVentes/BIOCO-300x200.jpg",
    },


    {
        id: 21,
        Titre: "Au fil des jeux​",
        Nom: "Magasin de jouets",
        Rue: "Route de Saint-Maximin - Zone Artisanale",
        Département: "13",
        CodePostale: "13530",
        Ville: "TRETS",
        Tel: "04 86 91 64 42",
        Image: "./images/PointsDeVentes/au-fil-des-jeux-anciennement-peribaby-300x275.jpg",
    },

    {
        id: 22,
        Titre: "Pharmacie de l'avenue",
        Nom: "PHARMACIE DE L'AVENUE",
        Rue: "",
        Département: "43",
        CodePostale: "43000",
        Ville: "AUREC-SUR-LOIRE ",
        Tel: "",
        Image: "./images/PointsDeVentes/",
    },
    {
        id: 23,
        Titre: "Pharmacie de Fraisses ​",
        Nom: "PHARMACIE DE FRAISSES",
        Rue: "2 RUE JEAN PRADEL",
        Département: "42",
        CodePostale: "42490",
        Ville: "FRAISSES",
        Tel: "04 77 32 15 17",
        Image: "./images/PointsDeVentes/phie fraisses.jpg",
    },
    {
        id: 24,
        Titre: "Pharmacie Crozet",
        Nom: "PHARMACIE CROZET",
        Rue: "26 RUE VICTOR HUGO",
        Département: "42",
        CodePostale: "42400",
        Ville: "SAINT-CHAMOND",
        Tel: "04 77 22 07 90",
        Image: "./images/PointsDeVentes/Phie CROZET St Chamond.jpg",
    },


    {
        id: 25,
        Titre: "Pharmacie de l'Hôtel de ville​",
        Nom: "Pharmacie de l'Hôtel de ville",
        Rue: "13, place de l’Hôtel de ville",
        Département: "42",
        CodePostale: "42000",
        Ville: "SAINT-ETIENNE",
        Tel: "04 77 32 52 85",
        Image: "./images/PointsDeVentes/Pharmacie-hotel-de-ville-1-300x225.jpg",
    },
    {
        id: 26,
        Titre: "Pharmacie de Monthieu ​",
        Nom: "Pharmacie de Monthieu ",
        Rue: "Centre commercial Géant Casino - 140, rue de la Montat",
        Département: "42",
        CodePostale: "42100",
        Ville: "SAINT-ETIENNE",
        Tel: "04 77 21 47 18",
        Image: "./images/PointsDeVentes/Capture-decran-2022-02-02-a-16.48.46-300x224.png",
    },
    {
        id: 27,
        Titre: "Pharmacie de la Place Neuve ​",
        Nom: "Pharmacie de la Place Neuve",
        Rue: "51, rue des Martyrs de Vingré",
        Département: "42",
        CodePostale: "42000",
        Ville: "SAINT-ETIENNE",
        Tel: "04 77 32 15 17",
        Image: "./images/PointsDeVentes/Capture-decran-2023-02-15-a-12.04.25-300x195.png",
    },
    {
        id: 28,
        Titre: "Pharmacie de la Marandinière",
        Nom: "PHARMACIE DE LA MARANDINIERE",
        Rue: "1 RUE MARCEL FEGUIDE",
        Département: "42",
        CodePostale: "42100",
        Ville: "SAINT-ETIENNE",
        Tel: "04 77 25 35 75",
        Image: "./images/PointsDeVentes/PharmacieMarandiniere.png",
    },
    {
        id: 29,
        Titre: "Pharmacie Saint-Michel",
        Nom: "PHARMACIE SAINT-MICHEL",
        Rue: "3 RUE ALEXANDRE DUMAS",
        Département: "42",
        CodePostale: "42270",
        Ville: "SAINT-PRIEST-EN-JAREZ",
        Tel: "04 77 93 00 95",
        Image: "./images/PointsDeVentes/pharmacie St Michel Saint Priest en Jarez.jpg",
    },
    {
        id: 30,
        Titre: "Pharmacie de l'europe",
        Nom: "PHARMACIE DE L'EUROPE",
        Rue: "3,place jaques raffin",
        Département: "42",
        CodePostale: "42340",
        Ville: "VEAUCHE",
        Tel: "04 77 54 63 60",
        Image: "./images/PointsDeVentes/phie europe veauche.jpg",
    },

    {
        id: 31,
        Titre: "Little PoHem",
        Nom: "PHARMACIE LITTLE POHEM",
        Rue: "16 avenue de la libération",
        Département: "42",
        CodePostale: "42340",
        Ville: "VEAUCHE",
        Tel: "09 83 40 78 19",
        Image: "./images/PointsDeVentes/little pohem.jpg",
    },
    {
        id: 32,
        Titre: "Pharmacie de la Talaudière",
        Nom: "PHARMACIE DE LA TALAUDIERE",
        Rue: "20, rue Victor Hugo",
        Département: "42",
        CodePostale: "42350",
        Ville: "LA TALAUDIERE",
        Tel: "04 77 53 60 22",
        Image: "./images/PointsDeVentes/PHIE DE LA TALAUDIERE.jpg",
    },



    {
        id: 33,
        Titre: "Pharmacie Perez Desbrun",
        Nom: "PHARMACIE PEREZ DESBRUN",
        Rue: "",
        Département: "43",
        CodePostale: "43500",
        Ville: "SAINT-PAL-DE-CHALENCON",
        Tel: "04 71 61 30 49",
        Image: "./images/PointsDeVentes/pharmacie st pal en chalencon.jpg",
    },

    {
        id: 34,
        Titre: "pharmacie luquet ",
        Nom: "PHARMACIE LUQUET",
        Rue: "3, boulevard du Nord",
        Département: "43",
        CodePostale: "43500",
        Ville: "CRAPONNE-SUR-ARZON",
        Tel: "04 71 03 20 26",
        Image: "./images/PointsDeVentes/LUQUET.jpg",
    },
    {
        id: 35,
        Titre: "Pharmacie Gallon-Briand  ",
        Nom: "PHARMACIE GALLON-BRIAND",
        Rue: "52, route nationale",
        Département: "42",
        CodePostale: "42550 ",
        Ville: "USSON-EN-FOREZ",
        Tel: "04 77 50 60 65",
        Image: "./images/PointsDeVentes/phie Gallon usson.jpg",
    },

    {
        id: 36,
        Titre: "Pharmacie de la gare des Brotteaux ​",
        Nom: "PHARMACIE DE LA GARE DES BROTTEAUX",
        Rue: "38 boulevard des Brotteaux",
        Département: "69",
        CodePostale: "69006",
        Ville: "LYON",
        Tel: "04 78 52 21 31",
        Image: "./images/PointsDeVentes/brotteaux.png",
    },
    {
        id: 37,
        Titre: "Pharmacie Place Guichard​",
        Nom: "PHARMACIE PLACE GUICHARD",
        Rue: "61 RUE DE LA PART DIEU",
        Département: "69",
        CodePostale: "69003",
        Ville: "LYON",
        Tel: "04 78 60 83 50",
        Image: "./images/PointsDeVentes/PlaceGuichard.png",
    },

];

function Where() {
    const [selectedBoutiques, setSelectedBoutiques] = useState<number | null>(null);
    const [searchDepartment, setSearchDepartment] = useState<string>('');

    // Utilisez cette liste pour la recherche et le filtrage
    const [filteredBoutiques, setFilteredBoutiques] = useState<Boutiques[]>(BoutiquesData);

    // Effet pour mettre à jour les boutiques filtrées en fonction de la recherche
    useEffect(() => {
        const searchTerm = searchDepartment.toLowerCase();
        const filtered = BoutiquesData.filter((Boutique) => {
            return (
                Boutique.Département.toLowerCase().includes(searchTerm) ||
                Boutique.Ville.toLowerCase().includes(searchTerm) ||
                Boutique.CodePostale.includes(searchTerm)
            );
        });

        // Tri des boutiques par numéro de département (du plus petit au plus grand)
        // puis par ordre alphabétique du nom de la ville
        filtered.sort((a, b) => {
            if (a.Département === b.Département) {
                return a.Ville.localeCompare(b.Ville);
            }
            return a.Département.localeCompare(b.Département);
        });

        setFilteredBoutiques(filtered);
    }, [searchDepartment])



    const handleMemberClick = (boutiqueId: number) => {
        if (selectedBoutiques === boutiqueId) {
            setSelectedBoutiques(null);
        } else {
            setSelectedBoutiques(boutiqueId);
        }
    };

    const idMax = BoutiquesData.length;

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchDepartment(event.target.value);
    };

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        // Fonction pour vérifier la largeur de la fenêtre
        const checkScreenSize = () => {
            if (window.innerWidth < 768) {
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        };
        // Écoute des changements de la taille de la fenêtre
        window.addEventListener("resize", checkScreenSize);
        // Vérification de la taille de la fenêtre au chargement de la page
        checkScreenSize();
        // Nettoyage de l'écouteur d'événements lorsque le composant est démonté
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return (
        <main>
            <section id='NousTrouver'>
                <h2>Découvrez nos partenaires</h2>
                <p>Déjà dans {idMax} boutiques !</p>

                <input
                    className="search-input"
                    type="text"
                    placeholder="Recherche par département, ville ou code postal (ex: 42, Lyon, 69000)"
                    value={searchDepartment}
                    onChange={handleSearchChange}
                />
                <ul className='ListePointsDeVente'>
                    {filteredBoutiques.map((Boutique, index) => (
                        <motion.li
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            key={Boutique.id}
                            className={`Boutique ${selectedBoutiques === Boutique.id ? 'selected' : ''}`}
                        >
                            <div className='ListePointsDeVente-Titre'>
                                <div className='ListePointsDeVente-Titre' onClick={() => handleMemberClick(Boutique.id)}>
                                    <strong>{Boutique.Titre} - {Boutique.Ville} - {Boutique.Département}</strong>
                                </div>
                            </div>
                            <AnimatePresence>
                                {selectedBoutiques === Boutique.id && (
                                    <motion.div
                                        className='ListePointsDeVente-Détails'
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: isSmallScreen ? '30vw' : '20vw' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className='ListePointsDeVente-Détails-Gauche'>
                                            <p>{Boutique.Nom}</p>
                                            <p>{Boutique.Rue}</p>
                                            <p>{Boutique.CodePostale} {Boutique.Ville}</p>
                                            <p>Tel : {Boutique.Tel}</p>
                                        </div>
                                        <div className='ListePointsDeVente-Détails-Droit'>
                                            <img src={Boutique.Image} alt={Boutique.Nom} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    ))}
                </ul>
                {filteredBoutiques.length === 0 && searchDepartment.length > 0 && (
                    <div className="no-results">
                        <h4>Désolé, nous ne sommes pas encore dans ce département.</h4>
                        <img src="./images/Mascottes/Mascotte_elephant_v7.png" alt="" />
                    </div>
                )}
            </section>
        </main>
    );
}

export default Where;