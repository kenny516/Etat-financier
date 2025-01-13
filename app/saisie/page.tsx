"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { financialSchema, FinancialFormData } from "@/type/types_financial-data";
import axios from "axios";
import { apiUrl, Rubrique, Societe, TypeRubrique } from "@/type/type";
import { FinancialDataForm } from "@/components/financial-data-form";

export default function SaisiePage() {
    const [companies, setCompanies] = useState<Societe[]>([]);
    const [rubriqueTypes, setRubriqueTypes] = useState<TypeRubrique[]>([]);
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);

    useEffect(() => {
        // Fetch companies and rubrique types
        const fetchData = async () => {
            try {
                const [companiesResponse, typesResponse, rubriqueResponse] = await Promise.all([
                    axios.get(apiUrl + '/societes'),
                    axios.get(apiUrl + '/types-rubrique'),
                    axios.get(apiUrl + '/rubriques'),
                ]);
                setCompanies(companiesResponse.data);
                setRubriqueTypes(typesResponse.data);
                setRubriques(rubriqueResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const form = useForm<FinancialFormData>({
        resolver: zodResolver(financialSchema),
        defaultValues: {
            annee: new Date().getFullYear(),
            societe: 0,
            bilan: {
                actifs: [],
                passifs: []
            },
            resultat: {
                produits: [],
                charges: []
            }
        },
    });

    async function onSubmit(data: FinancialFormData) {
        console.log(data);
        try {
            const response = await fetch(apiUrl + '/bilan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log("Data submitted successfully");
                // Handle success (e.g., show a success message, redirect, etc.)
            } else {
                console.error("Error submitting data");
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            // Handle error (e.g., show an error message)
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 ml-6">Saisie des Données Financières</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FinancialDataForm form={form} companies={companies} rubriqueTypes={rubriqueTypes}
                        rubriques={rubriques}
                    />
                </form>
            </Form>
        </div>
    );
}
