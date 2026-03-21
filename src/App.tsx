
import './App.css';

import './styles/screens/ProduitDetails.css';
import './styles/screens/Home.css'
import './styles/screens/MonHistoire.css'
import './styles/screens/MesEngagements.css'
import './styles/screens/Produits.css'
import './styles/screens/Where.css'
import './styles/screens/Newletter.css'
import './styles/screens/FAQ.css'
import './styles/screens/Parrainage.css'
import './styles/screens/Contact.css'
import './styles/screens/Livraison.css'
import './styles/screens/Glossaire.css'
import './styles/screens/PlanDuSite.css'

import './styles/components/bouton.css'
import './styles/components/Header.css'
import './styles/components/Footer.css'
import './styles/components/Home-MeilleursVentes.css'
import './styles/components/Home-Commentaires.css'
import './styles/components/CarrouselAuto.css'
import './styles/components/timeline.css'
import './styles/components/timelinetest.css'

import { Headers } from './components/Headers';
import AnimRoutes from './AnimRoutes';
import { Footers } from './components/Footers';
import { CallToAction } from './components/CallToAction';
import HomeMeilleursVentes from './components/HomeMeilleursVentes';



function App() {
  return (
    <div className='App'>
      <Headers />
      <AnimRoutes />
      <HomeMeilleursVentes titre='Meilleures Ventes' />
      <CallToAction />
      <Footers />
    </div>
  );
}

export default App;
