import { Hero } from '@/components/sections/Hero';
import { Portfolio } from '@/components/sections/Portfolio';
import { Process } from "@/components/sections/Process";


export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30">
      
      {/* 1. HERO - Ma swoje wymiary, nie ruszamy */}
      <Hero />
      
      {/* 2. PORTFOLIO - Wstawiamy BEZPOŚREDNIO. 
         Nie owijaj go w <section h-screen>, bo on sam w sobie ma h-[300vh]! */}
      <Portfolio />
      
      {/* 3. PROCES - Też bezpośrednio. */}
      <Process />

      {/* 4. FOOTER */}

    </main>
  );
}