import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Analyse Financière Professionnelle
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Optimisez la gestion financière de votre entreprise avec notre outil d'analyse complet
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/saisie">
              <Button size="lg">
                Commencer l'analyse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/bilans">
              <Button variant="outline" size="lg">
                Voir les bilans existants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}