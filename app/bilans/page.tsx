"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { FinancialDataSelectionForm } from "@/components/bilan/financial-data-bilan";
import { apiUrl, Societe } from "@/type/type";

interface FinancialData {
  company: string;
  year: number;
  assets: {
    current: {
      cash: number;
      receivables: number;
      inventory: number;
    };
    fixed: number;
  };
  liabilities: {
    current: {
      payables: number;
      shortTermDebt: number;
    };
    longTerm: number;
    equity: number;
  };
  income: {
    revenue: number;
    expenses: number;
  };
}

export default function BilansPage() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companiesList, setCompanies] = useState<Array<Societe>>([]);
  const [years, setYears] = useState<Array<number>>([]);

  const [company, setCompany] = useState<{ id: number; nom: string } >();

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
  }, [company]);

  const handleFormSubmit = async (data: { company: string; year: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<FinancialData>(`${apiUrl}/`, {
        params: { company: data.company, year: data.year },
      });
      setFinancialData(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données financières");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!financialData) {
    return (
      <div className="container mx-auto py-8">
        <FinancialDataSelectionForm
          onSubmit={handleFormSubmit}
          companies={companiesList}
					company={company}
					onCompanyChange={setCompany}
          years={years}
        />
        {loading && <p>Chargement des données...</p>}
        {error && <Alert variant="destructive">{error}</Alert>}
      </div>
    );
  }

  const totalAssets =
    financialData.assets.current.cash +
    financialData.assets.current.receivables +
    financialData.assets.current.inventory +
    financialData.assets.fixed;

  const totalLiabilities =
    financialData.liabilities.current.payables +
    financialData.liabilities.current.shortTermDebt +
    financialData.liabilities.longTerm +
    financialData.liabilities.equity;

  const isBalanced = totalAssets === totalLiabilities;

  // Calcul des ratios
  const currentRatio = (
    (financialData.assets.current.cash +
      financialData.assets.current.receivables +
      financialData.assets.current.inventory) /
    (financialData.liabilities.current.payables +
      financialData.liabilities.current.shortTermDebt)
  ).toFixed(2);

  const debtRatio = (
    (financialData.liabilities.current.payables +
      financialData.liabilities.current.shortTermDebt +
      financialData.liabilities.longTerm) /
    totalAssets
  ).toFixed(2);

  const profitMargin = (
    ((financialData.income.revenue - financialData.income.expenses) /
      financialData.income.revenue) *
    100
  ).toFixed(2);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Bilan Financier - {financialData.company} ({financialData.year})
        </h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exporter en PDF
        </Button>
      </div>

      {!isBalanced && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Déséquilibre détecté : Différence de{" "}
            {Math.abs(totalAssets - totalLiabilities)}€
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Actif</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Montant (€)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Trésorerie</TableCell>
                  <TableCell className="text-right">
                    {financialData.assets.current.cash}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Créances</TableCell>
                  <TableCell className="text-right">
                    {financialData.assets.current.receivables}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Stocks</TableCell>
                  <TableCell className="text-right">
                    {financialData.assets.current.inventory}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Immobilisations</TableCell>
                  <TableCell className="text-right">
                    {financialData.assets.fixed}
                  </TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{totalAssets}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passif</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Montant (€)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Dettes fournisseurs</TableCell>
                  <TableCell className="text-right">
                    {financialData.liabilities.current.payables}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Emprunts CT</TableCell>
                  <TableCell className="text-right">
                    {financialData.liabilities.current.shortTermDebt}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Emprunts LT</TableCell>
                  <TableCell className="text-right">
                    {financialData.liabilities.longTerm}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capitaux propres</TableCell>
                  <TableCell className="text-right">
                    {financialData.liabilities.equity}
                  </TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {totalLiabilities}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Compte de Résultat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead className="text-right">Montant (€)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Produits</TableCell>
                <TableCell className="text-right">
                  {financialData.income.revenue}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Charges</TableCell>
                <TableCell className="text-right">
                  {financialData.income.expenses}
                </TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Résultat</TableCell>
                <TableCell className="text-right">
                  {financialData.income.revenue - financialData.income.expenses}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyse des Ratios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ratio</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Interprétation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ratio de liquidité</TableCell>
                <TableCell>{currentRatio}</TableCell>
                <TableCell>
                  {Number(currentRatio) >= 2
                    ? "Bonne liquidité"
                    : "Attention à la liquidité"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ratio d endettement</TableCell>
                <TableCell>{debtRatio}</TableCell>
                <TableCell>
                  {Number(debtRatio) <= 0.5
                    ? "Endettement maîtrisé"
                    : "Endettement élevé"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Marge bénéficiaire</TableCell>
                <TableCell>{profitMargin}%</TableCell>
                <TableCell>
                  {Number(profitMargin) >= 10
                    ? "Bonne rentabilité"
                    : "Rentabilité à améliorer"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
