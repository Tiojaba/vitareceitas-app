import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Star, Medal } from 'lucide-react';

interface RankedUser {
  id: string;
  userName: string;
  userAvatarUrl: string;
  score: number;
}

async function getWeeklyRanking(): Promise<RankedUser[]> {
  const rankingCol = collection(db, 'weeklyRanking');
  const q = query(rankingCol, orderBy('score', 'desc'), limit(3));
  const snapshot = await getDocs(q);
  
  // Artificial delay to demonstrate skeleton loading
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as RankedUser));
}

const RankingMedal = ({ position }: { position: number }) => {
    const medalProps = {
        1: { className: "text-yellow-500 fill-yellow-400" },
        2: { className: "text-gray-400 fill-gray-300" },
        3: { className: "text-amber-700 fill-amber-600" },
    }[position] || { className: "text-muted-foreground" };

    return <Medal className={`h-6 w-6 ${medalProps.className}`} />;
}

export async function WeeklyRanking() {
  const rankedUsers = await getWeeklyRanking();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Chefs da Semana
        </CardTitle>
        <CardDescription>O ranking dos melhores da comunidade.</CardDescription>
      </CardHeader>
      <CardContent>
        {rankedUsers.length > 0 ? (
          <ul className="space-y-4">
            {rankedUsers.map((user, index) => (
              <li key={user.id}>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-4 group">
                    <RankingMedal position={index + 1} />
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.userAvatarUrl} alt={user.userName} />
                        <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold group-hover:underline">{user.userName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{user.score.toLocaleString()} pontos</span>
                        </div>
                    </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
             <div className="text-center text-sm text-muted-foreground py-8">
                <p>O ranking da semana ainda está sendo formado.</p>
             </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WeeklyRankingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4">
               <Skeleton className="h-6 w-6" />
               <Skeleton className="h-12 w-12 rounded-full" />
               <div className="flex-grow space-y-2">
                 <Skeleton className="h-5 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
               </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
