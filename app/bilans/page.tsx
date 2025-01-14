"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from 'lucide-react';
import { FinancialDataSelectionForm } from "@/components/bilan/financial-data-bilan";
import { apiUrl, Societe } from "@/type/type";

interface FinancialData {
  name: string;
  value: number;
  sousCategories: Array<{
    name: string;
    value: number;
    typeRubriques: Array<{
      name: string;
      value: number;
      rubriques: Array<{
        id: number;
        name: string;
        value: number;
      }>;
    }>;
  }>;
}

export default function BilansPage() {
  const [financialData, setFinancialData] = useState<Array<FinancialData> | []>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companiesList, setCompanies] = useState<Array<Societe>>([]);
  const [years, setYears] = useState<Array<number>>([]);

  const [company, setCompany] = useState<{ id: number; nom: string;}>({
    id: 0,
    nom: ""
	});
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get<Array<Societe>>(
          `${apiUrl}/societes`
        );
        setCompanies(companiesResponse.data);
      } catch (err) {
        setError("Erreur lors de la récupération des données initiales");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get<Array<number>>(
          `${apiUrl}/societes/${company.id}/years`
        );
        setYears(companiesResponse.data);
      } catch (err) {
        setError("Erreur lors de la récupération des données initiales");
        console.error(err);
      }
    };

    fetchData();
  }, [company]);

  const handleFormSubmit = async (data: { company: string; year: string }) => {
    setYear(parseInt(data.year));
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Array<FinancialData>>(
        `${apiUrl}/bilan`,
        {
          params: { idSociety: data.company, year: data.year },
        }
      );
      setFinancialData(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données financières");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num;
  };

  const renderFinancialTable = (category: FinancialData) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[50%]">{category.name}</TableHead>
          <TableHead className="text-right">Note</TableHead>
          <TableHead className="text-right">N</TableHead>
          <TableHead className="text-right">N-1</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {category.sousCategories.map((sousCategory) => (
          <React.Fragment key={sousCategory.name}>
            <TableRow className="bg-muted/20">
              <TableCell colSpan={4} className="font-semibold pl-4">
                {sousCategory.name}
              </TableCell>
            </TableRow>

            {sousCategory.typeRubriques
              .filter((typeRubrique) => typeRubrique.value !== 0)
              .map((typeRubrique) => (
                <React.Fragment key={typeRubrique.name}>
                  <TableRow>
                    <TableCell className="font-medium pl-8">
                      {typeRubrique.name}
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                    <TableCell className="text-right">
                      {formatNumber(typeRubrique.value)}
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>

                  {typeRubrique.rubriques
                    .filter((rubrique) => rubrique.value !== 0)
                    .map((rubrique) => (
                      <TableRow key={rubrique.id}>
                        <TableCell className="pl-12">
                          {rubrique.name}
                        </TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">
                          {formatNumber(rubrique.value)}
                        </TableCell>
                        <TableCell className="text-right">-</TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}

            <TableRow className="border-t">
              <TableCell className="font-semibold pl-4">
                Total {sousCategory.name}
              </TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right font-semibold">
                {formatNumber(sousCategory.value)}
              </TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
          </React.Fragment>
        ))}

        <TableRow className="border-t-2 border-primary">
          <TableCell className="font-bold">
            Total {category.name}
          </TableCell>
          <TableCell className="text-right"></TableCell>
          <TableCell className="text-right font-bold">
            {formatNumber(category.value)}
          </TableCell>
          <TableCell className="text-right">-</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const totalAssets = financialData
    .find((category) => category.name === "Actif")?.value || 0;

  const totalLiabilities = financialData
    .find((category) => category.name === "Capitaux propres et passifs")?.value || 0;

  const isBalanced = totalAssets === totalLiabilities;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <FinancialDataSelectionForm
            onSubmit={handleFormSubmit}
            companies={companiesList}
            onCompanyChange={setCompany}
            years={years}
          />
        </CardContent>
      </Card>

      {loading && (
        <Card className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {financialData.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bilan Financier - {company.nom}
            </h1>
            <div className="px-4 py-2 bg-primary/10 rounded-lg">
              <span className="font-semibold text-primary">
                Exercice {year}
              </span>
            </div>
          </div>

          {!isBalanced && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Déséquilibre détecté : {formatNumber(Math.abs(totalAssets - totalLiabilities))}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {financialData.map((category) => (
              <Card key={category.name} className="overflow-hidden">
                <CardContent className="p-0">
                  {renderFinancialTable(category)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

