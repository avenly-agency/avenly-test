import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero'; 

// --- KONFIGURACJA LAZY LOADING ---

// Funkcja pomocnicza do tworzenia placeholderów (szkieletów)
// Zapobiega przesunięciom układu (CLS) zanim sekcja się załaduje
const SectionLoader = ({ height = "h-screen" }: { height?: string }) => (
  <div className={`w-full ${height} bg-[#050505] flex items-center justify-center`}>
      {/* Opcjonalnie: mały spinner lub po prostu puste tło */}
  </div>
);

// 1. TechStack - lekki, ale można go opóźnić
const TechStack = dynamic(() => import('@/components/sections/TechStack').then(mod => mod.TechStack), {
  loading: () => <div className="w-full h-[150px] bg-[#050505]" />
});

// 2. Portfolio - ciężka sekcja (Sticky Scroll)
const Portfolio = dynamic(() => import('@/components/sections/Portfolio').then(mod => mod.Portfolio), {
  loading: () => <SectionLoader height="h-[350vh]" /> // Ważne: Taka sama wysokość jak w komponencie!
});

// 3. Process - ciężka sekcja (Sticky Scroll)
const Process = dynamic(() => import('@/components/sections/Process').then(mod => mod.Process), {
  loading: () => <SectionLoader height="h-[300vh]" />
});

// 4. Impact - standardowa sekcja
const Impact = dynamic(() => import('@/components/sections/Impact').then(mod => mod.Impact), {
  loading: () => <SectionLoader height="h-screen" />
});


export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30">
      
      {/* HERO ładujemy normalnie (Eager) - to musi być natychmiastowe dla LCP */}
      <Hero />
      
      {/* Reszta ładuje się dynamicznie */}
      <TechStack />
      <Portfolio />
      <Process />
      <Impact />
      
    </main>
  );
}