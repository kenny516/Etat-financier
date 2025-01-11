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
import { AlertCircle } from "lucide-react";
import { FinancialDataSelectionForm } from "@/components/bilan/financial-data-bilan";
import { apiUrl, Societe } from "@/type/type";

interface FinancialData {
  charges: Array<{
    typeRubrique: string;
    montant: number;
  }>;
  active: Array<{
    typeRubrique: string;
    montant: number;
  }>;
  passive: Array<{
    typeRubrique: string;
    montant: number;
  }>;
  products: Array<{
    typeRubrique: string;
    montant: number;
  }>;
}

export default function BilansPage() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companiesList, setCompanies] = useState<Array<Societe>>([]);
  const [years, setYears] = useState<Array<number>>([]);

  const [company, setCompany] = useState<{ id: number; nom: string }>({
    id: 0,
    nom: "",
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
        console.log(companiesResponse.data);
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
      const response = await axios.get<FinancialData>(`${apiUrl}/bilan`, {
        params: { societe: data.company, annee: data.year },
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
      <div className="container mx-auto p-8">
        <FinancialDataSelectionForm
          onSubmit={handleFormSubmit}
          companies={companiesList}
          onCompanyChange={setCompany}
          years={years}
        />
        {loading && <p>Chargement des données...</p>}
        {error && <Alert variant="destructive">{error}</Alert>}
      </div>
    );
  }

  const totalAssets = financialData.active.reduce(
    (sum, item) => sum + item.montant,
    0
  );
  const totalLiabilities = financialData.passive.reduce(
    (sum, item) => sum + item.montant,
    0
  );
  const isBalanced = totalAssets === totalLiabilities;

  return (
    <>
      <div className="container mx-auto p-8">
        <FinancialDataSelectionForm
          onSubmit={handleFormSubmit}
          companies={companiesList}
          onCompanyChange={setCompany}
          years={years}
        />
        {loading && <p>Chargement des données...</p>}
        {error && <Alert variant="destructive">{error}</Alert>}
      </div>
      <div className="container mx-auto py-8 px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold pl-1">
            Bilan Financier - {company.nom} ({year})
          </h1>
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
                  {financialData.active.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.typeRubrique}</TableCell>
                      <TableCell className="text-right">
                        {item.montant}
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {financialData.passive.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.typeRubrique}</TableCell>
                      <TableCell className="text-right">
                        {item.montant}
                      </TableCell>
                    </TableRow>
                  ))}
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
						<div className="grid grid-cols-2 gap-6">
							<div>
							<h2 className="text-xl font-bold mb-4">Produits</h2>
							<Table>
								<TableHeader>
								<TableRow>
									<TableHead>Poste</TableHead>
									<TableHead className="text-right">Montant (€)</TableHead>
								</TableRow>
								</TableHeader>
								<TableBody>
								{financialData.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.typeRubrique}</TableCell>
                    <TableCell className="text-right">{item.montant}</TableCell>
                  </TableRow>
								))}
								<TableRow className="font-bold">
									<TableCell>Total Produits</TableCell>
									<TableCell className="text-right">
									{financialData.products.reduce((sum, item) => sum + item.montant, 0)}
									</TableCell>
								</TableRow>
								</TableBody>
							</Table>
							</div>
							<div>
							<h2 className="text-xl font-bold mb-4">Charges</h2>
							<Table>
								<TableHeader>
								<TableRow>
									<TableHead>Poste</TableHead>
									<TableHead className="text-right">Montant (€)</TableHead>
								</TableRow>
								</TableHeader>
								<TableBody>
								{financialData.charges.map((item, index) => (
									<TableRow key={index}>
									<TableCell>{item.typeRubrique}</TableCell>
									<TableCell className="text-right">{item.montant}</TableCell>
									</TableRow>
								))}
								<TableRow className="font-bold">
									<TableCell>Total Charges</TableCell>
									<TableCell className="text-right">
									{financialData.charges.reduce((sum, item) => sum + item.montant, 0)}
									</TableCell>
								</TableRow>
								</TableBody>
							</Table>
							</div>
						</div>
						<div className="mt-6">
							<Table>
							<TableBody>
								<TableRow className="font-bold">
								<TableCell className="text-xl font-bold">Résultat</TableCell>
								<TableCell className="text-right">
									{financialData.products.reduce((sum, item) => sum + item.montant, 0) -
									financialData.charges.reduce((sum, item) => sum + item.montant, 0)}
								</TableCell>
								</TableRow>
							</TableBody>
							</Table>
						</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
