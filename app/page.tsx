'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero'; 

// --- KONFIGURACJA LAZY LOADING ---

const SectionLoader = ({ height = "h-screen" }: { height?: string }) => (
  <div className={`w-full ${height} bg-[#050505] flex items-center justify-center`}>
      {/* Placeholder */}
  </div>
);

// 1. TechStack
const TechStack = dynamic(() => import('@/components/sections/TechStack').then(mod => mod.TechStack), {
  loading: () => <div className="w-full h-[150px] bg-[#050505]" />
});

// 2. Portfolio (Teaser)
const Portfolio = dynamic(() => import('@/components/sections/Portfolio').then(mod => mod.Portfolio), {
  loading: () => <SectionLoader height="h-[350vh]" />
});

// 3. Process
const Process = dynamic(() => import('@/components/sections/Process').then(mod => mod.Process), {
  loading: () => <SectionLoader height="h-[300vh]" />
});

// 4. Impact
const Impact = dynamic(() => import('@/components/sections/Impact').then(mod => mod.Impact), {
  loading: () => <SectionLoader height="h-screen" />
});

// 5. AiConsultant
const AiConsultant = dynamic(() => import('@/components/sections/AiConsultant').then(mod => mod.AiConsultant), {
  loading: () => <div className="h-[800px] bg-[#050505]" />
});

// 6. Services
const Services = dynamic(() => import('@/components/sections/Services').then(mod => mod.Services), {
  loading: () => <div className="h-[800px] bg-[#050505]" />
});

// ✅ NOWOŚĆ: 7. Testimonials (Opinie)
// Importujemy dynamicznie, placeholder ok. 600px wysokości
const Testimonials = dynamic(() => import('@/components/sections/Testimonials').then(mod => mod.Testimonials), {
  loading: () => <div className="h-[600px] bg-[#050505]" />
});

// 8. BlogTeaser
const BlogTeaser = dynamic(() => import('@/components/sections/BlogTeaser').then(mod => mod.BlogTeaser), {
  loading: () => <div className="h-[600px] bg-[#050505]" /> 
});

// 9. CallToAction
const CallToAction = dynamic(() => import('@/components/sections/CallToAction').then(mod => mod.CallToAction), {
  loading: () => <SectionLoader height="h-[80vh]" />
});

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      
      {/* HERO (Start) */}
      <Hero /> 
      
      <div className="render-optimize">
        <TechStack />
      </div>
      
      {/* PORTFOLIO (Teaser na głównej) */}
      <div className="render-optimize">
        <Portfolio />
      </div>
      
      {/* PROCES (Kotwica #proces) */}
      <div className="render-optimize" id="proces">
        <Process />
      </div>
      
      <div className="render-optimize">
        <Impact />
      </div>
{/* ✅ NOWOŚĆ: OPINIE */}
      {/* Umieściłem to po ofercie, a przed blogiem/kontaktem - to buduje zaufanie przed finalnym CTA */}
      <div className="render-optimize" id="opinie">
        <Testimonials />
      </div>
      {/* AI CONSULTANT */}
      <div className="render-optimize">
        <AiConsultant />
      </div>

      {/* OFERTA (Kotwica #oferta) */}
      <div className="render-optimize" id="oferta">
        <Services />
      </div>

      

      {/* BLOG TEASER */}
      <div className="render-optimize">
        <BlogTeaser />
      </div>
      
      {/* KONTAKT (Kotwica #kontakt) */}
      <div className="render-optimize" id="kontakt">
        <CallToAction />
      </div>

    </main>
  );
}