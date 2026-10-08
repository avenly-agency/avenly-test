// Wspólne elementy sekcji "Proces": akcenty etapów, skręt wstęgi i materiał SZKŁA w GLSL
// (szklana wstęga - ribbon.tsx, tła "Głębia" / "Soczewki" / "Tafle" - backdrop.tsx).

export type RGB = [number, number, number];

/** Akcenty etapów = jasne odcienie akcentów kart "Dlaczego Avenly" (błękit, indygo, bursztyn, zieleń). */
export const ACC: RGB[] = [[147, 197, 253], [199, 210, 254], [253, 230, 138], [167, 243, 208]];
export const ACC_S = ACC.map((c) => c.join(' '));
/**
 * Barwy WSTĘGI (2026-09-27, właściciel: "kolory wstęgi zmieniają się w zależności od elementu i płynnie
 * przechodzą, żeby wstęga wyróżniała się od tła, bo się zlewa"): nasycone akcenty kart "Dlaczego Avenly"
 * (błękit, fiolet, bursztyn, zieleń) - wzdłuż wstęgi kolor płynnie przechodzi od kroku do kroku; tło
 * Głębia jest neutralnym srebrnym szkłem, więc kolorowa wstęga się od niego odcina.
 */
export const RIBBON_ACC: RGB[] = [[96, 165, 250], [150, 140, 250], [250, 190, 60], [74, 222, 140]];
/** Neutralne, chłodne srebro szkła tła (z ledwie wyczuwalną nutą akcentu etapu). */
export const SILVER: RGB = [196, 206, 222];

export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Kąt skrętu wstęgi (2026-09-27, właściciel: "moment, jak się krzyżuje, zrób ładniej"): zamiast równego
 * obrotu (co ~600 px ustawienie bokiem = szczypnięcie) - pół obrotu na `flip` px, a w obrębie obrotu
 * `a = th - 0,35 * sin(2 th)`: przy licu obrót zwalnia (wstęga długo pokazuje szeroką taflę), przez
 * krawędź przechodzi szybko (krótki, zdecydowany moment). Druga, wolna fala rozrzuca skrzyżowania
 * nieregularnie. Monotoniczny (da/dth >= 0,3) - bez tam i z powrotem przy krawędzi.
 */
export const twistAngle = (s: number, flip: number, phase: number, seed = 1.3) => {
  const th = (s / flip) * Math.PI + 0.35 * Math.sin((s / 2300) * Math.PI * 2 + seed) + phase;
  return th - 0.35 * Math.sin(2 * th);
};
/**
 * Szerokość w poprzek przy skręcie: `hw * cos(a)`, ale nie węższa niż `minW` px - przy ustawieniu bokiem
 * wstęga zwęża się do cienkiej krawędzi szkła (jasnej, wygładzonej), zamiast znikać w punkt. Pochylenie
 * w perspektywie (krawędzie mijające się ukośnie) odrzucone: zakładki pasa dawały ząbki bez wygładzenia.
 */
export const crossWidth = (hw: number, a: number, minW: number) => {
  const w = hw * Math.cos(a);
  return w < 0 ? Math.min(w, -minW) : Math.max(w, minW);
};

/**
 * Szkło (GLSL): `glass(n, front, dpx, wpx, akcent 0-1, siła, próg refleksu, ostrość refleksu, nasycenie)` -> kolor z przemnożoną alfą.
 * n = normalna strony widocznej (z >= 0, ekran: x w prawo, y w dół), dpx = odległość od krawędzi (px),
 * wpx = szerokość (px), ht = próg refleksu (wstęga 0,972 = pasmo wzdłuż, kula 0,996 = małe okno), hwid = pół
 * szerokości przejścia refleksu w jednostkach h (~1 px: z fwidth albo analitycznie) - refleksy zawsze
 * ostro odcięte, bez rozmytych plam. Szkło luksusowe (2026-09-27, "zrób bardziej luksusowe"): krawędź jak szlif
 * kryształu - ostra zewnętrzna linia w chłodnym odcieniu i wewnętrzna linia grubości szkła w ciepłym
 * (delikatna dyspersja), odbicie przy ustawieniu bokiem (Fresnel) w barwie etapu, delikatne lico;
 * odbicia jak w studiu - OSTRO odcięte refleksy dwóch świateł (główne z lewej góry, chłodne z prawej)
 * zamiast rozmytego połysku (rozmyty dawał "mgiełkę" na kulach i szerokich wstęgach) + ostry blik h^90;
 * wnętrze lekko przydymione (alfa pochłania odrobinę tła - szkło ma "ciało").
 * Alfa >= każdy kanał koloru (poprawny kolor przemnożony).
 */
export const GLASS_GLSL = `
const vec3 SL = vec3(-0.38145, -0.52199, 0.76291);
const vec3 SH = vec3(-0.20314, -0.27799, 0.93886);
const vec3 SR = vec3(0.58835, 0.06193, 0.80624); // chłodne światło z boku - na kuli odbija się przy rąbku, nie obok głównego bliku
vec4 glass(vec3 n, float front, float dpx, float wpx, vec3 c, float k, float ht, float hwid, float sat) {
  float dif = max(0.0, (dot(n, SL) + 0.3) / 1.3);
  float h = max(0.0, dot(n, SH));
  float hr = max(0.0, dot(n, SR));
  float F = pow(1.0 - n.z, 3.0);
  // sat 0 = blade szkło (tło), 1 = barwione szkło (wstęga): mniej bieli w barwie, słabsza dyspersja krawędzi, wyraźniejsze lico.
  vec3 tint = mix(c, vec3(1.0), mix(0.55, 0.12, sat));
  vec3 cool = mix(tint, vec3(0.8, 0.92, 1.0), mix(0.5, 0.18, sat));
  vec3 warm = mix(tint, vec3(1.0, 0.9, 0.8), mix(0.5, 0.18, sat));
  float body = mix(0.035, 0.2, sat);
  float inner = mix(0.32, 0.5, sat);
  float lit = 0.5 + 0.5 * dif;
  float edgeOut = 1.0 - smoothstep(0.35, 1.5, dpx);
  float edgeIn = (1.0 - smoothstep(0.0, 1.1, abs(dpx - 4.5))) * smoothstep(16.0, 30.0, wpx);
  float face = mix(0.7, 1.0, front);
  float key = smoothstep(ht - hwid, ht + hwid, h) * 0.34;
  float rimLight = smoothstep(ht - hwid, ht + hwid, hr) * 0.14;
  vec3 L = cool * edgeOut * 0.9 * lit
         + warm * edgeIn * inner * lit
         + tint * (body + 0.34 * F) * face
         + (vec3(1.0) * key + cool * rimLight) * front;
  L *= k;
  float a = max((0.07 + 0.14 * F) * k, max(L.r, max(L.g, L.b)));
  return vec4(L, a);
}`;
