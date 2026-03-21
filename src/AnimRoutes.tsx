import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Home } from './screens/Home';
import { Boutique } from './screens/Produits';
import MonHistoire from './screens/MonHistoire';
import Where from './screens/Where';
import { Newsletter } from './screens/Newsletter';
import MesEngagements from './screens/MesEngagements';
import { Parrainage } from "./screens/Parrainage";
import { FAQ } from "./screens/FAQ";
import ProduitDetail from "./screens/ProduitDetail";
import Contact from "./screens/Contact";
import Livraison from "./screens/Livraison";
import Glossaire from "./screens/Glossaire";
import PlanDuSite from "./screens/PlanDuSite";

const AnimRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence initial={true} mode='wait'>
            <Routes key={location.pathname} location={location}>
                <Route path='/' element={<Home />} />
                <Route path='/Boutique' element={<Boutique />} />
                <Route path="/Boutique/:productId" element={<ProduitDetail />} />
                <Route path='/MonHistoire' element={<MonHistoire />} />
                <Route path='/NousTrouver' element={<Where />} />
                <Route path='/MesEngagements' element={<MesEngagements />} />
                <Route path='/Newsletter' element={<Newsletter />} />
                <Route path='/Parrainage' element={<Parrainage />} />
                <Route path='/FAQ' element={<FAQ />} />
                <Route path='/Contact' element={<Contact />} />
                <Route path='/Livraison' element={<Livraison />} />
                <Route path='/Glossaire' element={<Glossaire />} />
                <Route path='/PlanDuSite' element={<PlanDuSite />} />
            </Routes>
        </AnimatePresence>
    )
}
export default AnimRoutes;
