'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Scale, Database, UserCheck, Cookie,
  Share2, Clock, Shield, ExternalLink, Users, RefreshCw, Mail,
} from 'lucide-react';
import { CONTACT, SITE, ADDRESS, COMPANY_IDS } from '@/lib/seo-data';

// ── Metadane dokumentu (wartości stałe dla wersjonowanego dokumentu prawnego) ──
const VERSION = '1.0';
const EFFECTIVE_DATE = '1 czerwca 2026 r.';

// ── Dane administratora (puste pola z seo-data są pomijane) ──
const fullAddress = [
  ADDRESS.streetAddress,
  [ADDRESS.postalCode, ADDRESS.addressLocality].filter(Boolean).join(' '),
].filter(Boolean).join(', ');

const ADMIN_ROWS: { label: string; value: React.ReactNode }[] = [
  { label: 'Podmiot', value: 'Avenly - Agencja Interaktywna' },
  ...(fullAddress ? [{ label: 'Adres siedziby', value: fullAddress }] : []),
  ...(COMPANY_IDS.nip ? [{ label: 'NIP', value: COMPANY_IDS.nip }] : []),
  ...(COMPANY_IDS.regon ? [{ label: 'REGON', value: COMPANY_IDS.regon }] : []),
  {
    label: 'E-mail',
    value: <a href={`mailto:${CONTACT.email}`} className="text-blue-400 hover:underline">{CONTACT.email}</a>,
  },
  {
    label: 'Telefon',
    value: (
      <span className="flex flex-wrap gap-x-3 gap-y-1">
        <a href={`tel:${CONTACT.phone}`} className="text-blue-400 hover:underline">{CONTACT.phoneDisplay}</a>
        <a href={`tel:${CONTACT.phone2}`} className="text-blue-400 hover:underline">{CONTACT.phone2Display}</a>
      </span>
    ),
  },
  {
    label: 'Strona internetowa',
    value: <a href={SITE.url} className="text-blue-400 hover:underline">avenly.pl</a>,
  },
];

// ── Podstawy prawne (sekcja 2) ──
const LEGAL_ACTS = [
  'Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO/GDPR);',
  'Ustawy z dnia 10 maja 2018 r. o ochronie danych osobowych;',
  'Ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną;',
  'Ustawy z dnia 16 lipca 2004 r. Prawo telekomunikacyjne (w zakresie cookies);',
  'Ustawy z dnia 23 kwietnia 1964 r. Kodeks cywilny (w zakresie umów).',
];

const LEGAL_BASES = [
  { art: 'Art. 6 ust. 1 lit. a RODO', name: 'zgoda osoby', use: 'Marketing, cookies nieobowiązkowe, newsletter', period: 'do odwołania' },
  { art: 'Art. 6 ust. 1 lit. b RODO', name: 'umowa', use: 'Realizacja usług, kontakt przed umową', period: 'czas trwania umowy + 3 lata' },
  { art: 'Art. 6 ust. 1 lit. c RODO', name: 'obowiązek prawny', use: 'Dokumentacja księgowa i podatkowa', period: '5 lat od końca roku' },
  { art: 'Art. 6 ust. 1 lit. f RODO', name: 'prawnie uzasadniony interes', use: 'Analityka, bezpieczeństwo, dochodzenie roszczeń', period: 'do czasu sprzeciwu' },
];

