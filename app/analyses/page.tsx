"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FinancialDataSelectionForm } from "@/components/bilan/financial-data-bilan";
import { apiUrl, Societe } from "@/type/type";
import { AlertCircle } from 'lucide-react';

const ecriture = "http://localhost:8080/ecriture";
const conclusion = "http://localhost:8080/conclusion";

interface FinancialMetric {
  name: string;
  value: number | string;
  interpretation: string | null;
  percentage: boolean;
}

interface FinancialMetrics {
  ROA: FinancialMetric;
  liquiditeGenerale: FinancialMetric;
  levierFinancier: FinancialMetric;
  ROE: FinancialMetric;
  liquiditeReduit: FinancialMetric;
  margeNette: FinancialMetric;
  couverturesInterets: FinancialMetric;
  ratioEndettementGlobale: FinancialMetric;
}

interface Conseil {
  rentabilite: string;
  liquidite: string;
  endettement: string;
  solution: string;
}

interface FinancialData extends FinancialMetrics {
  conseils: Conseil;
}

export default function AnalysesPage() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companiesList, setCompanies] = useState<Array<Societe>>([]);
  const [years, setYears] = useState<Array<number>>([]);
  const [company, setCompany] = useState<{ id: number; nom: string }>({
    id: 0,
    nom: "",
  });
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get<Array<Societe>>(`${apiUrl}/societes`);
        setCompanies(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des sociétés");
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchYears = async () => {
      if (company.id) {
        try {
          const response = await axios.get<Array<number>>(`${apiUrl}/societes/${company.id}/years`);
          setYears(response.data);
        } catch (err) {
          setError("Erreur lors de la récupération des années");
          console.error(err);
        }
      }
    };

    fetchYears();
  }, [company]);

  const handleFormSubmit = async (data: { company: string; year: string }) => {
    setLoading(true);
    setError(null);
    setSelectedYear(parseInt(data.year));

    try {
      const [metricsResponse, conseilsResponse] = await Promise.all([
        axios.get<FinancialMetrics>(ecriture, { params: { idSociety: data.company, year: data.year } }),
        axios.get<Conseil>(conclusion, { params: { idSociety: data.company, year: data.year } })
      ]);

      setFinancialData({
        ...metricsResponse.data,
        conseils: conseilsResponse.data
      });
      
      console.log("Financial Data:", metricsResponse.data);
      console.log("Conseils:", conseilsResponse.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données financières");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (key: string, metric: FinancialMetric) => {
    const value = typeof metric.value === 'number' ? 
      metric.percentage ? 
        `${(metric.value * 100).toFixed(2)}%` : 
        metric.value.toFixed(2) 
      : metric.value;

    const isPositive = metric.interpretation === 'Bon' || metric.interpretation === 'Excellent';

    return (
      <Card key={key} className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg">{key}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{value}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Card>
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
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {financialData && !loading && (
        <>
         

          <Card>
            <CardHeader>
              <CardTitle>Conseils et Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {financialData.conseils ? (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Rentabilité</h3>
                    <p>{financialData.conseils.rentabilite}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Liquidité</h3>
                    <p>{financialData.conseils.liquidite}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Endettement</h3>
                    <p>{financialData.conseils.endettement}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Solution Proposée</h3>
                    <p>{financialData.conseils.solution}</p>
                  </div>
                </>
              ) : (
                <p>Aucun conseil disponible pour le moment.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

