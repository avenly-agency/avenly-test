// Bramka „koniec wejścia hero” (wydajność, 2026-10-09 - właściciel: „jak wszystkie elementy na hero się pojawiają,
// to jest lag”). Wejście hero (napis AVENLY + cięcie gwiazdą, tekst) gra ~3 s; w tym czasie NIE ożywiamy reszty
// strony (hydratacja sekcji poniżej w HomeClient, czat i baner cookies w DeferredClientWidgets). Sygnał daje scena
// hero (hero/scene.ts), gdy logotyp skończy wejście. Wcześniej puszcza: przewinięcie strony, brak hero na stronie,
// strona otwarta niżej niż hero, bezpiecznik czasu.

export const HERO_INTRO_DONE = 'avenly:hero-intro-done';

let done = false;

/** Scena hero: wejście skończone (raz). */
export const markHeroIntroDone = () => {
  if (done || typeof window === 'undefined') return;
  done = true;
  window.dispatchEvent(new Event(HERO_INTRO_DONE));
};

/** Obietnica spełniona po wejściu hero (albo od razu, gdy na stronie nie ma hero / strona jest przewinięta). */
export const afterHeroIntro = (timeout = 5000): Promise<void> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined' || done || window.scrollY > 40 || !document.querySelector('.hero')) {
      resolve();
      return;
    }
    const finish = () => {
      window.clearTimeout(timer);
      window.removeEventListener(HERO_INTRO_DONE, finish);
      window.removeEventListener('scroll', finish);
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);
    window.addEventListener(HERO_INTRO_DONE, finish);
    window.addEventListener('scroll', finish, { passive: true });
  });
