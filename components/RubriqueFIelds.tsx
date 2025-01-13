import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, DollarSign } from 'lucide-react'

interface RubriqueFieldsProps {
    fields: Record<"id", string>[]
    name: "bilan.actifs" | "bilan.passifs" | "resultat.produits" | "resultat.charges"
    remove: (index: number) => void
    idCategorie: number
    rubriqueTypes: { idTypeRubrique: number; nom: string; idCategorie: number }[]
    rubriques: { idRubrique: number; libelle: string; idTypeRubrique: number }[]
}

export function RubriqueFields({ fields, name, remove, idCategorie, rubriqueTypes, rubriques }: RubriqueFieldsProps) {
    const { control, watch } = useFormContext()

    return fields.map((field, index) => (
        <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg">
            <FormField
                control={control}
                name={`${name}.${index}.idTypeRubrique`}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Type de Rubrique</FormLabel>
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
            <FormField
                control={control}
                name={`${name}.${index}.idRubrique`}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Rubrique</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une rubrique" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {rubriques
                                    .filter((rubrique) => rubrique.idTypeRubrique === watch(`${name}.${index}.idTypeRubrique`))
                                    .map((rubrique) => (
                                        <SelectItem key={rubrique.idRubrique} value={rubrique.idRubrique.toString()}>
                                            {rubrique.libelle}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`${name}.${index}.montant`}
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
                                        const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
                                        field.onChange(value)
                                    }}
                                    className="pl-10 border-2"
                                />
                            </div>
                        </FormControl>
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
    ))
}

