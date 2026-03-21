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

interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    département: string;
    lat: number;
    lng: number;
    phone: string;
    image: string;
    active: boolean;
}

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
    const [allLocations, setAllLocations] = useState<Location[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filtered, setFiltered] = useState<Location[]>([]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([46.2, 5.5]);
    const [mapZoom, setMapZoom] = useState(6);
    const [postalInput, setPostalInput] = useState('');
    const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'done' | 'denied'>('idle');
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Chargement depuis l'API
    useEffect(() => {
        fetch('/api/locations')
            .then(r => r.json())
            .then((data: Location[]) => {
                setAllLocations(data);
                setFiltered(data);
            })
            .catch(() => {});
    }, []);

    // Filtrage
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const result = allLocations.filter((l) =>
            (l.département || '').toLowerCase().includes(term) ||
            l.city.toLowerCase().includes(term) ||
            l.postalCode.includes(term)
        ).sort((a, b) => {
            const dA = a.département || '';
            const dB = b.département || '';
            if (dA === dB) return a.city.localeCompare(b.city);
            return dA.localeCompare(dB);
        });
        setFiltered(result);

        if (result.length > 0 && term.length > 0) {
            const avgLat = result.reduce((s, l) => s + l.lat, 0) / result.length;
            const avgLng = result.reduce((s, l) => s + l.lng, 0) / result.length;
            setMapCenter([avgLat, avgLng]);
            setMapZoom(result.length === 1 ? 13 : 10);
        } else if (term.length === 0) {
            setMapCenter([46.2, 5.5]);
            setMapZoom(6);
        }
    }, [searchTerm, allLocations]);

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
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(r => r.json())
                    .then(data => {
                        const cp = data?.address?.postcode;
                        if (cp) setSearchTerm(cp.slice(0, 2));
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
        setSearchTerm(postalInput.slice(0, 2));
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
                        <AnimatedCounter value={filtered.length} />
                        <span className="where-counter-label">
                            {filtered.length < allLocations.length
                                ? ` boutique${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        {filtered.map((l) => (
                            <Marker key={l.id} position={[l.lat, l.lng]}>
                                <Popup>
                                    <strong>{l.name}</strong><br />
                                    {l.address && <>{l.address}<br /></>}
                                    {l.postalCode} {l.city}<br />
                                    {l.phone && <>Tél : {l.phone}</>}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </motion.div>

                {/* Liste des boutiques */}
                <ul className='ListePointsDeVente'>
                    {filtered.map((loc, index) => (
                        <motion.li
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            key={loc.id}
                            className={`Boutique ${selectedId === loc.id ? 'selected' : ''}`}
                        >
                            <div className='ListePointsDeVente-Titre' onClick={() => setSelectedId(selectedId === loc.id ? null : loc.id)}>
                                <strong>{loc.name} - {loc.city} - {loc.département}</strong>
                            </div>
                            <AnimatePresence>
                                {selectedId === loc.id && (
                                    <motion.div
                                        className='ListePointsDeVente-Détails'
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: isSmallScreen ? '30vw' : '20vw' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className='ListePointsDeVente-Détails-Gauche'>
                                            <p>{loc.name}</p>
                                            {loc.address && <p>{loc.address}</p>}
                                            <p>{loc.postalCode} {loc.city}</p>
                                            {loc.phone && <p>Tel : {loc.phone}</p>}
                                        </div>
                                        <div className='ListePointsDeVente-Détails-Droit'>
                                            {loc.image && <img src={loc.image} alt={loc.name} />}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    ))}
                </ul>

                {filtered.length === 0 && searchTerm.length > 0 && (
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
