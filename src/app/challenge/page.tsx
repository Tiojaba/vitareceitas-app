
'use client';

import React, { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle, Flag, Leaf, Lock, Sparkles } from "lucide-react";
import Link from 'next/link';

const challengeDays = [
    { id: 'day1', title: 'Dia 1: O Começo de Tudo', description: 'Experimente um café da manhã 100% sem lactose. Que tal uma vitamina de frutas com leite de amêndoas ou um pão na chapa com margarina vegetal?', unlocked: true },
    { id: 'day2', title: 'Dia 2: Detetive de Rótulos', description: 'Vá ao supermercado (ou à sua despensa) e encontre 3 produtos que você não sabia que continham lactose. Use nosso guia "Desvendando Rótulos"!', unlocked: false },
    { id: 'day3', title: 'Dia 3: Mestre Cuca Zero Lactose', description: 'Prepare uma receita de prato principal do nosso site para o almoço ou jantar. Compartilhe uma foto na comunidade!', unlocked: false },
    { id: 'day4', title: 'Dia 4: Doce Sem Culpa', description: 'Faça uma sobremesa zero lactose. O mousse de chocolate com abacate é uma ótima pedida!', unlocked: false },
    { id: 'day5', title: 'Dia 5: Lanche Inteligente', description: 'Prepare um lanche da tarde sem lactose. O nosso pão de queijo vegano é sucesso garantido.', unlocked: false },
    { id: 'day6', title: 'Dia 6: Compartilhando Sabores', description: 'Convide um amigo ou familiar para provar uma de suas criações sem lactose. Veja a reação deles!', unlocked: false },
    { id: 'day7', title: 'Dia 7: Novo Estilo de Vida', description: 'Parabéns! Reflita sobre como se sentiu durante a semana e planeje como incorporar esses novos hábitos no seu dia a dia.', unlocked: false },
];


export default function ChallengePage() {
    const [completedDays, setCompletedDays] = useState<string[]>([]);
    
    const handleCheckboxChange = (dayId: string) => {
        setCompletedDays(prev => 
            prev.includes(dayId)
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    const progressPercentage = useMemo(() => {
        return (completedDays.length / challengeDays.length) * 100;
    }, [completedDays]);

    const unlockedDays = useMemo(() => {
        const unlocked = ['day1'];
        for (let i = 0; i < challengeDays.length - 1; i++) {
            if (completedDays.includes(challengeDays[i].id)) {
                unlocked.push(challengeDays[i+1].id);
            } else {
                break;
            }
        }
        return unlocked;
    }, [completedDays]);


    return (
        <div className="container mx-auto max-w-3xl py-8 sm:py-12 px-4">
            <header className="mb-10 text-center">
                <Flag className="h-20 w-20 text-primary mx-auto mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Desafio 7 Dias Sem Lactose
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Complete uma tarefa por dia e descubra um mundo de novos sabores!
                </p>
            </header>

            <main className="space-y-4">
                 <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Seu Progresso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={progressPercentage} className="w-full" />
                        <p className="text-center mt-2 text-sm text-muted-foreground">{completedDays.length} de {challengeDays.length} dias completos.</p>
                    </CardContent>
                </Card>

                 <Accordion type="single" collapsible defaultValue="day1" className="w-full">
                    {challengeDays.map((day) => {
                        const isUnlocked = unlockedDays.includes(day.id);
                        const isCompleted = completedDays.includes(day.id);

                        return (
                             <AccordionItem value={day.id} key={day.id} disabled={!isUnlocked}>
                                <AccordionTrigger className={`text-lg font-headline ${!isUnlocked ? 'text-muted-foreground' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        {isUnlocked ? (
                                            isCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Leaf className="h-6 w-6 text-primary" />
                                        ) : (
                                            <Lock className="h-6 w-6 text-muted-foreground" />
                                        )}
                                        {day.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 px-2">
                                    <p className="text-base text-muted-foreground">{day.description}</p>
                                    <div className="flex items-center space-x-3 rounded-md border p-4 bg-muted/50">
                                        <Checkbox
                                            id={`check-${day.id}`}
                                            checked={isCompleted}
                                            onCheckedChange={() => handleCheckboxChange(day.id)}
                                            disabled={!isUnlocked}
                                        />
                                        <label
                                            htmlFor={`check-${day.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Marcar como concluído
                                        </label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>

                {progressPercentage === 100 && (
                    <Card className="mt-10 text-center bg-accent/50">
                        <CardHeader>
                            <Award className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                            <CardTitle className="font-headline text-3xl text-primary">Parabéns, Você Conseguiu!</CardTitle>
                             <CardDescription className="text-lg">
                                Você completou o Desafio 7 Dias Sem Lactose!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Você deu um passo incrível para uma vida com mais sabor e bem-estar. Continue explorando nossas receitas e dicas!</p>
                            <Button asChild className="mt-6">
                                <Link href="/dashboard"><Sparkles className="mr-2 h-4 w-4" /> Voltar ao Início</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
