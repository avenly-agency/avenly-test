import { Hero } from '@/components/sections/Hero';
import { Impact } from '@/components/sections/Impact';
import { Portfolio } from '@/components/sections/Portfolio';
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack"; // IMPORT

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30">
      
      {/* 1. HERO - Ma swoje wymiary, nie ruszamy */}
      <Hero />
      
      <TechStack />
      {/* 2. PORTFOLIO - Wstawiamy BEZPOŚREDNIO. 
         Nie owijaj go w <section h-screen>, bo on sam w sobie ma h-[300vh]! */}
      <Portfolio />
      <Impact />
      {/* 3. PROCES - Też bezpośrednio. */}
      <Process />

      {/* 4. FOOTER */}

    </main>
  );
}