// ── Cele przetwarzania (sekcja 3) ──
const PURPOSES = [
  { t: 'Kontakt i zapytania ofertowe', d: 'Dane podane w formularzu kontaktowym lub przesłane drogą elektroniczną przetwarzamy w celu udzielenia odpowiedzi i ewentualnego zawarcia umowy. Zakres: imię i nazwisko, adres e-mail, numer telefonu, treść wiadomości.' },
  { t: 'Świadczenie usług', d: 'Dane klientów przetwarzamy w celu świadczenia usług z zakresu tworzenia stron internetowych, kampanii reklamowych, projektowania graficznego, marketingu internetowego oraz innych usług interaktywnych objętych umową.' },
  { t: 'Rozliczenia i dokumentacja księgowa', d: 'Dane niezbędne do wystawiania faktur i prowadzenia dokumentacji księgowej przechowujemy przez okres wymagany przepisami prawa podatkowego (co do zasady 5 lat od końca roku, w którym nastąpiło zdarzenie gospodarcze).' },
  { t: 'Marketing własnych usług', d: 'Informacje o usługach i ofercie przesyłamy wyłącznie za wyraźną uprzednią zgodą (art. 6 ust. 1 lit. a RODO) lub w ramach prawnie uzasadnionego interesu wobec dotychczasowych klientów (art. 6 ust. 1 lit. f RODO). Zgodę można w każdej chwili wycofać.' },
  { t: 'Analityka i doskonalenie usług', d: 'Anonimowe i zagregowane dane statystyczne dotyczące korzystania ze strony (np. Google Analytics) przetwarzamy na podstawie uzasadnionego interesu. Szczegóły dotyczące plików cookies znajdziesz w rozdziale 5.' },
  { t: 'Bezpieczeństwo i zapobieganie nadużyciom', d: 'Dane zawarte w logach serwera (adres IP, data i godzina żądania, adres URL) przetwarzamy w celu zapewnienia bezpieczeństwa infrastruktury. Logi przechowujemy przez 12 miesięcy.' },
];

// ── Prawa osób (sekcja 4) ──
const RIGHTS = [
  { name: 'Prawo dostępu (art. 15 RODO)', desc: 'Uzyskanie informacji o przetwarzanych danych oraz kopii danych.' },
  { name: 'Prawo do sprostowania (art. 16 RODO)', desc: 'Poprawienie lub uzupełnienie nieprawidłowych danych.' },
  { name: 'Prawo do usunięcia (art. 17 RODO)', desc: 'Żądanie usunięcia danych („prawo do bycia zapomnianym").' },
  { name: 'Prawo do ograniczenia (art. 18 RODO)', desc: 'Ograniczenie przetwarzania danych w określonych sytuacjach.' },
  { name: 'Prawo do przenoszenia (art. 20 RODO)', desc: 'Otrzymanie danych w ustrukturyzowanym, powszechnie używanym formacie.' },
  { name: 'Prawo sprzeciwu (art. 21 RODO)', desc: 'Sprzeciw wobec przetwarzania na podstawie prawnie uzasadnionego interesu.' },
  { name: 'Prawo skargi (art. 77 RODO)', desc: 'Złożenie skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).' },
];

// ── Cookies (sekcja 5) ──
const COOKIE_GROUPS = [
  {
    label: 'A) Niezbędne (wymagane)',
    note: 'Niezbędne do prawidłowego funkcjonowania strony. Nie wymagają zgody użytkownika (podstawa: uzasadniony interes / niezbędność techniczna).',
    consent: false,
    rows: [
      { name: 'PHPSESSID / sess_*', provider: 'avenly.pl', purpose: 'Utrzymanie sesji użytkownika', validity: 'Sesja' },
      { name: 'cookie_consent', provider: 'avenly.pl', purpose: 'Zapamiętanie decyzji w sprawie zgody na cookies', validity: '12 miesięcy' },
      { name: 'csrf_token', provider: 'avenly.pl', purpose: 'Ochrona przed atakami CSRF', validity: 'Sesja' },
    ],
  },
  {
    label: 'B) Analityczne',
    note: 'Zbierają informacje o sposobie korzystania ze strony. Wymagają zgody użytkownika.',
    consent: true,
    rows: [
      { name: '_ga', provider: 'Google Analytics', purpose: 'Rozróżnianie użytkowników', validity: '2 lata' },
      { name: '_ga_*', provider: 'Google Analytics', purpose: 'Przechowywanie stanu sesji', validity: '2 lata' },
      { name: '_gid', provider: 'Google Analytics', purpose: 'Rozróżnianie użytkowników', validity: '24 godziny' },
      { name: '_gat', provider: 'Google Analytics', purpose: 'Ograniczanie liczby żądań', validity: '1 minuta' },
      { name: '_gcl_au', provider: 'Google AdSense', purpose: 'Śledzenie konwersji reklam', validity: '3 miesiące' },
    ],
  },
  {
    label: 'C) Marketingowe i remarketingowe',
    note: 'Stosowane w celu wyświetlania spersonalizowanych reklam i pomiaru skuteczności kampanii. Wymagają zgody użytkownika.',
    consent: true,
    rows: [
      { name: '_fbp', provider: 'Meta (Facebook)', purpose: 'Identyfikacja użytkowników na potrzeby reklam', validity: '3 miesiące' },
      { name: '_fbc', provider: 'Meta (Facebook)', purpose: 'Śledzenie kliknięć reklam', validity: '2 lata' },
      { name: 'IDE', provider: 'Google DoubleClick', purpose: 'Reklamy remarketingowe Google', validity: '13 miesięcy' },
      { name: 'test_cookie', provider: 'Google DoubleClick', purpose: 'Sprawdzenie obsługi cookies', validity: '15 minut' },
      { name: 'li_sugr', provider: 'LinkedIn', purpose: 'Identyfikacja użytkowników (marketing B2B)', validity: '3 miesiące' },
    ],
  },
  {
    label: 'D) Funkcjonalne',
    note: 'Umożliwiają zapamiętanie preferencji użytkownika. Wymagają zgody użytkownika.',
    consent: true,
    rows: [
      { name: 'lang_pref', provider: 'avenly.pl', purpose: 'Zapamiętanie wybranego języka', validity: '12 miesięcy' },
      { name: 'theme_pref', provider: 'avenly.pl', purpose: 'Zapamiętanie motywu strony (jasny/ciemny)', validity: '6 miesięcy' },
    ],
  },
];

