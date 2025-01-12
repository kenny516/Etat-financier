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
    idRubrique: number;
    libelle: string;
    idTypeRubrique: number;
}

export interface Ecriture {
    montant: number;
    idRubrique?: number;
    idTypeRubrique: number; // For the display
}

export interface Bilan {
    actifs: Ecriture[];
    passifs: Ecriture[];
}

export interface Resultat {
    produits: Ecriture[];
    charges: Ecriture[];
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

export interface Societe {
    id: number;
    nom: string;
}

export interface FinancialStatusDetail {
    name: string;
    percentage: boolean;
    interpretation: string;
    value: number;
}

export interface FinancialStatus {
    ROA: FinancialStatusDetail;
    liquiditeGenerale: FinancialStatusDetail;
    ROE: FinancialStatusDetail;
    liquiditeReduit: FinancialStatusDetail;
    margeNette: FinancialStatusDetail;
    couverturesInterets: FinancialStatusDetail;
    ratioEndettementGlobale: FinancialStatusDetail;
}
