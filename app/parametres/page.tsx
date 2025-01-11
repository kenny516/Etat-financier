"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw } from "lucide-react";

export default function ParametresPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Préférences Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode sombre</Label>
                <p className="text-sm text-muted-foreground">
                  Activer le thème sombre pour l'interface
                </p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Format des montants</Label>
              <div className="flex gap-4">
                <Input defaultValue="EUR" className="w-24" />
                <Input defaultValue="2" type="number" className="w-24" />
                <span className="flex items-center text-muted-foreground">décimales</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sauvegarde et Synchronisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement les modifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder maintenant
              </Button>
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}