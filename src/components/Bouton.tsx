import React from "react";
import { NavLink } from "react-router-dom";

type BoutonProps = {
  NomBtn: string;
  lien: string;

};


const Bouton: React.FC<BoutonProps> = ({ NomBtn, lien }) => {

  return (
    <NavLink to={lien}>
      <button >
        <span>
          <p>{NomBtn}</p>
        </span>
      </button>
    </NavLink>
  )
}

export default Bouton;