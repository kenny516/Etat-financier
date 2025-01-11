"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    question: "Comment saisir un nouveau bilan ?",
    answer: "Pour saisir un nouveau bilan, cliquez sur 'Saisie' dans le menu principal. Remplissez les informations de l'entreprise, puis saisissez les montants dans les onglets Actif, Passif et Compte de Résultat."
  },
  {
    question: "Comment interpréter les ratios financiers ?",
    answer: "Les ratios financiers sont des indicateurs de la santé financière de l'entreprise. Le ratio de liquidité doit être supérieur à 1, le ratio d'endettement inférieur à 1, et la rentabilité dépend du secteur d'activité."
  },
  {
    question: "Comment exporter mes analyses ?",
    answer: "Vous pouvez exporter vos analyses en PDF en cliquant sur le bouton 'Exporter' présent en haut de la page des bilans ou des analyses."
  }
];

export default function AidePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Centre d'Aide</h1>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Rechercher dans l'aide..."
          />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions Fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Besoin d'aide supplémentaire ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
              Notre équipe de support est disponible pour vous aider.
            </p>
            <Button variant="outline" className="w-full">
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}