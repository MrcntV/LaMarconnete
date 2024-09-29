import React, { useState } from 'react';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{ title: string, url: string }>>([]);

  const articles = [
    { title: 'Où sont fabriqués vos produits ?', url: '#fabriques-vos-produits' },
    { title: 'Vos produits contiennent-ils des allergènes ou des produits controversés ?', url: '#contient-allergenes' },
    { title: 'Vos produits sont-ils vegan ?', url: '#vegan' },
    { title: 'Vos produits sont-ils certifiés BIO ?', url: '#certifies-bio' },
    { title: 'Dois-je rincer après l"utilisation de l"eau nettoyante ?', url: '#eau-nettoyante-rincer' },
    { title: 'Est-ce que je peux utiliser l eau nettoyante pour me démaquiller ? ', url: '#utiliser-eau-nettoyante-demaquiller' },
    { title: 'Vos produits conviennent-ils aux peaux sensibles ou à tendance atopique ?', url: '#peaux-sensibles-atopiques' },
    { title: 'À partir de quel âge vos produits sont-ils utilisés ?', url: '#age-utilisation-produits' },
    { title: 'J ai une question sur un produit et je n ai pas trouvé ma réponse dans la FAQ, à qui m adresser ?', url: '#question-produit-sans-reponse' },
    { title: 'Comment passer commande ?', url: '#comment-passer-commande' },
    { title: 'Puis-je modifier ou annuler ma commande ?', url: '#modifier-annuler-commande' },
    { title: 'Le paiement est-il sécurisé ?', url: '#paiement-securise' },
    { title: 'Puis-je régler ma commande en chèque cadeaux ?', url: '#reglement-cheque-cadeaux' },
    { title: 'Comment utiliser un code de réduction (code promo) ?', url: '#utiliser-code-reduction' },
    { title: 'Mon code de réduction ne fonctionne pas, que faire ?', url: '#code-reduction-ne-fonctionne-pas' },
    { title: 'Quand vais-je recevoir les informations de suivi pour ma commande ?', url: '#suivi-commande' },
    { title: 'Est-ce que je peux me faire livrer sur mon lieu de travail ?', url: '#livraison-lieu-travail' },
    { title: 'Comment supprimer mon compte ?', url: '#supprimer-compte' },
    { title: 'Livrez-vous à l international ?', url: '#livraison-internationale' },
    { title: 'Quel est le montant des frais de port ?', url: '#frais-de-port' },
    { title: 'Quel est le délai de livraison ?', url: '#delai-livraison' },
    { title: 'Comment puis-je suivre ma livraison ?', url: '#suivi-livraison' },
    { title: 'Je rencontre un problème avec la livraison de ma commande, que faire ?', url: '#probleme-livraison' },
    { title: 'J ai reçu des produits endommagés, comment faire ?', url: '#produits-endommages' },
  ];
  

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const results = articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <div className='FAQSearchContainer'>
      <form onSubmit={handleSearchSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher sur le site"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Rechercher</button>
      </form>

      {searchResults.length > 0 ? (
        <div>
          <h3>Résultats de la recherche :</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <a href={result.url}>{result.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Afficher des résultats vides ou un message d'aucun résultat trouvé
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
}

export default SearchBar;
