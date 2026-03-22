
import { ContentProvider } from './contexts/ContentContext';
import { CartProvider } from './contexts/CartContext';

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
import './styles/screens/Legal.css'
import './styles/screens/CarteCadeau.css'
import './styles/screens/LoginClient.css'
import './styles/screens/MonCompte.css'

import './styles/components/bouton.css'
import './styles/components/Header.css'
import './styles/components/Footer.css'
import './styles/components/Home-MeilleursVentes.css'
import './styles/components/Home-Commentaires.css'
import './styles/components/CarrouselAuto.css'
import './styles/components/timeline.css'
import './styles/components/timelinetest.css'
import './styles/components/WelcomePopup.css'

import { Headers } from './components/01_Headers';
import AnimRoutes from './AnimRoutes';
import { Footers } from './components/02_Footers';
import { CallToAction } from './components/CallToAction';
import HomeMeilleursVentes from './components/HomeMeilleursVentes';
import { ScrollToTopOnNav, ScrollToTopButton } from './components/ScrollToTop';
import WelcomePopup from './components/WelcomePopup';



function App() {
  return (
    <CartProvider>
    <ContentProvider>
      <div className='App'>
        <ScrollToTopOnNav />
        <Headers />
        <AnimRoutes />
        <HomeMeilleursVentes titre='Meilleures Ventes' />
        <CallToAction />
        <Footers />
        <ScrollToTopButton />
        <WelcomePopup />
      </div>
    </ContentProvider>
    </CartProvider>
  );
}

export default App;
