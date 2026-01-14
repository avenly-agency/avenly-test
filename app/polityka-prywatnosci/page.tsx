'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Cookie, Mail, Server } from 'lucide-react';

export default function PrivacyPolicy() {
  // Data aktualizacji
  const lastUpdate = new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">
      
      {/* --- TŁO DEKORACYJNE --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10 max-w-5xl">
        
        {/* --- HEADER --- */}
        <div className="mb-16">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Wróć do strony głównej
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                    Polityka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Prywatności</span>
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    {/* 👇 ZMIANA TUTAJ: Neutralny tekst zamiast "Dokument Prawny" */}
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest">
                        <Shield size={12} className="text-blue-400" />
                        Ochrona Danych
                    </span>
                    <span className="text-sm">Ostatnia aktualizacja: <span className="text-white">{lastUpdate}</span></span>
                </div>
            </motion.div>
        </div>

        {/* --- GŁÓWNA TREŚĆ (KARTY) --- */}
        <div className="grid gap-8">
            
            {/* Sekcja 1: Administrator */}
            <PolicySection 
                icon={Server} 
                title="1. Administrator Danych" 
                delay={0.1}
            >
                <p>
                    Administratorem Twoich danych osobowych jest <strong>Avenly Agency</strong> (lub właściciel strony).
                </p>
                <p className="mt-4">
                    Dbamy o bezpieczeństwo Twoich danych. Są one przetwarzane w sposób bezpieczny i zgodny z obowiązującymi standardami.
                    W każdej chwili możesz się z nami skontaktować pod adresem: <a href="mailto:kontakt@avenly.pl" className="text-blue-400 hover:underline">kontakt@avenly.pl</a>.
                </p>
            </PolicySection>

            {/* Sekcja 2: Jakie dane zbieramy */}
            <PolicySection 
                icon={Eye} 
                title="2. Jakie dane zbieramy i po co?" 
                delay={0.2}
            >
                <ul className="space-y-4">
                    <li className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                        <div>
                            <strong className="text-white block mb-1">Formularz Kontaktowy</strong>
                            Podając dane w formularzu (imię, e-mail), zgadzasz się na ich przetwarzanie w celu otrzymania odpowiedzi na Twoje zapytanie.
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 flex-shrink-0" />
                        <div>
                            <strong className="text-white block mb-1">Dane Techniczne</strong>
                            Strona może zbierać podstawowe logi serwera i anonimowe statystyki w celu zapewnienia stabilności działania serwisu.
                        </div>
                    </li>
                </ul>
            </PolicySection>

            {/* Sekcja 3: Cookies */}
            <PolicySection 
                icon={Cookie} 
                title="3. Pliki Cookies" 
                delay={0.3}
            >
                <p>
                    Nasza strona wykorzystuje pliki cookies w celu zapewnienia poprawnego działania (np. zapamiętanie sesji).
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm">Niezbędne</h4>
                        <p className="text-xs text-slate-400">Wymagane do technicznego działania strony.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-2 text-sm">Analityczne (Opcjonalne)</h4>
                        <p className="text-xs text-slate-400">Używane tylko, jeśli wyrazisz na to zgodę (np. Google Analytics).</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                    Możesz zarządzać ustawieniami cookies z poziomu swojej przeglądarki internetowej.
                </p>
            </PolicySection>

            {/* Sekcja 4: Twoje Prawa */}
            <PolicySection 
                icon={Lock} 
                title="4. Twoje Prawa" 
                delay={0.4}
            >
                <p>Masz pełną kontrolę nad swoimi danymi. Przysługuje Ci:</p>
                <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                        "Prawo dostępu do treści danych",
                        "Prawo do poprawiania danych",
                        "Prawo do usunięcia danych",
                        "Prawo do ograniczenia przetwarzania"
                    ].map((right, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {right}
                        </li>
                    ))}
                </ul>
            </PolicySection>

             {/* Sekcja 5: Kontakt */}
             <PolicySection 
                icon={Mail} 
                title="5. Kontakt" 
                delay={0.5}
            >
                <p>
                    Jeśli chcesz usunąć swoje dane lub masz pytania, napisz do nas.
                </p>
                <div className="mt-6">
                    <a href="mailto:kontakt@avenly.pl" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-blue-50 transition-colors">
                        <Mail size={18} />
                        kontakt@avenly.pl
                    </a>
                </div>
            </PolicySection>

        </div>

      </div>
    </main>
  );
}

// --- KOMPONENT SEKCJI ---
function PolicySection({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className="p-8 md:p-10 rounded-3xl bg-[#080808]/80 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Icon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-slate-400 leading-relaxed text-lg">
                {children}
            </div>
        </motion.section>
    );
}