// ── Odbiorcy danych (sekcja 6) ──
const PROCESSORS = [
  'dostawcy usług hostingowych i serwerowych;',
  'dostawcy narzędzi analitycznych (Google LLC - Google Analytics);',
  'dostawcy narzędzi marketingowych (Meta Platforms Ireland Ltd., Google LLC);',
  'dostawcy oprogramowania CRM i narzędzi do obsługi klienta;',
  'podmioty realizujące usługi księgowe i podatkowe;',
  'dostawcy usług prawnych;',
  'podmioty dostarczające oprogramowanie do obsługi płatności.',
];

const TRANSFER_SAFEGUARDS = [
  'standardowe klauzule umowne zatwierdzone przez Komisję Europejską;',
  'uczestnictwo dostawcy w programie DPF (Data Privacy Framework);',
  'inne mechanizmy zapewniające odpowiedni poziom ochrony.',
];

// ── Okres przechowywania (sekcja 7) ──
const RETENTION = [
  { what: 'Dane z formularza kontaktowego', period: 'Do czasu obsługi zapytania + 3 lata (roszczenia)' },
  { what: 'Dane klientów (umowy)', period: 'Czas trwania umowy + 5-10 lat (obowiązki prawne)' },
  { what: 'Dokumenty księgowe i faktury', period: '5 lat od końca roku obrotowego (ustawa o rachunkowości)' },
  { what: 'Dane marketingowe (newsletter)', period: 'Do momentu wypisania się / odwołania zgody' },
  { what: 'Logi serwera (adres IP)', period: '12 miesięcy' },
  { what: 'Dane analityczne (cookies)', period: 'Według okresu ważności cookie (maks. 2 lata)' },
];

