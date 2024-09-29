import React, { useEffect, useRef } from 'react';

type CommentairesItemsProps = {
    Etoiles: string;
    Texte: string;
    Auteur: string;
};

const CommentairesItems: React.FC<CommentairesItemsProps> = ({ Etoiles, Texte, Auteur }) => {
    const texteRef = useRef<HTMLParagraphElement | null>(null);
    const ellipsisRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (texteRef.current && ellipsisRef.current) {
            if (texteRef.current.clientHeight > 100) {
                ellipsisRef.current.style.display = 'block';
            }
        }
    }, []);

    return (
        <div className="Carte-Commentaires-Items">
            <p>{Auteur}</p>
            <p>{Etoiles}</p>
            <div className="Carte-Commentaires-Items-Texte" ref={texteRef}>
                <p>{Texte}</p>
                <div className="ellipsis" ref={ellipsisRef}>...</div>
            </div>

        </div>
    );
};

export default CommentairesItems;
