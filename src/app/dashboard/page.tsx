import { Suspense } from 'react';
import { NavigationBanners } from '@/components/dashboard/navigation-banners';
import { RecentRecipes, RecentRecipesSkeleton } from '@/components/dashboard/recent-recipes';
import { WeeklyRanking, WeeklyRankingSkeleton } from '@/components/dashboard/weekly-ranking';
import { SeedButton } from '@/components/dashboard/seed-button';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Bem-vindo(a) ao Minha Receita
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Seu livro de receitas digital!
        </p>
      </header>

      <main className="space-y-12">
        <NavigationBanners />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Adicionadas Recentemente</h2>
            <Suspense fallback={<RecentRecipesSkeleton />}>
              <RecentRecipes />
            </Suspense>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-8">
            <Suspense fallback={<WeeklyRankingSkeleton />}>
              <WeeklyRanking />
            </Suspense>
          </aside>
        </div>
      </main>
      
      {/* SEED BUTTON - REMOVE IN PRODUCTION */}
      <div className="fixed bottom-4 right-4">
        <SeedButton />
      </div>
    </div>
  );
}
