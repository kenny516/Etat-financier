export const apiUrl = 'http://localhost:8080';

export type Societe = {
    id: number,
    nom: string
};
export interface Categorie {
    idCategorie: number;
    nom: string;
}

export interface TypeRubrique {
    idTypeRubrique: number;
    nom: string;
    idCategorie: number;
}

export interface Rubrique {
    libelle: string;
    montant: number;
    idTypeRubrique: number;
}

export interface Bilan {
    actifs: Rubrique[];
    passifs: Rubrique[];
}

export interface Resultat {
    produits: Rubrique[];
    charges: Rubrique[];
}

export interface DisplayRubrique {
    typeRubrique: string;
    montant: number;
}

export interface DisplayBalance {
    charges: DisplayRubrique[];
    active: DisplayRubrique[];
    passive: DisplayRubrique[];
    products: DisplayRubrique[];
}
