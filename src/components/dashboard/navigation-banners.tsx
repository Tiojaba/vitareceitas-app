import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const BannerCard = ({ href, imgSrc, alt, title, className, imgClassName, titleClassName }: { href: string, imgSrc: string, alt: string, title: string, className?: string, imgClassName?: string, titleClassName?: string }) => (
  <Link href={href}>
    <Card className={`relative overflow-hidden group h-full ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        data-ai-hint={alt}
        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imgClassName}`}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="relative flex h-full items-center justify-center p-4">
        <h3 className={`text-2xl font-bold text-white text-center ${titleClassName}`}>{title}</h3>
      </div>
    </Card>
  </Link>
);

export function NavigationBanners() {
  return (
    <section aria-labelledby="navigation-banners-title">
       <h2 id="navigation-banners-title" className="sr-only">Navegação Principal</h2>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: '32rem' }}>
        {/* Main Banner */}
        <div className="lg:col-span-1 h-full">
           <BannerCard 
            href="/recipes"
            imgSrc="https://placehold.co/600x800.png"
            alt="delicious food"
            title="Descubra Novas Receitas"
            className="min-h-[20rem] lg:min-h-full"
           />
        </div>

        {/* Stacked Banners */}
        <div className="lg:col-span-1 grid grid-rows-2 gap-6 h-full">
            <BannerCard 
                href="/ranking"
                imgSrc="https://placehold.co/600x400.png"
                alt="top chefs"
                title="Chefs da Semana"
            />
            <BannerCard 
                href="/community"
                imgSrc="https://placehold.co/600x400.png"
                alt="happy people cooking"
                title="Nossa Comunidade"
            />
        </div>
      </div>
    </section>
  );
}
