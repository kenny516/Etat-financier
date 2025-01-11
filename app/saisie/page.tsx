"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FinancialDataForm } from "@/components/financial-data-form";

const currentYear = new Date().getFullYear();

export const financialSchema = z.object({
    company: z.string().min(2, "Le nom de l'entreprise est requis"),
    year: z.number().min(currentYear - 1).max(currentYear),
    // Actifs
    assets: z.array(z.object({
        label: z.string().min(1, "Le libellé est requis"),
        amount: z.number().min(0, "Le montant doit être positif"),
        type: z.enum(["cash", "receivable", "inventory", "fixed"])
    })),
    // Passifs
    liabilities: z.array(z.object({
        label: z.string().min(1, "Le libellé est requis"),
        amount: z.number().min(0, "Le montant doit être positif"),
        type: z.enum(["payable", "shortTerm", "longTerm", "equity"])
    })),
    // Compte de résultat
    revenue: z.number().min(0),
    expenses: z.number().min(0),
});

export type FinancialFormData = z.infer<typeof financialSchema>;

export default function SaisiePage() {
    const form = useForm<FinancialFormData>({
        resolver: zodResolver(financialSchema),
        defaultValues: {
            year: currentYear,
            assets: [
                { label: "Compte bancaire", amount: 0, type: "cash" },
                { label: "Caisse", amount: 0, type: "cash" },
                { label: "Créances clients", amount: 0, type: "receivable" },
                { label: "Stock marchandises", amount: 0, type: "inventory" },
                { label: "Matériel", amount: 0, type: "fixed" },
            ],
            liabilities: [
                { label: "Dettes fournisseurs", amount: 0, type: "payable" },
                { label: "Découvert bancaire", amount: 0, type: "shortTerm" },
                { label: "Emprunt bancaire", amount: 0, type: "longTerm" },
                { label: "Capital social", amount: 0, type: "equity" },
            ],
            revenue: 0,
            expenses: 0,
        },
    });

    function onSubmit(data: FinancialFormData) {
        console.log(data);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Saisie des Données Financières</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FinancialDataForm form={form} />
                    <Button type="submit" size="lg">
                        Générer lanalyse
                    </Button>
                </form>
            </Form>
        </div>
    );
}