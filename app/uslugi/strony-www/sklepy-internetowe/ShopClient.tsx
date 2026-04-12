'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  ShoppingCart,
  CreditCard,
  Package,
  Smartphone,
  Zap,
  CheckCircle2,
  CalendarCheck,
  BarChart3,
  MousePointer2,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export function ShopClient() {
  const targetRef = useRef<HTMLDivElement>(null);
  const buttonProductRef = useRef<HTMLDivElement>(null);
  const buttonCartRef = useRef<HTMLDivElement>(null);
  const buttonCheckoutRef = useRef<HTMLDivElement>(null);

  const [buttonPositions, setButtonPositions] = useState({
    product: { x: 'calc(15% + 10px)', y: 'calc(50% + 100px)' },
    cart: { x: 'calc(100% - 160px)', y: 'calc(50% + 60px)' },
    checkout: { x: 'calc(50% + 0px)', y: 'calc(50% + 170px)' },
  });

  // Dynamicznie oblicz pozycje przycisków
  useEffect(() => {
    const updateButtonPositions = () => {
      const getPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return null;
        
        const rect = ref.current.getBoundingClientRect();
        const containerRect = targetRef.current?.querySelector('.inner-screen')?.getBoundingClientRect();

        if (!containerRect) return null;

        const relX = ((rect.left - containerRect.left + rect.width / 2) / containerRect.width) * 100;
        const relY = ((rect.top - containerRect.top + rect.height / 2) / containerRect.height) * 100;

        return {
          x: `calc(${relX}% - 4px)`,
          y: `calc(${relY}% - 4px)`,
        };
      };

      const product = getPosition(buttonProductRef);
      const cart = getPosition(buttonCartRef);
      const checkout = getPosition(buttonCheckoutRef);

      if (product || cart || checkout) {
        setButtonPositions({
          product: product || buttonPositions.product,
          cart: cart || buttonPositions.cart,
          checkout: checkout || buttonPositions.checkout,
        });
      }
    };

    updateButtonPositions();
    window.addEventListener('resize', updateButtonPositions);
    return () => window.removeEventListener('resize', updateButtonPositions);
  }, []);

  const { scrollYProgress: mainProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothMain = useSpring(mainProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothMain, [0, 0.03], [0.85, 1]);
  const rotateX = useTransform(smoothMain, [0, 0.03], [15, 0]);
  const opacity = useTransform(smoothMain, [0, 0.02], [0.3, 1]);
  const progressBar = useTransform(smoothMain, [0.03, 0.95], ['0%', '100%']);

  // URL transitions
  const urlShopOpacity = useTransform(smoothMain, [0, 0.24, 0.26], [1, 1, 0]);
  const urlCartOpacity = useTransform(smoothMain, [0.24, 0.26, 0.47, 0.49], [0, 1, 1, 0]);
  const urlCheckoutOpacity = useTransform(smoothMain, [0.47, 0.49, 0.72, 0.74], [0, 1, 1, 0]);
  const urlConfirmOpacity = useTransform(smoothMain, [0.72, 0.74, 1], [0, 1, 1]);

  // Phase opacities
  const phase1Opacity = useTransform(smoothMain, [0, 0.24, 0.26, 1], [1, 1, 0, 0]);
  const phase1Y = '0%'; 
  const phase2Opacity = useTransform(smoothMain, [0, 0.24, 0.26, 0.47, 0.49, 1], [0, 0, 1, 1, 0, 0]);
  const phase3Opacity = useTransform(smoothMain, [0, 0.47, 0.49, 0.72, 0.74, 1], [0, 0, 1, 1, 0, 0]);
  const phase4Opacity = useTransform(smoothMain, [0, 0.72, 0.74, 1], [0, 0, 1, 1]);

  // Checkout card fill
  const cardNumW = useTransform(smoothMain, [0.52, 0.60], ['0%', '100%']);
  const cardExpW = useTransform(smoothMain, [0.60, 0.66], ['0%', '100%']);
  const cardCvvW = useTransform(smoothMain, [0.66, 0.70], ['0%', '100%']);

  // Cart badge
  const cartBadgeScale = useTransform(smoothMain, [0.24, 0.27], [0, 1]);
  const cartBadgeOpacity = useTransform(smoothMain, [0.24, 0.27], [0, 1]);

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(smoothMain, [0, 0.1, 0.2], [1, 1, 0]);

  const kfC = [
    0, 0.05, 0.15, 0.24, 0.26, 0.35, 0.47, 0.49, 0.68, 0.72, 0.74, 0.80, 1
  ];

  const cursorX = useTransform(smoothMain, kfC, [
    '110%', 
    '110%', 
    buttonPositions.product.x, 
    buttonPositions.product.x, 
    buttonPositions.product.x, 
    buttonPositions.cart.x, 
    buttonPositions.cart.x,    
    buttonPositions.cart.x, 
    buttonPositions.checkout.x, 
    buttonPositions.checkout.x, 
    buttonPositions.checkout.x, 
    '110%', 
    '110%'
  ]);

  const cursorY = useTransform(smoothMain, kfC, [
    '100%', 
    '100%', 
    buttonPositions.product.y, 
    buttonPositions.product.y, 
    buttonPositions.product.y, 
    buttonPositions.cart.y, 
    buttonPositions.cart.y, 
    buttonPositions.cart.y, 
    buttonPositions.checkout.y, 
    buttonPositions.checkout.y, 
    buttonPositions.checkout.y, 
    '100%', 
    '100%'
  ]);

  const cursorOpacity = useTransform(smoothMain, kfC, [
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0
  ]);

  const kfScale = [
    0, 
    0.22, 0.24, 0.26, 
    0.45, 0.47, 0.49, 
    0.70, 0.72, 0.74, 
    1
  ];
  
  const cursorScale = useTransform(smoothMain, kfScale, [
    1, 
    1, 0.8, 1, 
    1, 0.8, 1, 
    1, 0.8, 1, 
    1
  ]);

  const scopeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scopeProgress } = useScroll({
    target: scopeRef,
    offset: ['start start', 'end end'],
  });

  const smoothScope = useSpring(scopeProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  const scopeCardsY = useTransform(smoothScope, [0, 1], ['40vh', '-75%']);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 overflow-clip">

      {/* TŁO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_70%)]" />
      </div>

      <main className="relative z-10">

        {/* --- HERO --- */}
        <section className="pt-32 pb-10 container mx-auto px-6 text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
              <ShoppingCart size={14} /> Sklepy E-commerce
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
              Sprzedawaj na <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">
                autopilocie.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
              Stabilny, bezpieczny sklep internetowy w pełni zintegrowany z płatnościami, kurierami i magazynem. Zarabiaj 24/7 — bez udziału człowieka.
            </p>
          </Reveal>
        </section>

        {/* --- BROWSER MOCKUP SCROLL LOCK --- */}
        <section ref={targetRef} className="relative h-[600vh] z-30">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">

            {/* ZMIANA: Tło modalu z efektem szkła (backdrop-blur, półprzezroczyste bg, wewnętrzny biały border-top) */}
            <motion.div
              style={{ scale, opacity, rotateX, perspective: '1200px' }}
              className="mockup-screen relative w-full max-w-6xl h-[75vh] md:h-[85vh] rounded-[2rem] md:rounded-[3rem] bg-[#050505]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_-20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden will-change-transform"
            >

              {/* Pasek przeglądarki - ZMIANA na szklisty */}
              <div className="relative h-14 bg-white/[0.03] border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between z-50 shrink-0">
                <div className="flex gap-1.5 md:gap-2 shrink-0">
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] border border-white/10" />
                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] border border-white/10" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 h-8 bg-black/30 rounded-full border border-white/[0.05] flex items-center justify-center px-4 overflow-hidden z-50 shadow-inner max-w-[55%] md:max-w-md">
                  <span className="text-amber-500/50 mr-1 text-[10px] sm:text-xs font-mono shrink-0 hidden sm:inline">https://</span>
                  <div className="relative w-32 sm:w-56 h-full flex items-center text-[10px] sm:text-xs font-mono tracking-wider text-slate-500">
                    <motion.span style={{ opacity: urlShopOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left">twoj-sklep.pl</motion.span>
                    <motion.span style={{ opacity: urlCartOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-amber-300">twoj-sklep.pl/koszyk</motion.span>
                    <motion.span style={{ opacity: urlCheckoutOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-orange-300">twoj-sklep.pl/checkout</motion.span>
                    <motion.span style={{ opacity: urlConfirmOpacity }} className="absolute inset-x-0 truncate text-center sm:text-left text-green-400">twoj-sklep.pl/zamowienie/ok</motion.span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <motion.div style={{ width: progressBar }} className="h-full bg-gradient-to-r from-amber-500 to-orange-500 will-change-transform" />
                </div>
              </div>

              {/* Główny kontener ekranu - delikatnie przepuszcza tło z blur */}
              <div className="inner-screen relative flex-1 bg-[#020202]/50 overflow-hidden flex flex-col">

                {/* ======= WEWNĘTRZNY NAVBAR ======= */}
                <div className="absolute top-0 inset-x-0 h-12 md:h-14 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-10 bg-white/[0.02] backdrop-blur-lg z-40 pointer-events-none">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-amber-400 rounded-sm" />
                    </div>
                    <div className="w-20 h-4 bg-white/10 rounded-md hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:flex gap-5 items-center">
                      <div className="w-14 h-2 bg-amber-400/60 rounded shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                      <div className="w-14 h-2 bg-white/20 rounded" />
                      <div className="w-14 h-2 bg-white/20 rounded" />
                    </div>
                    <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 rounded-xl bg-white/5 border border-white/10">
                      <ShoppingCart size={13} className="text-amber-400" />
                      <span className="text-amber-400 text-[10px] md:text-xs font-bold hidden sm:block">Koszyk</span>
                      <motion.div
                        style={{ scale: cartBadgeScale, opacity: cartBadgeOpacity }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-amber-500 rounded-full flex items-center justify-center text-[9px] font-black text-black"
                      >1</motion.div>
                    </div>
                  </div>
                </div>

                {/* ======= JEDEN UNIWERSALNY KURSOR ======= */}
                <motion.div
                  style={{ left: cursorX, top: cursorY, scale: cursorScale, opacity: cursorOpacity }}
                  className="absolute z-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] origin-top-left pointer-events-none will-change-transform"
                >
                  <MousePointer2 size={32} className="text-white fill-amber-500 stroke-[1.5]" />
                </motion.div>

                {/* ======= FAZA 1: PRODUKTY ======= */}
                <motion.div
                  style={{ y: phase1Y, opacity: phase1Opacity }}
                  className="absolute inset-x-0 top-0 pt-12 md:pt-14 flex flex-col will-change-transform z-10"
                >
                  {/* Baner promo */}
                  <div className="mx-3 md:mx-8 mt-3 md:mt-5 h-9 md:h-11 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-36 md:w-56 h-2.5 bg-amber-500/25 rounded" />
                  </div>

                  {/* Grid produktów */}
                  <div className="mx-3 md:mx-8 mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
                    {[
                      { badge: 'SALE', badgeCls: 'bg-amber-500/20 border-amber-500/30 text-amber-400', iconCls: 'bg-amber-500/10 border-amber-500/20', highlighted: true },
                      { badge: null,   badgeCls: '', iconCls: 'bg-orange-500/10 border-orange-500/20', highlighted: false },
                      { badge: 'NEW',  badgeCls: 'bg-rose-500/20 border-rose-500/30 text-rose-400',    iconCls: 'bg-rose-500/10 border-rose-500/20',  highlighted: false },
                      { badge: null,   badgeCls: '', iconCls: 'bg-amber-500/10 border-amber-500/20', highlighted: false },
                    ].map((p, i) => (
                      <div key={i} className="flex flex-col rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                        <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02]">
                          {p.badge && (
                            <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded border text-[9px] md:text-[10px] font-black ${p.badgeCls}`}>{p.badge}</div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl border ${p.iconCls}`} />
                          </div>
                        </div>
                        <div className="p-2.5 md:p-3.5 flex flex-col gap-1.5">
                          <div className="w-4/5 h-2 md:h-2.5 bg-white/10 rounded" />
                          <div className="w-2/5 h-2 md:h-2.5 bg-amber-500/30 rounded" />
                          <div
                            ref={p.highlighted ? buttonProductRef : null}
                            className={`w-full h-7 md:h-8 mt-1 rounded-lg md:rounded-xl flex items-center justify-center ${p.highlighted ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/30' : 'bg-white/5 border border-white/5'}`}
                          >
                            <div className={`w-14 md:w-18 h-1.5 md:h-2 rounded ${p.highlighted ? 'bg-black/25' : 'bg-white/15'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ikony zaufania */}
                  <div className="mx-3 md:mx-8 mt-4 md:mt-6 grid grid-cols-4 gap-2 md:gap-4">
                    {['bg-amber-500/10', 'bg-orange-500/10', 'bg-rose-500/10', 'bg-amber-500/10'].map((cls, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 md:gap-2.5 p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.01] border border-white/5">
                        <div className={`w-5 h-5 md:w-9 md:h-9 rounded-full ${cls}`} />
                        <div className="w-8 md:w-14 h-1.5 md:h-2 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>

                  <div className="h-2 md:h-3" />
                </motion.div>

                {/* ======= FAZA 2: KOSZYK ======= */}
                <motion.div
                  style={{ opacity: phase2Opacity }}
                  className="absolute inset-x-0 top-0 pt-12 md:pt-14 flex flex-col will-change-transform z-10"
                >
                  <div className="mx-3 md:mx-8 mt-3 md:mt-5 flex flex-col gap-3 md:gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 md:w-36 h-4 md:h-6 bg-white/10 rounded-lg" />
                      <div className="w-5 h-4 bg-amber-500/30 rounded" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                      {/* Pozycje koszyka */}
                      <div className="flex-[1.5] flex flex-col gap-2.5 md:gap-3">
                        <div className="flex gap-3 md:gap-4 p-3 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl items-center">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="w-3/4 h-2.5 md:h-3 bg-white/10 rounded" />
                            <div className="w-1/3 h-2 bg-amber-500/30 rounded" />
                            <div className="w-1/4 h-2 bg-white/5 rounded hidden md:block" />
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
                            <div className="w-4 h-3.5 bg-white/20 rounded" />
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-9 md:h-10 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/5" />
                          <div className="w-20 md:w-24 h-9 md:h-10 rounded-lg md:rounded-xl bg-amber-500/10 border border-amber-500/20" />
                        </div>
                      </div>

                      {/* Podsumowanie */}
                      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3.5 md:p-5 flex flex-col gap-2.5 md:gap-3">
                        <div className="w-1/2 h-4 md:h-5 bg-white/10 rounded" />
                        <div className="border-t border-white/5" />
                        <div className="flex justify-between">
                          <div className="w-1/3 h-2.5 bg-white/5 rounded" />
                          <div className="w-1/4 h-2.5 bg-white/10 rounded" />
                        </div>
                        <div className="flex justify-between">
                          <div className="w-2/5 h-2.5 bg-white/5 rounded" />
                          <div className="w-1/5 h-2.5 bg-green-500/30 rounded" />
                        </div>
                        <div className="border-t border-white/5" />
                        <div className="flex justify-between items-center">
                          <div className="w-1/4 h-3.5 bg-white/10 rounded" />
                          <div className="w-1/3 h-3.5 bg-amber-400/50 rounded" />
                        </div>
                        {/* CURSOR TARGET: przejdź do kasy */}
                        <div
                          ref={buttonCartRef}
                          className="w-full h-9 md:h-11 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg md:rounded-xl shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 mt-1"
                        >
                          <div className="w-24 md:w-28 h-2.5 bg-black/30 rounded" />
                          <div className="w-2.5 h-2.5 rounded-full bg-black/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ======= FAZA 3: CHECKOUT ======= */}
                <motion.div
                  style={{ opacity: phase3Opacity }}
                  className="absolute inset-x-0 top-0 pt-12 md:pt-14 flex flex-col will-change-transform z-10"
                >
                  <div className="mx-3 md:mx-8 mt-3 md:mt-5 flex flex-col lg:flex-row gap-3 md:gap-4">
                    {/* Formularz */}
                    <div className="flex-[1.5] flex flex-col gap-2.5 md:gap-3">
                      {/* Dostawa */}
                      <div className="p-3.5 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl flex flex-col gap-2.5 md:gap-3">
                        <div className="w-28 md:w-36 h-3 md:h-3.5 bg-white/10 rounded" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
                          <div className="h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
                          <div className="col-span-2 h-8 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg" />
                        </div>
                      </div>

                      {/* Płatność kartą */}
                      <div className="p-3.5 md:p-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl flex flex-col gap-2.5 md:gap-3">
                        <div className="flex items-center justify-between">
                          <div className="w-20 md:w-28 h-3 md:h-3.5 bg-white/10 rounded" />
                          <div className="flex gap-1.5">
                            <div className="w-7 h-4 bg-white/10 rounded-sm" />
                            <div className="w-7 h-4 bg-white/10 rounded-sm" />
                          </div>
                        </div>
                        {/* Numer karty — animacja wpisywania */}
                        <div className="relative h-9 md:h-10 bg-white/[0.03] border border-amber-500/25 rounded-lg overflow-hidden flex items-center px-3">
                          <motion.div style={{ width: cardNumW }} className="h-2 bg-amber-500/40 rounded absolute left-3" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative h-9 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden flex items-center px-3">
                            <motion.div style={{ width: cardExpW }} className="h-2 bg-amber-500/30 rounded absolute left-3" />
                          </div>
                          <div className="relative h-9 md:h-10 bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden flex items-center px-3">
                            <motion.div style={{ width: cardCvvW }} className="h-2 bg-amber-500/30 rounded absolute left-3" />
                          </div>
                        </div>
                        {/* CURSOR TARGET: zapłać */}
                        <div
                          ref={buttonCheckoutRef}
                          className="w-full h-9 md:h-11 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg md:rounded-xl shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 mt-0.5"
                        >
                          <div className="w-3 h-3 rounded-full bg-black/20" />
                          <div className="w-24 md:w-32 h-2.5 bg-black/30 rounded" />
                        </div>
                      </div>
                    </div>

                    {/* Podsumowanie zamówienia */}
                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3.5 md:p-5 flex flex-col gap-2.5 self-start">
                      <div className="w-36 md:w-44 h-3 md:h-4 bg-white/10 rounded" />
                      <div className="border-t border-white/5" />
                      <div className="flex gap-2.5 items-center">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0" />
                        <div className="flex-1">
                          <div className="w-3/4 h-2 bg-white/10 rounded mb-1.5" />
                          <div className="w-1/3 h-2 bg-amber-500/30 rounded" />
                        </div>
                      </div>
                      <div className="border-t border-white/5" />
                      <div className="flex justify-between">
                        <div className="w-1/4 h-2.5 bg-white/5 rounded" />
                        <div className="w-1/4 h-2.5 bg-white/10 rounded" />
                      </div>
                      <div className="flex justify-between">
                        <div className="w-1/3 h-2.5 bg-white/5 rounded" />
                        <div className="w-1/5 h-2.5 bg-green-500/30 rounded" />
                      </div>
                      <div className="border-t border-white/5" />
                      <div className="flex justify-between items-center">
                        <div className="w-1/4 h-3.5 bg-white/10 rounded" />
                        <div className="w-2/5 h-3.5 bg-amber-400/40 rounded" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ======= FAZA 4: POTWIERDZENIE ======= */}
                <motion.div
                  style={{ opacity: phase4Opacity }}
                  className="absolute inset-x-0 top-12 md:top-14 bottom-0 flex flex-col items-center justify-center z-10 px-6 gap-3 md:gap-5"
                >
                  <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 size={24} className="text-green-400" />
                  </div>
                  <div className="w-52 md:w-72 h-5 md:h-6 bg-white/15 rounded-lg" />
                  <div className="w-28 md:w-40 h-3 bg-amber-500/20 rounded" />
                  <div className="w-full max-w-xs border-t border-white/5" />
                  <div className="w-full max-w-xs flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="w-24 md:w-28 h-2 bg-white/10 rounded" />
                        <div className="w-16 md:w-20 h-2 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="w-32 md:w-40 h-9 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-20 md:w-24 h-2.5 bg-white/20 rounded" />
                  </div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#020202] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-12 md:h-14 bg-gradient-to-b from-[#020202] to-transparent z-20 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: scrollIndicatorOpacity }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-500 z-10 pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scrolluj, aby odkryć</span>
              <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* --- BENTO GRID --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="py-24 md:py-32 border-b border-white/5">
            <Reveal>
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Sklep zoptymalizowany pod sprzedaż</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Każdy element jest zaprojektowany tak, aby zamieniać odwiedzających w kupujących — od szybkości ładowania po intuicyjny koszyk.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
              {/* KARTA 1 — full width */}
              <div className="md:col-span-12">
                <Reveal delay={0.1}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-[#0a0a0a] to-[#111] border border-white/5 hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-amber-900/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-20 -top-20 text-amber-500/5 group-hover:text-amber-500/10 transition-colors duration-700 rotate-12">
                      <CreditCard size={300} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 relative z-10">
                      <CreditCard size={32} />
                    </div>
                    <div className="relative z-10 flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-4">Płatności bez komplikacji</h3>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Integrujemy BLIK, karty Visa/Mastercard, Apple Pay i Google Pay przez Przelewy24 lub Stripe. Twój klient płaci jednym kliknięciem — bez rejestracji, bez barier.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 2 */}
              <div className="md:col-span-6">
                <Reveal delay={0.2}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-orange-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full group-hover:bg-orange-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-orange-400 mb-8 relative z-10 group-hover:bg-orange-500/20 transition-colors">
                      <Package size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Automatyczna logistyka</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Integracja z InPost, DPD i DHL. Zamówienia idą do kuriera automatycznie — Ty skupiasz się na sprzedaży, nie na pakowaniu.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 3 */}
              <div className="md:col-span-6">
                <Reveal delay={0.3}>
                  <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-rose-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full group-hover:bg-rose-500/20 transition-all duration-500" />
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-rose-400 mb-8 relative z-10 group-hover:bg-rose-500/20 transition-colors">
                      <Smartphone size={28} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">Mobile-first zakupy</h3>
                      <p className="text-slate-400 leading-relaxed">
                        Ponad 70% transakcji odbywa się na smartfonie. Projektujemy ścieżkę zakupową dedykowaną dla kciuka — szybką, intuicyjną i bezbłędną.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* KARTA 4 — full width */}
              <div className="md:col-span-12">
                <Reveal delay={0.4}>
                  <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-[#050505] border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 shadow-[0_0_40px_-15px_rgba(245,158,11,0.15)] group">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <BarChart3 size={32} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 relative z-10">Analityka i wzrost sprzedaży</h3>
                    <p className="text-slate-400 text-lg max-w-2xl relative z-10 leading-relaxed">
                      Wbudowana analityka, śledzenie porzuconych koszyków i automatyczne maile reaktywujące klientów. Danych jest więcej — strat mniej.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </div>

        {/* --- ZAKRES PRAC SCROLL LOCK --- */}
        <section ref={scopeRef} className="relative h-[300vh] bg-[#050505] z-30">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24 h-full pt-24 md:pt-40">

              <div className="lg:w-5/12 text-center lg:text-left shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 mx-auto lg:mx-0">
                  <CheckCircle2 size={14} /> Zakres prac
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Co dokładnie <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    otrzymujesz?
                  </span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Sklep gotowy do sprzedaży od pierwszego dnia. Bez konieczności zatrudniania specjalisty do utrzymania.
                </p>
              </div>

              <div className="lg:w-7/12 relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)] pb-32">
                <motion.div
                  style={{ y: scopeCardsY }}
                  className="flex flex-col gap-6 w-full absolute top-0 left-0 pb-[20vh]"
                >
                  {[
                    { title: 'Projekt graficzny sklepu', desc: 'Spójny, markowy wygląd dopasowany do Twojego brandu — karty produktów, strona główna, checkout.' },
                    { title: 'Konfiguracja katalogu', desc: 'Dodawanie produktów, kategorii, atrybutów (rozmiary, kolory), wariantów i zdjęć w wysokiej jakości.' },
                    { title: 'Bramki płatności', desc: 'Pełna integracja Przelewy24 lub Stripe — BLIK, karty, Apple Pay, Google Pay, płatności odroczone.' },
                    { title: 'Integracja kurierów', desc: 'Automatyczne generowanie etykiet i śledzenie paczek przez InPost, DPD, DHL i Pocztę Polską.' },
                    { title: 'Optymalizacja konwersji', desc: 'Szybki checkout bez rejestracji, cross-sell, porzucone koszyki, promocje i kupony rabatowe.' },
                    { title: 'Wdrożenie i szkolenie', desc: 'Publikacja sklepu, konfiguracja hostingu, SSL i panel administracyjny — prowadzisz sklep samodzielnie.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-start gap-6 group"
                    >
                      <div className="absolute -bottom-6 right-0 text-[160px] md:text-[200px] font-black text-amber-500/5 group-hover:text-amber-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                        0{i + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] border border-amber-500/20">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="relative z-10 flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 leading-relaxed text-base md:text-lg">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <div className="container mx-auto px-6 relative z-40 bg-[#050505]">
          <section className="border-t border-white/10 pt-20 pb-20">
            <AvenlyAICta />
          </section>
        </div>

      </main>
    </div>
  );
}