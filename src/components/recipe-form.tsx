
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Utensils, BookText, CookingPot, Layers, Image as ImageIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recipeSchema, type RecipeFormValues } from "@/lib/schemas";
import { useAuth } from "@/hooks/use-auth";
import { submitRecipe } from "@/app/actions";

const categories = [
  { name: 'Pratos Principais', value: 'pratos-principais' },
  { name: 'Sobremesas', value: 'sobremesas' },
  { name: 'Sem Glúten', value: 'sem-gluten' },
  { name: 'Sopas e Caldos', value: 'sopas' },
  { name: 'Saladas', value: 'saladas' },
  { name: 'Lanches', value: 'lanches' },
  { name: 'Biscoitos & Bolos', value: 'biscoitos-bolos' },
  { name: 'Café da Manhã', value: 'cafe-da-manha' },
];

export function RecipeForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      category: undefined,
      photoUrl: "",
    },
  });

  const onSubmit = async (values: RecipeFormValues) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Você precisa estar logado para enviar uma receita.",
        });
        return;
    }

    setIsSubmitting(true);
    try {
      await submitRecipe(user.uid, values);
      
      toast({
        title: "Receita Enviada!",
        description: "Obrigado por compartilhar sua receita com a comunidade.",
      });

      router.push('/profile');

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao enviar receita",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-6 h-6 text-primary" /> Detalhes da Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Receita</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: Bolo de Chocolate sem Lactose" {...field} />
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
                    <FormLabel>Breve Descrição</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Descreva sua receita em poucas palavras..." {...field} />
                    </FormControl>
                     <FormDescription>
                        Esta descrição aparecerá nos cards da receita.
                    </FormDescription>
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
                          <SelectValue placeholder="Selecione a categoria da sua receita" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Foto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://exemplo.com/foto-da-receita.jpg" {...field} className="pl-8"/>
                      </div>
                    </FormControl>
                    <FormDescription>
                        Por enquanto, use uma URL de uma imagem já existente na internet. Em breve, teremos upload de arquivos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CookingPot className="w-6 h-6 text-primary" /> Modo de Preparo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredientes</FormLabel>
                      <FormControl>
                          <Textarea rows={8} placeholder="Liste um ingrediente por linha..." {...field} />
                      </FormControl>
                       <FormDescription>
                          Seja claro nas quantidades. Ex: 1 xícara de farinha de amêndoas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruções</FormLabel>
                      <FormControl>
                          <Textarea rows={8} placeholder="Descreva o passo a passo do preparo..." {...field} />
                      </FormControl>
                      <FormDescription>
                          Numere os passos para facilitar o entendimento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando Receita...
            </>
          ) : (
            `Publicar Receita`
          )}
        </Button>
      </form>
    </Form>
  );
}
