'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { apiUrl } from '@/type/type'
import { Progress } from './ui/progress'

const formSchema = z.object({
    idSociety: z.number(),
    idCategory: z.number(),
    idSubCategory: z.number(),
    idPost: z.number(),
    idRubrique: z.number(),
    montant: z.number().min(0, "Le montant doit être positif"),
    description: z.string().min(1, "La description est requise"),
    date: z.string().min(1, "La date est requise"),
})

type FormData = z.infer<typeof formSchema>

interface Societe {
    id: number
    nom: string
}

interface Category {
    id: number
    nom: string
}

interface SubCategory {
    id: number
    nom: string
    idCategorie: number
}

interface Post {
    idTypeRubrique: number
    nom: string
    idSousCategorie: number
}

interface Account {
    idRubrique: number
    libelle: string
    code: string
    idTypeRubrique: number
}

const steps = [
    { title: "Société", fields: ["idSociety"] },
    { title: "Catégorie", fields: ["idCategory", "idSubCategory"] },
    { title: "Poste", fields: ["idPost", "idRubrique"] },
    { title: "Détails", fields: ["montant", "description", "date"] },
]

export function IntuitiveFinancialEntryForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [societes, setSocietes] = useState<Societe[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idSociety: 0,
            idCategory: 0,
            idSubCategory: 0,
            idPost: 0,
            idRubrique: 0,
            montant: 0,
            description: '',
            date: '',
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [societesRes, categoriesRes, subCategoriesRes, postsRes, accountsRes] = await Promise.all([
                    fetch(`${apiUrl}/societes`),
                    fetch(`${apiUrl}/categories`),
                    fetch(`${apiUrl}/sous-categories`),
                    fetch(`${apiUrl}/types-rubrique`),
                    fetch(`${apiUrl}/rubriques`),
                ])

                const [societes, categories, subCategories, posts, accounts] = await Promise.all([
                    societesRes.json(),
                    categoriesRes.json(),
                    subCategoriesRes.json(),
                    postsRes.json(),
                    accountsRes.json(),
                ])

                setSocietes(societes)
                setCategories(categories)
                setSubCategories(subCategories)
                setPosts(posts)
                setAccounts(accounts)
            } catch (error) {
                console.error('Error fetching data:', error)
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les données. Veuillez réessayer.",
                    variant: "destructive",
                })
            }
        }

        fetchData()
    }, [])

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        console.log(data);
        try {
            const response = await fetch(`${apiUrl}/ecriture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    title: "Succès",
                    description: "Écriture ajoutée avec succès",
                })
                form.reset()
                setCurrentStep(0)
            } else {
                throw new Error('Erreur lors de l\'ajout de l\'écriture')
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout de l'écriture",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <FormField
                        control={form.control}
                        name="idSociety"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Société</FormLabel>
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une société" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {societes.map((society) => (
                                            <SelectItem key={society.id} value={society.id.toString()}>
                                                {society.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )
            case 1:
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="idCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catégorie</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une catégorie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.nom}
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
                            name="idSubCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sous-catégorie</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subCategories
                                                .filter((subCategory) => subCategory.idCategorie === form.watch('idCategory'))
                                                .map((subCategory) => (
                                                    <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                                                        {subCategory.nom}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )
            case 2:
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="idPost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Poste</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un poste" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {posts
                                                .filter((post) => post.idSousCategorie === form.watch('idSubCategory'))
                                                .map((post) => (
                                                    <SelectItem key={post.idTypeRubrique} value={post.idTypeRubrique.toString()}>
                                                        {post.nom}
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
                            name="idRubrique"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compte</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un compte" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts
                                                .filter((account) => account.idTypeRubrique === form.watch('idPost'))
                                                .map((account) => (
                                                    <SelectItem key={account.idRubrique} value={account.idRubrique.toString()}>
                                                        {`${account.code} - ${account.libelle}`}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )
            case 3:
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="montant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )
            default:
                return null
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Ajout décriture</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="mb-4">
                            <Progress value={(currentStep + 1) * 25} className="w-full" />
                        </div>
                        <h2 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h2>
                        {renderStepContent(currentStep)}
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                </Button>
                {currentStep === steps.length - 1 ? (
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Terminer
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={nextStep}
                    >
                        Suivant <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