// ── Bezpieczeństwo (sekcja 8) ──
const SECURITY = [
  'szyfrowanie transmisji danych przy użyciu protokołu TLS/SSL (certyfikat HTTPS);',
  'kontrola dostępu do danych oparta na zasadzie minimalnych uprawnień;',
  'regularne tworzenie kopii zapasowych;',
  'monitoring i detekcja nieautoryzowanych prób dostępu;',
  'szkolenia osób z zakresu ochrony danych osobowych;',
  'pseudonimizacja i anonimizacja danych tam, gdzie to możliwe;',
  'procedury reagowania na incydenty bezpieczeństwa zgodnie z art. 33 RODO.',
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">

      {/* --- TŁO DEKORACYJNE --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
              Polityka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">prywatności</span> i cookies
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest">
                <Shield size={12} className="text-blue-400" />
                Ochrona danych
              </span>
              <span className="text-sm">Wersja {VERSION}</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm">Obowiązuje od <span className="text-white">{EFFECTIVE_DATE}</span></span>
            </div>
            <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-2xl">
              Dbamy o Twoją prywatność. Poniżej wyjaśniamy, jakie dane zbieramy, w jakim celu, na jakiej podstawie prawnej oraz jakie masz prawa zgodnie z RODO.
            </p>
          </motion.div>
        </div>

        {/* --- GŁÓWNA TREŚĆ (KARTY) --- */}
        <div className="grid gap-8">

          {/* 1. Administrator */}
          <PolicySection icon={Building2} title="1. Administrator danych osobowych" delay={0.05}>
            <p className="mb-6">
              Administratorem danych osobowych przetwarzanych za pośrednictwem strony internetowej oraz w ramach świadczonych usług jest:
            </p>
            <dl className="grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-3 rounded-2xl bg-white/[0.03] border border-white/5 p-5 sm:p-6">
              {ADMIN_ROWS.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-sm text-slate-500 uppercase tracking-wider">{row.label}</dt>
                  <dd className="text-white mb-2 sm:mb-0">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-base">
              W sprawach dotyczących ochrony danych osobowych możesz skontaktować się pod adresem e-mail podanym powyżej lub pisemnie na adres siedziby Administratora.
            </p>
          </PolicySection>

          {/* 2. Podstawy prawne */}
          <PolicySection icon={Scale} title="2. Podstawy prawne przetwarzania" delay={0.05}>
            <p className="mb-4">Przetwarzanie danych osobowych odbywa się na podstawie:</p>
            <BulletList items={LEGAL_ACTS} />
            <p className="mt-8 mb-4 text-white font-semibold">Podstawy przetwarzania w zależności od celu:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {LEGAL_BASES.map((b) => (
                <div key={b.art} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
                  <div className="text-blue-400 font-mono text-xs mb-2">{b.art}</div>
                  <div className="text-white font-semibold mb-2 capitalize">{b.name}</div>
                  <p className="text-sm text-slate-400 mb-3">{b.use}</p>
                  <div className="text-xs text-slate-500">
                    <span className="uppercase tracking-wider">Okres:</span> {b.period}
                  </div>
                </div>
              ))}
            </div>
          </PolicySection>

          {/* 3. Cele i zakres */}
          <PolicySection icon={Database} title="3. Cele i zakres przetwarzania danych" delay={0.05}>
            <div className="space-y-5">
              {PURPOSES.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-blue-400 font-mono text-sm font-bold shrink-0 mt-0.5">3.{i + 1}</span>
                  <div>
                    <strong className="text-white block mb-1">{p.t}</strong>
                    <span className="text-base">{p.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </PolicySection>

          {/* 4. Prawa */}
          <PolicySection icon={UserCheck} title="4. Prawa osób, których dane dotyczą" delay={0.05}>
            <p className="mb-5">Osobom, których dane przetwarzamy, przysługują następujące prawa:</p>
            <ul className="grid sm:grid-cols-2 gap-4 mb-8">
              {RIGHTS.map((r) => (
                <li key={r.name} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                  <strong className="text-white block mb-1 text-sm">{r.name}</strong>
                  <span className="text-sm text-slate-400">{r.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-base mb-6">
              Wnioski możesz składać drogą elektroniczną na adres e-mail Administratora. Odpowiedź udzielimy w terminie do 30 dni od otrzymania wniosku.
            </p>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 text-sm">
              <div className="text-white font-semibold mb-1">Prezes Urzędu Ochrony Danych Osobowych (UODO)</div>
              <div className="text-slate-400">ul. Stawki 2, 00-193 Warszawa</div>
              <div className="text-slate-400">Infolinia: 606-950-000</div>
              <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1">
                uodo.gov.pl <ExternalLink size={12} />
              </a>
            </div>
          </PolicySection>

          {/* 5. Cookies */}
          <PolicySection icon={Cookie} title="5. Polityka plików cookies" delay={0.05}>
            <p className="mb-2 text-white font-semibold">5.1. Czym są pliki cookies?</p>
            <p className="mb-8">
              Pliki cookies (ciasteczka) to niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika (komputerze, tablecie, smartfonie) przez przeglądarkę internetową podczas odwiedzin strony. Cookies umożliwiają stronie zapamiętanie preferencji i aktywności użytkownika.
            </p>

            <p className="mb-5 text-white font-semibold">5.2. Rodzaje stosowanych plików cookies</p>
            <div className="space-y-6">
              {COOKIE_GROUPS.map((g) => (
                <div key={g.label}>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-base">{g.label}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${g.consent ? 'text-amber-300 border-amber-500/30 bg-amber-500/10' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}>
                      {g.consent ? 'Wymaga zgody' : 'Bez zgody'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{g.note}</p>
                  <div className="grid gap-2">
                    {g.rows.map((c) => (
                      <div key={c.name} className="grid sm:grid-cols-[200px_1fr_auto] gap-1 sm:gap-4 sm:items-center rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                        <div className="font-mono text-blue-300 text-sm break-words">{c.name}</div>
                        <div className="text-sm text-slate-400">
                          <span className="text-slate-500">{c.provider}</span> · {c.purpose}
                        </div>
                        <div className="text-xs text-slate-500 sm:text-right whitespace-nowrap">{c.validity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 mb-2 text-white font-semibold">5.3. Zarządzanie plikami cookies</p>
            <p className="mb-4">Ustawienia plików cookies możesz zmienić w każdej chwili:</p>
            <BulletList items={[
              'Baner zgody cookies - dostępny przy pierwszej wizycie oraz w każdej chwili za pośrednictwem przycisku na stronie.',
              'Ustawienia przeglądarki (Chrome, Firefox, Safari, Edge) - w sekcji prywatności i bezpieczeństwa.',
            ]} />
            <div className="flex flex-wrap gap-3 mt-4 mb-6">
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm inline-flex items-center gap-1">
                Google Analytics opt-out <ExternalLink size={12} />
              </a>
              <a href="https://www.facebook.com/off_facebook_activity" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm inline-flex items-center gap-1">
                Facebook Off-Facebook Activity <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-sm text-slate-500 mb-8">
              Wyłączenie cookies niezbędnych może uniemożliwić prawidłowe funkcjonowanie strony.
            </p>

            <p className="mb-2 text-white font-semibold">5.4. Zgoda na cookies</p>
            <p>
              Przy pierwszej wizycie prezentujemy baner cookies umożliwiający wyrażenie lub odmowę zgody na poszczególne kategorie plików (z wyjątkiem niezbędnych). Zgoda jest dobrowolna i może być odwołana w każdej chwili. Decyzja dotycząca cookies zapisywana jest przez 12 miesięcy.
            </p>
          </PolicySection>

          {/* 6. Odbiorcy danych */}
          <PolicySection icon={Share2} title="6. Odbiorcy danych i przekazywanie poza EOG" delay={0.05}>
            <p className="mb-2 text-white font-semibold">6.1. Podmioty przetwarzające</p>
            <p className="mb-4">
              Dane osobowe mogą być udostępniane podmiotom przetwarzającym, z którymi zawarliśmy umowy powierzenia przetwarzania danych:
            </p>
            <BulletList items={PROCESSORS} />
            <p className="mt-8 mb-2 text-white font-semibold">6.2. Przekazywanie danych do państw trzecich</p>
            <p className="mb-4">
              Część dostawców usług (w szczególności Google LLC i Meta Platforms) przetwarza dane na serwerach poza Europejskim Obszarem Gospodarczym (EOG). W takich przypadkach zapewniamy odpowiednie zabezpieczenia zgodnie z art. 46 RODO:
            </p>
            <BulletList items={TRANSFER_SAFEGUARDS} />
            <p className="mt-4 text-sm text-slate-500">
              Szczegółowe informacje dostępne są w politykach prywatności poszczególnych dostawców.
            </p>
          </PolicySection>

          {/* 7. Okres przechowywania */}
          <PolicySection icon={Clock} title="7. Okres przechowywania danych" delay={0.05}>
            <div className="grid gap-2">
              {RETENTION.map((r) => (
                <div key={r.what} className="grid sm:grid-cols-2 gap-1 sm:gap-4 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <div className="text-white text-sm font-medium">{r.what}</div>
                  <div className="text-sm text-slate-400">{r.period}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Po upływie okresu przechowywania dane są trwale usuwane lub anonimizowane.
            </p>
          </PolicySection>

          {/* 8. Bezpieczeństwo */}
          <PolicySection icon={Shield} title="8. Bezpieczeństwo danych" delay={0.05}>
            <p className="mb-4">Stosujemy techniczne i organizacyjne środki ochrony danych adekwatne do ryzyka:</p>
            <BulletList items={SECURITY} />
          </PolicySection>

          {/* 9. Linki zewnętrzne */}
          <PolicySection icon={ExternalLink} title="9. Linki do zewnętrznych stron" delay={0.05}>
            <p>
              Nasza strona może zawierać odnośniki do zewnętrznych stron internetowych (portale społecznościowe, strony klientów, partnerzy). Kliknięcie w taki link powoduje przejście do strony zewnętrznej podlegającej odrębnej polityce prywatności. Nie ponosimy odpowiedzialności za praktyki w zakresie ochrony danych stosowane przez administratorów stron trzecich. Zalecamy zapoznanie się z polityką prywatności każdej odwiedzanej strony.
            </p>
          </PolicySection>

          {/* 10. Media społecznościowe */}
          <PolicySection icon={Users} title="10. Media społecznościowe i wtyczki" delay={0.05}>
            <p className="mb-4">
              Nasza strona może korzystać z wtyczek lub przycisków społecznościowych (Facebook, LinkedIn, Instagram, X/Twitter). Wtyczki te mogą przekazywać dane (w tym adres IP) do serwisów społecznościowych nawet bez ich kliknięcia - w przypadku zalogowania do danego serwisu w tej samej przeglądarce.
            </p>
            <p>
              Stosujemy metodę „2 kliknięć" (Shariff), która aktywuje wtyczkę dopiero po świadomym wyborze użytkownika. Odpowiedzialność za przetwarzanie danych w ramach poszczególnych serwisów społecznościowych spoczywa na ich administratorach.
            </p>
          </PolicySection>

          {/* 11. Zmiany polityki */}
          <PolicySection icon={RefreshCw} title="11. Zmiany polityki prywatności" delay={0.05}>
            <p className="mb-4">
              Polityka Prywatności może być okresowo aktualizowana w związku ze zmianami przepisów prawa, rozwojem technologii lub poszerzeniem zakresu usług. Wszelkie istotne zmiany sygnalizujemy poprzez:
            </p>
            <BulletList items={[
              'widoczne powiadomienie na stronie głównej;',
              'wysłanie informacji e-mail do osób zapisanych na newsletter;',
              'aktualizację daty „Wersji" wskazanej na początku dokumentu.',
            ]} />
            <p className="mt-4 text-sm text-slate-500">
              Kontynuowanie korzystania ze strony po opublikowaniu zmian oznacza ich akceptację.
            </p>
          </PolicySection>

          {/* 12. Kontakt */}
          <PolicySection icon={Mail} title="12. Kontakt w sprawie ochrony danych" delay={0.05}>
            <p className="mb-6">
              Wszelkie pytania, wnioski oraz zastrzeżenia dotyczące przetwarzania danych osobowych i plików cookies prosimy kierować do Administratora.
            </p>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-blue-50 transition-colors">
              <Mail size={18} />
              {CONTACT.email}
            </a>
            <p className="mt-6 text-sm text-slate-500">
              Masz również prawo do złożenia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa,{' '}
              <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">uodo.gov.pl</a>).
            </p>
          </PolicySection>

        </div>

        {/* --- STOPKA DOKUMENTU --- */}
        <p className="mt-12 text-sm text-slate-500 leading-relaxed border-t border-white/5 pt-8">
          Niniejsza Polityka Prywatności i Cookies weszła w życie dnia {EFFECTIVE_DATE} i stanowi integralną część Regulaminu świadczenia usług drogą elektroniczną przez Avenly - Agencja Interaktywna.
        </p>

      </div>
    </main>
  );
}

// --- LISTA PUNKTOWANA ---
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
          <span className="text-base">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// --- KOMPONENT SEKCJI ---
function PolicySection({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="p-7 md:p-10 rounded-3xl bg-[#080808]/80 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <Icon size={24} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="text-slate-400 leading-relaxed text-base md:text-lg">
        {children}
      </div>
    </motion.section>
  );
}
