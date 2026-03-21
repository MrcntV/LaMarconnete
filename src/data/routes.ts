export interface AppRoute {
    path: string;
    label: string;
    category: string;
    showInSitemap?: boolean;
}

export const appRoutes: AppRoute[] = [
    { path: '/', label: 'Accueil', category: 'Principal', showInSitemap: true },
    { path: '/Boutique', label: 'Boutique / Produits', category: 'Produits', showInSitemap: true },
    { path: '/CarteCadeau', label: 'Carte Cadeau', category: 'Produits', showInSitemap: true },
    { path: '/MonHistoire', label: 'Notre Histoire', category: 'La marcOnnête', showInSitemap: true },
    { path: '/MesEngagements', label: 'Nos Engagements', category: 'La marcOnnête', showInSitemap: true },
    { path: '/NousTrouver', label: 'Nos Points de Vente', category: 'La marcOnnête', showInSitemap: true },
    { path: '/Newsletter', label: "S'abonner à la Newsletter", category: 'La marcOnnête', showInSitemap: true },
    { path: '/Parrainage', label: 'Programme de Parrainage', category: 'La marcOnnête', showInSitemap: true },
    { path: '/Recrutement', label: 'Recrutement', category: 'La marcOnnête', showInSitemap: true },
    { path: '/DevenirPartenaire', label: 'Devenir Partenaire', category: 'La marcOnnête', showInSitemap: true },
    { path: '/FAQ', label: 'Questions Fréquentes', category: 'Aide', showInSitemap: true },
    { path: '/Contact', label: 'Contact', category: 'Aide', showInSitemap: true },
    { path: '/Livraison', label: 'Modalités de Livraison', category: 'Aide', showInSitemap: true },
    { path: '/Glossaire', label: 'Glossaire & Ingrédients', category: 'Aide', showInSitemap: true },
    { path: '/PlanDuSite', label: 'Plan du site', category: 'Aide', showInSitemap: true },
    { path: '/MentionsLegales', label: 'Mentions Légales', category: 'Légal', showInSitemap: true },
    { path: '/CGV', label: 'Conditions Générales de Vente', category: 'Légal', showInSitemap: true },
    { path: '/connexion', label: 'Mon compte', category: 'Principal', showInSitemap: false },
    { path: '/mon-compte', label: 'Mon compte', category: 'Principal', showInSitemap: false },
];
