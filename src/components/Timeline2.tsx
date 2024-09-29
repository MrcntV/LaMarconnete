const timelineData = [
    {
        id: 1,
        title: "Octobre 2019",
        description: "Obtention de mon doctorat de chimie",
    },
    {
        id: 2,
        title: "Novembre 2019",
        description: "Naissance de ma petite merveille Léana",
    },
    {
        id: 3,
        title: "Mai 2021",
        description: "Naissance de la MarcÔnnet ",
    },
    {
        id: 4,
        title: "Septembre 2021",
        description: "Mise sur le marché des 3 premiers produits, première vente en magasin BIO et aux particuliers",
    },
    {
        id: 5,
        title: "Octobre 2021",
        description: "1ère vente en pharmacie",
    },
    {
        id: 6,
        title: "Janvier 2023",
        description: "mise sur le marché d'un 4ème produit : l'eau nettoyante visage et corps",
    },
    {
        id: 7,
        title: "Mars 2023",
        description: "1ère vente en maternité",
    },
    {
        id: 8,
        title: "Avril 2023",
        description: "1ère vente en crèche",
    },
];

function Timeline({ id, title, description }: { id: number, title?: string, description: string }) {
    return (
        <section className="timeline-container">
            <div className="timeline-contenant">
                <img className="timeline-contenant-image" src={`images/Timeline/${id}.jpg`} alt="Engagements La Marconnete" />
            </div>
            <h2 className='h2-timeline'>{title}</h2>
            <p className='p-timeline'>{description}</p>
            <div className="timeline-trait-noir-container" >
                <div className="timeline-trait-noir" style={{ width: '100%', backgroundColor: '#546863', height: '2px' }}></div>
            </div>
        </section>
    );
}

export default function MyTimeline() {

    return (
        <div className="horizontal-timeline">
            {timelineData.map((item) => (
                <Timeline key={item.id} id={item.id} title={item.title} description={item.description} />
            ))}

        </div>
    );
}