"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AnalysesPage() {
  // Exemple de données d'analyse - à remplacer par les données réelles
  const analysis = {
    ratios: {
      liquidite: 1.5,
      solvabilite: 0.8,
      rentabilite: 12.5,
      autonomie: 0.45
    },
    recommendations: [
      {
        type: "success",
        message: "Bonne liquidité générale, capacité à honorer les dettes court terme"
      },
      {
        type: "warning",
        message: "Ratio d'endettement légèrement élevé, surveiller les nouvelles dettes"
      },
      {
        type: "info",
        message: "Rentabilité satisfaisante, maintenir la marge actuelle"
      }
    ]
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analyse Financière</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Ratios Clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <dt className="text-sm font-medium text-gray-600">Ratio de liquidité</dt>
                <dd className="text-lg font-semibold">{analysis.ratios.liquidite}</dd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <dt className="text-sm font-medium text-gray-600">Ratio de solvabilité</dt>
                <dd className="text-lg font-semibold">{analysis.ratios.solvabilite}</dd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <dt className="text-sm font-medium text-gray-600">Rentabilité (%)</dt>
                <dd className="text-lg font-semibold">{analysis.ratios.rentabilite}%</dd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <dt className="text-sm font-medium text-gray-600">Autonomie financière</dt>
                <dd className="text-lg font-semibold">{analysis.ratios.autonomie}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <Alert key={index} variant={rec.type === "warning" ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{rec.message}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}