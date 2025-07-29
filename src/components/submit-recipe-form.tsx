
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, Phone, FileText, Image as ImageIcon, PlusCircle, ChefHat, Timer, Users, BookMarked } from "lucide-react";
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
import Image from "next/image";

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
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RecipeSchema>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      category: "",
      prepTime: 0,
      servings: 0,
      image: undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file);
    }
  };

  const onSubmit = async (values: RecipeSchema) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
            formData.append(key, value);
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
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
                name="image"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Foto do Prato</FormLabel>
                    <FormControl>
                    <div>
                        <Input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        />
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        >
                        <ImageIcon className="mr-2" />
                        Escolher Imagem
                        </Button>
                    </div>
                    </FormControl>
                    {imagePreview && (
                        <div className="mt-4">
                            <Image src={imagePreview} alt="Pré-visualização da receita" width={200} height={200} className="rounded-md object-cover"/>
                        </div>
                    )}
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

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredientes</FormLabel>
                  <FormDescription>Liste um ingrediente por linha.</FormDescription>
                  <FormControl>
                    <Textarea placeholder="2 xícaras de farinha de amêndoas&#10;1 xícara de açúcar de coco&#10;..." {...field} rows={8}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modo de Preparo</FormLabel>
                   <FormDescription>Descreva o passo a passo. Numere os passos se preferir.</FormDescription>
                  <FormControl>
                    <Textarea placeholder="1. Pré-aqueça o forno a 180°C.&#10;2. Em uma tigela grande, misture os ingredientes secos.&#10;..." {...field} rows={12}/>
                  </FormControl>
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
            <>
              <PlusCircle className="mr-2 h-5 w-5" /> Publicar Receita
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}