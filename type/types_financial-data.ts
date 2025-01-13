import { z } from "zod";

export const rubriqueSchema = z.object({
    idRubrique: z.number(),
    montant: z.number().min(0, "Le montant doit être positif"),
    idTypeRubrique: z.number(),
    description: z.string()
});

export type Rubrique = z.infer<typeof rubriqueSchema>;

export const financialSchema = z.object({
    annee: z.number(),
    societe: z.number().int().positive(),
    bilan: z
        .object({
            actifs: z.array(rubriqueSchema),
            passifs: z.array(rubriqueSchema),
        })
        .refine((bilan) => {
            const totalActifs = bilan.actifs.reduce((sum, item) => sum + item.montant, 0);
            const totalPassifs = bilan.passifs.reduce((sum, item) => sum + item.montant, 0);
            return totalActifs === totalPassifs;
        }, {
            message: "Le total des montants des actifs doit être égal au total des montants des passifs",
            path: ["bilan"], // Chemin où l'erreur sera attachée
        }),
    resultat: z.object({
        produits: z.array(rubriqueSchema),
        charges: z.array(rubriqueSchema),
    }),
});

export type FinancialFormData = z.infer<typeof financialSchema>;
