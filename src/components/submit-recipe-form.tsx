
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Loader2, PlusCircle, ChefHat, Timer, Users, BookMarked, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recipeSchema, type RecipeSchema } from "@/lib/schemas";
import { submitRecipe } from "@/app/actions";

const categories = [
    "Zero Lactose",
    "Sem Glúten",
    "Sobremesas",
    "Lanches",
    "Prato Principal",
    "Sopas e Caldos",
    "Frutos do Mar",
    "Básicos",
];

export function SubmitRecipeForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RecipeSchema>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ value: "" }],
      instructions: [{ value: "" }],
      category: "",
      prepTime: 0,
      servings: 0,
    },
  });

  const { fields: ingredients, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients"
  });

  const { fields: instructions, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions"
  });

  const onSubmit = async (values: RecipeSchema) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('prepTime', String(values.prepTime));
    formData.append('servings', String(values.servings));
    formData.append('category', values.category);
    
    values.ingredients.forEach(item => {
        formData.append('ingredients', item.value);
    });

    values.instructions.forEach(item => {
        formData.append('instructions', item.value);
    });

    try {
      const result = await submitRecipe(formData);
      
      toast({
        title: "Receita Enviada!",
        description: "Sua receita foi salva e será publicada em breve.",
      });

      // TODO: Futuramente, redirecionar para a página da receita.
      // Por enquanto, redireciona para o dashboard.
      router.push(`/dashboard`);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao enviar receita",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-6 h-6" /> Detalhes da Receita
            </CardTitle>
            <CardDescription>
              Capriche nas informações para que todos possam replicar sua criação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Receita</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Bolo de Cenoura Fofinho" {...field} />
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
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva sua receita em poucas palavras. Qual é a história por trás dela?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tempo de Preparo (minutos)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="ex: 30" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} className="pl-8"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Rendimento (porções)</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="ex: 4" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} className="pl-8"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Categoria</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Selecione uma categoria" className="pl-8"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
              <FormLabel>Ingredientes</FormLabel>
              <FormDescription>Liste um ingrediente de cada vez.</FormDescription>
              <div className="space-y-2 mt-2">
                {ingredients.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`ingredients.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                              <FormControl>
                                <Input placeholder="ex: 2 xícaras de farinha de amêndoas" {...field} />
                              </FormControl>
                              {ingredients.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendIngredient({ value: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Ingrediente
              </Button>
            </div>

            <div>
              <FormLabel>Modo de Preparo</FormLabel>
              <FormDescription>Descreva o passo a passo. Um passo de cada vez.</FormDescription>
               <div className="space-y-4 mt-2">
                {instructions.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`instructions.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-lg text-primary">{index + 1}.</span>
                           <FormControl>
                              <Textarea placeholder="ex: Pré-aqueça o forno a 180°C." {...field} rows={3}/>
                           </FormControl>
                            {instructions.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendInstruction({ value: "" })}>
                 <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Passo
              </Button>
            </div>

          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando Receita...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" /> Publicar Receita
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
