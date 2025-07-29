'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sprout, Loader2 } from 'lucide-react';

const sampleUsers = [
  { id: 'user1', name: 'Ana Silva', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user2', name: 'Bruno Costa', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user3', name: 'Carla Dias', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user4', name: 'Daniel Alves', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user5', name: 'Eduarda Lima', avatarUrl: 'https://placehold.co/100x100.png' },
];

const sampleRecipes = [
  { title: 'Bolo de Chocolate Fofinho', category: 'Doces', authorIndex: 0 },
  { title: 'Frango Assado com Batatas', category: 'Salgados', authorIndex: 1 },
  { title: 'Salada Caesar com Molho Caseiro', category: 'Saladas', authorIndex: 2 },
  { title: 'Mousse de Maracujá Rápido', category: 'Sobremesas', authorIndex: 3 },
  { title: 'Lasanha à Bolonhesa Tradicional', category: 'Massas', authorIndex: 4 },
  { title: 'Pão de Queijo Mineiro', category: 'Lanches', authorIndex: 0 },
  { title: 'Sopa de Legumes da Vovó', category: 'Sopas', authorIndex: 1 },
  { title: 'Risoto de Camarão Cremoso', category: 'Frutos do Mar', authorIndex: 2 },
];

const sampleRanking = [
  { userId: 'user1', score: 1250 },
  { userId: 'user3', score: 1100 },
  { userId: 'user5', score: 980 },
];

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const seedDatabase = async () => {
    setIsSeeding(true);
    const batch = writeBatch(db);

    // Seed Users
    sampleUsers.forEach(user => {
      const userRef = doc(db, 'users', user.id);
      batch.set(userRef, { name: user.name, avatarUrl: user.avatarUrl });
    });

    // Seed Recipes
    sampleRecipes.forEach(recipe => {
      const recipeRef = doc(collection(db, 'recipes'));
      const author = sampleUsers[recipe.authorIndex];
      batch.set(recipeRef, {
        ...recipe,
        authorName: author.name,
        authorAvatarUrl: author.avatarUrl,
        createdAt: Timestamp.now(),
      });
    });
    
    // Seed Ranking
    sampleRanking.forEach(rank => {
        const rankingRef = doc(db, 'weeklyRanking', rank.userId);
        const user = sampleUsers.find(u => u.id === rank.userId)!;
        batch.set(rankingRef, {
            ...rank,
            userName: user.name,
            userAvatarUrl: user.avatarUrl,
        });
    });

    try {
      await batch.commit();
      toast({
        title: 'Sucesso!',
        description: 'Banco de dados populado com dados de exemplo.',
      });
      // A simple page reload is enough to show the new data
      window.location.reload();
    } catch (error) {
      console.error("Erro ao popular o banco de dados:", error);
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Não foi possível popular o banco de dados.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button onClick={seedDatabase} disabled={isSeeding} size="lg" className="rounded-full shadow-lg">
      {isSeeding ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Sprout className="mr-2 h-5 w-5" />
      )}
      {isSeeding ? 'Populando...' : 'Popular Dados'}
    </Button>
  );
}
