import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, DollarSign, Building, CalendarDays } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinancialFormData } from "@/type/types_financial-data";
import { Societe, TypeRubrique } from "@/type/type";

interface FinancialDataFormProps {
    form: UseFormReturn<FinancialFormData>;
    companies: Societe[];
    rubriqueTypes: TypeRubrique[];
}

export function FinancialDataForm({ form, companies, rubriqueTypes }: FinancialDataFormProps) {
    const { fields: actifFields, append: appendActif, remove: removeActif } =
        useFieldArray({ control: form.control, name: "bilan.actifs" });

    const { fields: passifFields, append: appendPassif, remove: removePassif } =
        useFieldArray({ control: form.control, name: "bilan.passifs" });

    const { fields: produitFields, append: appendProduit, remove: removeProduit } =
        useFieldArray({ control: form.control, name: "resultat.produits" });

    const { fields: chargeFields, append: appendCharge, remove: removeCharge } =
        useFieldArray({ control: form.control, name: "resultat.charges" });

    const totalActifs = actifFields.reduce((sum, field, index) => sum + (form.watch(`bilan.actifs.${index}.montant`) || 0), 0);
    const totalPassifs = passifFields.reduce((sum, field, index) => sum + (form.watch(`bilan.passifs.${index}.montant`) || 0), 0);
    const totalProduits = produitFields.reduce((sum, field, index) => sum + (form.watch(`resultat.produits.${index}.montant`) || 0), 0);
    const totalCharges = chargeFields.reduce((sum, field, index) => sum + (form.watch(`resultat.charges.${index}.montant`) || 0), 0);

    const renderRubriqueFields = (
        fields: Record<"id", string>[],
        name: "bilan.actifs" | "bilan.passifs" | "resultat.produits" | "resultat.charges",
        remove: (index: number) => void,
        idCategorie: number
    ) => {
        return fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg">
                <FormField
                    control={form.control}
                    name={`${name}.${index}.libelle` as any}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Libellé</FormLabel>
                            <FormControl>
                                <Input {...field} className="border-2" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${name}.${index}.montant` as any}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Montant</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                            field.onChange(value);
                                        }}
                                        className="pl-10 border-2"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${name}.${index}.idTypeRubrique` as any}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {rubriqueTypes
                                        .filter((type) => type.idCategorie === idCategorie)
                                        .map((type) => (
                                            <SelectItem key={type.idTypeRubrique} value={type.idTypeRubrique.toString()}>
                                                {type.nom}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ));
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-2xl flex items-center">
                        <Building className="mr-2" /> Informations Générales
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <FormField
                        control={form.control}
                        name="societe"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Société</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une société" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id.toString()}>
                                                {company.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="annee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Année</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            className="pl-10 border-2"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-end">
                        <Button type="submit" className="w-full">
                            Générer Analyse
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="bilan" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 gap-4">
                    <TabsTrigger value="bilan" className="text-lg py-2">Bilan</TabsTrigger>
                    <TabsTrigger value="resultat" className="text-lg py-2">Compte de Résultat</TabsTrigger>
                </TabsList>

                <TabsContent value="bilan">
                    <Card className="shadow-lg">
                        <CardHeader className="bg-green-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-green-800">Actifs</CardTitle>
                            <Button
                                type="button"
                                onClick={() => appendActif({ libelle: "", montant: 0, idTypeRubrique: 0 })}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter un actif
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {renderRubriqueFields(actifFields, "bilan.actifs", removeActif, 3)}
                            <p className="font-bold text-green-600">Total Actifs : {totalActifs}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg mt-6">
                        <CardHeader className="bg-blue-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-blue-800">Passifs</CardTitle>
                            <Button
                                type="button"
                                onClick={() => appendPassif({ libelle: "", montant: 0, idTypeRubrique: 0 })}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter un passif
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {renderRubriqueFields(passifFields, "bilan.passifs", removePassif, 4)}
                            <p className="font-bold text-blue-600">Total Passifs : {totalPassifs}</p>
                            {totalActifs !== totalPassifs && (
                                <p className="text-red-500 font-bold">Erreur : Total Actifs et Passifs ne sont pas égaux.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="resultat">
                    <Card className="shadow-lg">
                        <CardHeader className="bg-yellow-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-yellow-800">Produits</CardTitle>
                            <Button
                                type="button"
                                onClick={() => appendProduit({ libelle: "", montant: 0, idTypeRubrique: 0 })}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter un produit
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {renderRubriqueFields(produitFields, "resultat.produits", removeProduit, 2)}
                            <p className="font-bold text-yellow-600">Total Produits : {totalProduits}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg mt-6">
                        <CardHeader className="bg-red-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-red-800">Charges</CardTitle>
                            <Button
                                type="button"
                                onClick={() => appendCharge({ libelle: "", montant: 0, idTypeRubrique: 0 })}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter une charge
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {renderRubriqueFields(chargeFields, "resultat.charges", removeCharge, 1)}
                            <p className="font-bold text-red-600">Total Charges : {totalCharges}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
