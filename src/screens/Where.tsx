import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icônes Leaflet avec webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    lat: number;
    lng: number;
}

const BoutiquesData: Boutiques[] = [
    { id: 1, Titre: "Pharmacie du Soleil​", Nom: "Pharmacie du Soleil", Rue: "10, Avenue Gazan", Département: "06", CodePostale: "06600", Ville: "ANTIBES", Tel: " 04 93 34 63 03", Image: "./images/PointsDeVentes/Pharmacie-du-Soleil-Antibes-300x204.png", lat: 43.5808, lng: 7.1241 },
    { id: 2, Titre: "Pharmacie Fontmerle​", Nom: "Pharmacie Fontmerle", Rue: "320, Boulevard pierre delmas", Département: "06", CodePostale: "06600", Ville: "ANTIBES", Tel: " 04 93 33 25 66", Image: "./images/PointsDeVentes/Pharmacie-Fontmerle-Antibes-300x200.png", lat: 43.5860, lng: 7.1115 },
    { id: 3, Titre: "Pharmacie Sagrandi Renoir​", Nom: "Pharmacie Sagrandi Renoir", Rue: "29, Avenue Auguste Renoir", Département: "06", CodePostale: "06800", Ville: "CAGNES-SUR-MER", Tel: "04 93 20 64 58", Image: "./images/PointsDeVentes/Pharmacie-Renoir-cagnes-sur-mer-300x225.jpg", lat: 43.6644, lng: 7.1489 },
    { id: 4, Titre: "Pharmacie du Val Fleuri​", Nom: "Pharmacie du Val Fleuri", Rue: "50, chemin du val fleuri", Département: "06", CodePostale: "06800", Ville: "CAGNES-SUR-MER", Tel: "04 93 31 17 70", Image: "./images/PointsDeVentes/Pharmacie-du-Val-Fleuri-cagnes-sur-mer-300x134.jpg", lat: 43.6580, lng: 7.1530 },
    { id: 5, Titre: "Pharmacie Gambetta​", Nom: "Pharmacie Gambetta", Rue: "1, Place Gambetta", Département: "06", CodePostale: "06400", Ville: "CANNES", Tel: "04 93 39 11 37", Image: "./images/PointsDeVentes/Phie-gambetta-cannes-300x225.jpg", lat: 43.5528, lng: 7.0174 },
    { id: 6, Titre: "Pharmacie du Soleil​", Nom: "Pharmacie du Soleil", Rue: "7, rue du Dr Pierre Gazagnaire", Département: "06", CodePostale: "06400", Ville: "CANNES", Tel: "04 93 39 25 74", Image: "./images/PointsDeVentes/pharmacie-Soleil-Cannes-300x169.jpg", lat: 43.5530, lng: 7.0190 },
    { id: 7, Titre: "Pharmacie de Châteauneuf​", Nom: "Pharmacie de Châteauneuf", Rue: "19, Chemin du cabanon", Département: "06", CodePostale: "06740", Ville: "CHATEAUNEUF-GRASSE", Tel: "04 93 42 56 43", Image: "./images/PointsDeVentes/phie-cahteauneuf.jpg", lat: 43.6681, lng: 6.9906 },
    { id: 8, Titre: "Pharmacie des jardins​", Nom: "Pharmacie des jardins", Rue: "2, Rue Partouneaux", Département: "06", CodePostale: "06500", Ville: "MENTON", Tel: "04 93 35 70 64", Image: "./images/PointsDeVentes/Phie-des-jardins-menton-300x225.jpg", lat: 43.7767, lng: 7.5014 },
    { id: 9, Titre: "Pharmacie de Mougins le haut​", Nom: "Pharmacie de Mougins le haut", Rue: "6, Place des Arcades", Département: "06", CodePostale: "06250", Ville: "MOUGINS", Tel: "04 93 67 80 31", Image: "./images/PointsDeVentes/Capture-decran-2023-02-12-a-16.25.52-300x139.png", lat: 43.6037, lng: 6.9997 },
    { id: 10, Titre: "Pharmacie de l'Avenue​", Nom: "Pharmacie de l'Avenue", Rue: "45, Avenue Jean Médecin", Département: "06", CodePostale: "06000", Ville: "NICE", Tel: "09 73 64 13 02", Image: "./images/PointsDeVentes/Pharmacie-de-lAvenue-Nice-300x125.png", lat: 43.7102, lng: 7.2620 },
    { id: 11, Titre: "Pharmacie Simon​", Nom: "Pharmacie Simon", Rue: "98, corniche André de Joly", Département: "06", CodePostale: "06300", Ville: "NICE", Tel: "04 93 01 19 83", Image: "./images/PointsDeVentes/PHARMACIE-SIMON-300x225.jpg", lat: 43.7220, lng: 7.2850 },
    { id: 12, Titre: "Pharmacie Nice TNL​", Nom: "Pharmacie Nice TNL", Rue: "15, Boulevard Général Louis Delfino", Département: "06", CodePostale: "06300", Ville: "NICE", Tel: "04 93 56 82 70", Image: "./images/PointsDeVentes/Pharmacie-TNL-300x202.png", lat: 43.7190, lng: 7.2870 },
    { id: 13, Titre: "Pharmacie des Magnolias​", Nom: "Pharmacie des Magnolias", Rue: "121 Bis Bv. Napoléon III", Département: "06", CodePostale: "06200", Ville: "NICE", Tel: "04 93 83 49 53", Image: "./images/PointsDeVentes/Pharmacie-des-magnolias-Nice-300x225.jpg", lat: 43.6990, lng: 7.2420 },
    { id: 14, Titre: "Pharmacie Magnan​", Nom: "Pharmacie Magnan", Rue: "11, Avenue de la Californie", Département: "06", CodePostale: "06200", Ville: "NICE", Tel: "04 93 41 02 21", Image: "./images/PointsDeVentes/Pharmacie-de-Magan-Nice-300x125.png", lat: 43.6950, lng: 7.2350 },
    { id: 15, Titre: "Pharmacie Saint-Antoine​", Nom: "Pharmacie Saint-Antoine", Rue: "340, chemin de la Ginestière", Département: "06", CodePostale: "06200", Ville: "NICE", Tel: "04.93.86.79.36", Image: "./images/PointsDeVentes/Pharmacie-Saint-Antoine-300x195.png", lat: 43.6870, lng: 7.2210 },
    { id: 16, Titre: "Pharmacie de la libération​", Nom: "Pharmacie de la libération", Rue: "30, avenue Malaussena", Département: "06", CodePostale: "06000", Ville: "NICE", Tel: "04.93.82.02.63", Image: "./images/PointsDeVentes/phie-de-la-liberation-300x195.jpg", lat: 43.7080, lng: 7.2680 },
    { id: 17, Titre: "Pharmacie du plan​", Nom: "Pharmacie du plan", Rue: "Quartier les Plans, D2085,", Département: "06", CodePostale: "06330", Ville: "ROQUEFORT-LES-PINS", Tel: "04 93 77 08 18", Image: "./images/PointsDeVentes/phie-du-plan-roquefort-les-pins.jpg", lat: 43.6683, lng: 7.0217 },
    { id: 18, Titre: "Pharmacie Clémenceau​", Nom: "Pharmacie Clémenceau", Rue: "19, Avenue Georges Clémenceau", Département: "06", CodePostale: "06220", Ville: "VALLAURIS", Tel: "04 93 64 17 05", Image: "./images/PointsDeVentes/phie-clemenceau-vallauris-300x225.jpg", lat: 43.5789, lng: 7.0565 },
    { id: 19, Titre: "Bio&Co Le marché Vallauris​", Nom: "Bio&Co Le marché Vallauris", Rue: "1955, chemin de Saint-Bernard", Département: "06", CodePostale: "06220", Ville: "VALLAURIS", Tel: "04 97 28 80 00", Image: "./images/PointsDeVentes/bioCo-vallauris-300x225.jpg", lat: 43.5820, lng: 7.0490 },
    { id: 20, Titre: "Bio&Co​", Nom: "Bio&Co", Rue: "90, chemin de la Pioline - Le Marché Aix en Provence", Département: "13", CodePostale: "13290", Ville: "AIX-EN-PROVENCE", Tel: "04.42.33.20.25", Image: "./images/PointsDeVentes/BIOCO-300x200.jpg", lat: 43.5297, lng: 5.4474 },
    { id: 21, Titre: "Au fil des jeux​", Nom: "Magasin de jouets", Rue: "Route de Saint-Maximin - Zone Artisanale", Département: "13", CodePostale: "13530", Ville: "TRETS", Tel: "04 86 91 64 42", Image: "./images/PointsDeVentes/au-fil-des-jeux-anciennement-peribaby-300x275.jpg", lat: 43.4462, lng: 5.6826 },
    { id: 22, Titre: "Pharmacie de l'avenue", Nom: "PHARMACIE DE L'AVENUE", Rue: "", Département: "43", CodePostale: "43000", Ville: "AUREC-SUR-LOIRE", Tel: "", Image: "./images/PointsDeVentes/", lat: 45.3689, lng: 4.2025 },
    { id: 23, Titre: "Pharmacie de Fraisses​", Nom: "PHARMACIE DE FRAISSES", Rue: "2 RUE JEAN PRADEL", Département: "42", CodePostale: "42490", Ville: "FRAISSES", Tel: "04 77 32 15 17", Image: "./images/PointsDeVentes/phie fraisses.jpg", lat: 45.4042, lng: 4.1408 },
    { id: 24, Titre: "Pharmacie Crozet", Nom: "PHARMACIE CROZET", Rue: "26 RUE VICTOR HUGO", Département: "42", CodePostale: "42400", Ville: "SAINT-CHAMOND", Tel: "04 77 22 07 90", Image: "./images/PointsDeVentes/Phie CROZET St Chamond.jpg", lat: 45.4753, lng: 4.5197 },
    { id: 25, Titre: "Pharmacie de l'Hôtel de ville​", Nom: "Pharmacie de l'Hôtel de ville", Rue: "13, place de l'Hôtel de ville", Département: "42", CodePostale: "42000", Ville: "SAINT-ETIENNE", Tel: "04 77 32 52 85", Image: "./images/PointsDeVentes/Pharmacie-hotel-de-ville-1-300x225.jpg", lat: 45.4397, lng: 4.3872 },
    { id: 26, Titre: "Pharmacie de Monthieu​", Nom: "Pharmacie de Monthieu", Rue: "Centre commercial Géant Casino - 140, rue de la Montat", Département: "42", CodePostale: "42100", Ville: "SAINT-ETIENNE", Tel: "04 77 21 47 18", Image: "./images/PointsDeVentes/Capture-decran-2022-02-02-a-16.48.46-300x224.png", lat: 45.4320, lng: 4.3740 },
    { id: 27, Titre: "Pharmacie de la Place Neuve​", Nom: "Pharmacie de la Place Neuve", Rue: "51, rue des Martyrs de Vingré", Département: "42", CodePostale: "42000", Ville: "SAINT-ETIENNE", Tel: "04 77 32 15 17", Image: "./images/PointsDeVentes/Capture-decran-2023-02-15-a-12.04.25-300x195.png", lat: 45.4410, lng: 4.3900 },
    { id: 28, Titre: "Pharmacie de la Marandinière", Nom: "PHARMACIE DE LA MARANDINIERE", Rue: "1 RUE MARCEL FEGUIDE", Département: "42", CodePostale: "42100", Ville: "SAINT-ETIENNE", Tel: "04 77 25 35 75", Image: "./images/PointsDeVentes/PharmacieMarandiniere.png", lat: 45.4350, lng: 4.3800 },
    { id: 29, Titre: "Pharmacie Saint-Michel", Nom: "PHARMACIE SAINT-MICHEL", Rue: "3 RUE ALEXANDRE DUMAS", Département: "42", CodePostale: "42270", Ville: "SAINT-PRIEST-EN-JAREZ", Tel: "04 77 93 00 95", Image: "./images/PointsDeVentes/pharmacie St Michel Saint Priest en Jarez.jpg", lat: 45.4842, lng: 4.3592 },
    { id: 30, Titre: "Pharmacie de l'europe", Nom: "PHARMACIE DE L'EUROPE", Rue: "3,place jaques raffin", Département: "42", CodePostale: "42340", Ville: "VEAUCHE", Tel: "04 77 54 63 60", Image: "./images/PointsDeVentes/phie europe veauche.jpg", lat: 45.5122, lng: 4.2703 },
    { id: 31, Titre: "Little PoHem", Nom: "PHARMACIE LITTLE POHEM", Rue: "16 avenue de la libération", Département: "42", CodePostale: "42340", Ville: "VEAUCHE", Tel: "09 83 40 78 19", Image: "./images/PointsDeVentes/little pohem.jpg", lat: 45.5135, lng: 4.2720 },
    { id: 32, Titre: "Pharmacie de la Talaudière", Nom: "PHARMACIE DE LA TALAUDIERE", Rue: "20, rue Victor Hugo", Département: "42", CodePostale: "42350", Ville: "LA TALAUDIERE", Tel: "04 77 53 60 22", Image: "./images/PointsDeVentes/PHIE DE LA TALAUDIERE.jpg", lat: 45.4958, lng: 4.4347 },
    { id: 33, Titre: "Pharmacie Perez Desbrun", Nom: "PHARMACIE PEREZ DESBRUN", Rue: "", Département: "43", CodePostale: "43500", Ville: "SAINT-PAL-DE-CHALENCON", Tel: "04 71 61 30 49", Image: "./images/PointsDeVentes/pharmacie st pal en chalencon.jpg", lat: 45.2333, lng: 3.9500 },
    { id: 34, Titre: "Pharmacie luquet", Nom: "PHARMACIE LUQUET", Rue: "3, boulevard du Nord", Département: "43", CodePostale: "43500", Ville: "CRAPONNE-SUR-ARZON", Tel: "04 71 03 20 26", Image: "./images/PointsDeVentes/LUQUET.jpg", lat: 45.3278, lng: 3.8528 },
    { id: 35, Titre: "Pharmacie Gallon-Briand", Nom: "PHARMACIE GALLON-BRIAND", Rue: "52, route nationale", Département: "42", CodePostale: "42550", Ville: "USSON-EN-FOREZ", Tel: "04 77 50 60 65", Image: "./images/PointsDeVentes/phie Gallon usson.jpg", lat: 45.3897, lng: 3.9869 },
    { id: 36, Titre: "Pharmacie de la gare des Brotteaux​", Nom: "PHARMACIE DE LA GARE DES BROTTEAUX", Rue: "38 boulevard des Brotteaux", Département: "69", CodePostale: "69006", Ville: "LYON", Tel: "04 78 52 21 31", Image: "./images/PointsDeVentes/brotteaux.png", lat: 45.7640, lng: 4.8490 },
    { id: 37, Titre: "Pharmacie Place Guichard​", Nom: "PHARMACIE PLACE GUICHARD", Rue: "61 RUE DE LA PART DIEU", Département: "69", CodePostale: "69003", Ville: "LYON", Tel: "04 78 60 83 50", Image: "./images/PointsDeVentes/PlaceGuichard.png", lat: 45.7610, lng: 4.8580 },
];

// Composant pour recentrer la carte
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Compteur animé
function AnimatedCounter({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    const prevValue = useRef(0);

    useEffect(() => {
        const start = prevValue.current;
        const end = value;
        if (start === end) return;
        const duration = 600;
        const startTime = performance.now();

        const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setDisplay(Math.round(start + (end - start) * progress));
            if (progress < 1) requestAnimationFrame(step);
            else prevValue.current = end;
        };
        requestAnimationFrame(step);
    }, [value]);

    return <span>{display}</span>;
}

function Where() {
    const [selectedBoutiques, setSelectedBoutiques] = useState<number | null>(null);
    const [searchDepartment, setSearchDepartment] = useState<string>('');
    const [filteredBoutiques, setFilteredBoutiques] = useState<Boutiques[]>(BoutiquesData);
    const [mapCenter, setMapCenter] = useState<[number, number]>([46.2, 5.5]);
    const [mapZoom, setMapZoom] = useState(6);
    const [postalInput, setPostalInput] = useState('');
    const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'done' | 'denied'>('idle');
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const searchTerm = searchDepartment.toLowerCase();
        const filtered = BoutiquesData.filter((b) =>
            b.Département.toLowerCase().includes(searchTerm) ||
            b.Ville.toLowerCase().includes(searchTerm) ||
            b.CodePostale.includes(searchTerm)
        ).sort((a, b) => {
            if (a.Département === b.Département) return a.Ville.localeCompare(b.Ville);
            return a.Département.localeCompare(b.Département);
        });
        setFilteredBoutiques(filtered);

        // Recentrer la carte sur les résultats filtrés
        if (filtered.length > 0 && searchTerm.length > 0) {
            const avgLat = filtered.reduce((s, b) => s + b.lat, 0) / filtered.length;
            const avgLng = filtered.reduce((s, b) => s + b.lng, 0) / filtered.length;
            setMapCenter([avgLat, avgLng]);
            setMapZoom(filtered.length === 1 ? 13 : 10);
        } else if (searchTerm.length === 0) {
            setMapCenter([46.2, 5.5]);
            setMapZoom(6);
        }
    }, [searchDepartment]);

    // Géolocalisation navigateur
    const handleGeolocate = () => {
        if (!navigator.geolocation) return;
        setGeoStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter([latitude, longitude]);
                setMapZoom(11);
                setGeoStatus('done');
                // Chercher le code postal via Nominatim
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(r => r.json())
                    .then(data => {
                        const cp = data?.address?.postcode;
                        if (cp) setSearchDepartment(cp.slice(0, 2));
                    })
                    .catch(() => { });
            },
            () => setGeoStatus('denied')
        );
    };

    // Recherche par code postal manuel
    const handlePostalSearch = async () => {
        if (!postalInput.trim()) return;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?postalcode=${postalInput}&country=fr&format=json&limit=1`
            );
            const data = await res.json();
            if (data.length > 0) {
                setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                setMapZoom(11);
            }
        } catch { }
        setSearchDepartment(postalInput.slice(0, 2));
    };

    const handleMemberClick = (id: number) => {
        setSelectedBoutiques(selectedBoutiques === id ? null : id);
    };

    useEffect(() => {
        const check = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', check);
        check();
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <main>
            <section id='NousTrouver'>
                {/* Titre principal */}
                <motion.h1
                    className="where-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Déjà dans plus de 40 boutiques !
                </motion.h1>

                {/* Sous-titre avec compteur dynamique */}
                <motion.div
                    className="where-counter-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>Découvrez nos partenaires</h2>
                    <div className="where-counter">
                        <AnimatedCounter value={filteredBoutiques.length} />
                        <span className="where-counter-label">
                            {filteredBoutiques.length < BoutiquesData.length
                                ? ` boutique${filteredBoutiques.length > 1 ? 's' : ''} trouvée${filteredBoutiques.length > 1 ? 's' : ''}`
                                : ` points de vente`}
                        </span>
                    </div>
                </motion.div>

                {/* Barre de recherche + géolocalisation */}
                <div className="where-search-row">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Département, ville ou code postal (ex: 42, Lyon, 69000)"
                        value={searchDepartment}
                        onChange={(e) => setSearchDepartment(e.target.value)}
                    />
                    <button className="where-geo-btn" onClick={handleGeolocate} title="Me localiser">
                        {geoStatus === 'loading' ? '...' : '📍 Me localiser'}
                    </button>
                </div>

                {/* Recherche par code postal pour la carte */}
                <div className="where-postal-row">
                    <input
                        className="search-input search-input-postal"
                        type="text"
                        placeholder="Code postal pour centrer la carte (ex: 69006)"
                        value={postalInput}
                        onChange={(e) => setPostalInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostalSearch()}
                    />
                    <button className="where-postal-btn" onClick={handlePostalSearch}>
                        Voir sur la carte
                    </button>
                </div>

                {geoStatus === 'denied' && (
                    <p className="where-geo-denied">Géolocalisation refusée. Entrez votre code postal ci-dessus.</p>
                )}

                {/* Carte */}
                <motion.div
                    className="where-map-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                        scrollWheelZoom={true}
                    >
                        <MapController center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {filteredBoutiques.map((b) => (
                            <Marker key={b.id} position={[b.lat, b.lng]}>
                                <Popup>
                                    <strong>{b.Titre}</strong><br />
                                    {b.Rue && <>{b.Rue}<br /></>}
                                    {b.CodePostale} {b.Ville}<br />
                                    {b.Tel && <>Tél : {b.Tel}</>}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </motion.div>

                {/* Liste des boutiques */}
                <ul className='ListePointsDeVente'>
                    {filteredBoutiques.map((Boutique, index) => (
                        <motion.li
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            key={Boutique.id}
                            className={`Boutique ${selectedBoutiques === Boutique.id ? 'selected' : ''}`}
                        >
                            <div className='ListePointsDeVente-Titre' onClick={() => handleMemberClick(Boutique.id)}>
                                <strong>{Boutique.Titre} - {Boutique.Ville} - {Boutique.Département}</strong>
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
