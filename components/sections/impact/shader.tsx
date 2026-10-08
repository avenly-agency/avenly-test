'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { VIZ_EPOCH, type ShaderScene } from './viz';

// === SHADERY KAFLI "Dlaczego Avenly" ===
// Każda karta: warstwice terenu (snoise) w swoim kolorze + wizualizacja-konstelacja wtopiona w teren
// (VIZ_GLSL: szczyty w węzłach, grzbiety wzdłuż połączeń, impuls). Wspólny VS + snoise + VIZ_GLSL +
// ShaderCanvas, tylko FS różny per kafel (szum, kolor). Scena (viz.tsx SCENES) przychodzi w pikselach
// bufora, zmierzona z położenia nakładki z podpisami.
// 2026-09-26, runda 4 (właściciel: "zbyt przytłaczające, cienie za tekstem brzydkie, z wyczuciem
// jak w poprzedniej wersji, bez hovera"):
// - warstwice = cienkie "rytowane" linie: grubość łagodnie rośnie tylko na płaskim terenie
//   (0,55-1,7 px CSS - organicznie jak dawniej, ale z ostrą krawędzią 1 px zamiast rozmycia),
//   gdzie zbiegają się gęściej niż ~3 px, gasną (bez ziarnistej mgiełki);
// - całość stonowana (jasność maks. ~0,6), jaśniej po stronie wizualizacji i przy krawędziach;
//   pod kolumną tekstu MIĘKKIE, szerokie wygaszenie (elipsa z DOM) - NIE prostokątne maski
//   (wyglądały jak cienie za tekstem);
// - lekkie cieniowanie z lewej góry i wysokości (głębia z wyczuciem, bez kontrastu Tanaki);
// - bez paralaksy za kursorem (efekt najechania - usunięty), teren nie przeskakuje po pauzie
//   (u_tt = czas terenu liczony tylko, gdy płótno pracuje; historia dalej na wspólnej osi u_time).
// 2026-09-26, runda 6 (właściciel: "pierwotnie były zbalansowane - shader tam, gdzie powinien być,
// a tam, gdzie tekst, zostawione; zrób to na full box, a nie takie małe"): teren na CAŁEJ karcie
// z rozkładem jak w pierwotnych kaflach - pełna jasność w "kałuży światła" wokół wizualizacji
// i przy krawędziach po jej stronie, spadek sześcienny (jak dawne a³) ku kolumnie tekstu, która
// zostaje czysta. Wariant "okno-instrument" z rundy 5 usunięty.

const SHADER_VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const SNOISE_GLSL = `
vec3 mod289_3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289_2(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute3(vec3 x){ return mod289_3(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289_2(i);
  vec3 p = permute3(permute3(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}
`;

// Scena w jednostkach viewBoxa nakładki (u_vp.y = pikseli bufora na jednostkę), pozycje w pikselach
// bufora (y od dołu). u_n: węzeł xy, z = rodzaj (1 kropka, 2 gwiazda, 3 pierścień, 4 atak, 5 kropka
// łuku), w = chwila dotarcia (s) albo -1. u_e / u_et: krawędź a, b / start (s), atak, typ (0 impuls
// ze śladem, 1 wypełnienie, 2 grzbiet), czas wypełnienia. Impuls przelatuje odcinek w 20% cyklu
// (TRAVEL w viz.tsx). Historia (ślad, zapalone węzły) gaśnie w ostatnich ~0,8 s cyklu - razem
// z podpisami (viz.tsx RESET_LEAD).
const VIZ_GLSL = `
#define VMAXN 12
#define VMAXE 12
uniform vec4 u_vp;        // x: włączone, y: px bufora na jednostkę, z: cykl (s)
uniform vec4 u_cnt;       // x: węzły, y: krawędzie
uniform vec4 u_n[VMAXN];
uniform vec4 u_e[VMAXE];
uniform vec4 u_et[VMAXE];
uniform vec4 u_par;       // xy: paralaksa terenu (jedn. p) przy przewijaniu, z: px bufora na px CSS
uniform vec4 u_tx;        // kolumna tekstu: środek xy, półosie zw (px bufora); z = 0 - brak
uniform vec4 u_tc;        // napis kroku historii: jak u_tx (łagodniejsze wygaszenie)
uniform vec4 u_te;        // dodatek pod tekstem (wynik 98/100, link): jak u_tx
uniform vec4 u_vb;        // obszar sceny z zapasem (px bufora) - poza nim wizualizacja się nie liczy

const vec2 VLIGHT = vec2(-0.6, 0.8); // światło z lewej góry (y w górę)
float vU = 1.0; // px bufora na jednostkę sceny (ustawia vizRun)

#ifdef HAS_DERIV
float vFw(float x) { return fwidth(x); }
vec2 vD(float x) { return vec2(dFdx(x), dFdy(x)); }
#else
float vFw(float x) { return 0.05; }
vec2 vD(float x) { return vec2(0.0, -1.0); }
#endif

float vSq(float x) { return x * x; }
// Ostre prymitywy: pokrycie linii / koła / okręgu (d, r w jednostkach sceny, w = szerokość w px
// CSS), krawędź wygładzona na 1 px bufora - bez rozmycia.
float vLine(float d, float w) { return clamp(0.5 * w * u_par.z + 0.5 - d * vU, 0.0, 1.0); }
float vDisc(float d, float r) { return clamp((r - d) * vU + 0.5, 0.0, 1.0); }
float vRing(float d, float r, float w) { return vLine(abs(d - r), w); }
float vSeg(vec2 p, vec2 a, vec2 b, out float s) {
  vec2 pa = p - a, ba = b - a;
  s = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * s);
}
float vFlash(float ct, float at, float cyc) { return exp(-mod(ct - at, cyc) * 3.0); }
// Dotarcie do węzła: delikatny ostry pierścień rozchodzący się od promienia r0 (ok. 1 s).
float vPing(float d, float r0, float age) {
  if (age < 0.0 || age > 1.0) return 0.0;
  return vRing(d, r0 + age * 16.0, 1.1) * vSq(1.0 - age);
}
// Promienie gwiazdy: cienkie linie zwężające się ku końcom (długość L jednostek).
float vSpikes(vec2 q, float L) {
  vec2 a = abs(q);
  float fx = clamp(1.0 - a.x / L, 0.0, 1.0);
  float fy = clamp(1.0 - a.y / L, 0.0, 1.0);
  return max(vLine(a.y, 1.1 * fx) * fx, vLine(a.x, 1.1 * fy) * fy);
}

// Warstwice: cienkie "rytowane" linie - grubość łagodnie rośnie tam, gdzie teren jest płaski
// (0,55-1,7 px CSS, jak dawniej organicznie), krawędź 1 px bufora; gdzie zbiegają się gęściej
// niż ~3 px, gasną. Lekkie cieniowanie od lewej góry i wysokości. h = wysokość, k = h * gęstość.
float vContours(float h, float k) {
  float w = max(vFw(k), 1e-4);
  float wpx = clamp(0.06 / w, 0.55 * u_par.z, 1.7 * u_par.z);
  float cov = clamp(0.5 * wpx + 0.5 - abs(fract(k - 0.5) - 0.5) / w, 0.0, 1.0);
  cov *= 1.0 - smoothstep(0.2, 0.42, w);
  vec2 g = vD(h);
  float lit = dot(-g / max(length(g), 1e-6), VLIGHT);
  return cov * mix(0.62, 1.0, smoothstep(-0.8, 0.8, lit)) * mix(0.72, 1.0, smoothstep(-1.0, 1.2, h));
}

// Rozkład terenu na całej karcie (jak w pierwotnych kaflach): "kałuża światła" za wizualizacją
// (środek obszaru sceny u_vb przesunięty ku górnemu rogowi karty po stronie wizualizacji - także
// w kartach lustrzanych - jasność schodzi po skosie ku przeciwległemu rogowi) + wzmocnienie przy krawędziach, całość do sześcianu (jak widoczna jasność
// dawnych kafli, a³ - pełny kolor tylko tam, gdzie ma być). Pod kolumną tekstu szerokie, łagodne
// wygaszenie do zera (elipsa z DOM, liniowo - bez "ściany"), pod napisem kroku słabsze.
float vTileF(vec2 fp, vec2 res) {
  float asp = res.x / res.y;
  vec2 k = vec2(asp, 1.0);
  vec2 p = (fp / res * 2.0 - 1.0) * k;
  vec2 c = u_vp.x > 0.5 ? ((u_vb.xy + u_vb.zw) / res - 1.0) * k : vec2(0.4 * asp, 0.2);
  // Układ karty z położenia tekstu względem wizualizacji (nie z proporcji): obok siebie (komputer)
  // albo jedno pod drugim (telefon, tablet) - na telefonie proporcje szerokiej karty dawały
  // jasne warstwice pod tekstem.
  vec2 tc = u_tx.z > 0.5 ? (u_tx.xy / res * 2.0 - 1.0) * k : vec2(-0.5 * asp, 0.3);
  vec2 dv = c - tc;
  float sx = dv.x < 0.0 ? -1.0 : 1.0; // karta lustrzana: wizualizacja po lewej
  float sy = dv.y < 0.0 ? -1.0 : 1.0; // wizualizacja pod tekstem: -1
  float F;
  float edge;
  if (abs(dv.x) > abs(dv.y)) {
    c += vec2(0.45 * sx, 0.45);
    F = smoothstep(2.9, 0.2, length((p - c) * vec2(0.75, 1.0)));
    // Druga, słabsza kałuża w rogu po stronie tekstu, naprzeciw tekstu (tekst u góry - róg dolny,
    // u dołu - górny): pusta część kolumny tekstu nie zostaje czarną plamą, kompozycja po skosie.
    if (u_tx.z > 0.5) {
      float yc = tc.y > 0.0 ? -1.0 : 1.0;
      F = max(F, 0.78 * smoothstep(1.9, 0.15, length((p - vec2(-sx * asp * 0.9, yc)) * vec2(0.8, 1.0))));
    }
    edge = max(max(smoothstep(0.55, 0.98, p.y), smoothstep(0.55, 0.98, -p.y)),
               max(smoothstep(asp - 0.5, asp - 0.02, p.x), smoothstep(asp - 0.5, asp - 0.02, -p.x)));
  } else {
    // Jedno pod drugim: kałuża przy wizualizacji, krawędzie tylko po jej stronie - nad tekstem czysto.
    c += vec2(0.2, 0.3 * sy);
    F = smoothstep(1.7, 0.15, length(p - c));
    float away = smoothstep(-0.1, 0.5, (p.y - tc.y) * sy);
    edge = max(smoothstep(0.55, 0.98, p.y * sy),
               max(smoothstep(asp - 0.35, asp - 0.02, p.x), smoothstep(asp - 0.35, asp - 0.02, -p.x)) * away);
  }
  F = min(F * (1.0 + 0.4 * edge), 1.0);
  F = F * F * F;
  if (u_tx.z > 0.5) F *= smoothstep(0.5, 1.7, length((fp - u_tx.xy) / u_tx.zw));
  if (u_te.z > 0.5) F *= smoothstep(0.35, 1.5, length((fp - u_te.xy) / u_te.zw));
  if (u_tc.z > 0.5) F *= mix(0.4, 1.0, smoothstep(0.45, 1.25, length((fp - u_tc.xy) / u_tc.zw)));
  return F;
}

// vh: wkład w wysokość (warstwice), calm: ile wygasić szum przy cechach (warstwice układają się
// w pierścienie / linie wokół nich), vg: jasność ostrych elementów, vhot / valert: udział bieli /
// czerwieni ataku w vg, near: bliskość cech (odsłania kontury), clr: "fosa" wokół wizualizacji.
void vizScene(vec2 fp, float t, inout float vh, inout float calm, inout float vg, inout float vhot, inout float valert, inout float near, inout float clr) {
  float U = vU;
  float cyc = max(u_vp.z, 0.1);
  float ct = mod(t, cyc);
  float fade = 1.0 - smoothstep(cyc - 0.85, cyc - 0.2, ct); // koniec cyklu: historia gaśnie (reset)

  for (int i = 0; i < VMAXE; i++) {
    if (float(i) >= u_cnt.y) break;
    vec4 e = u_e[i];
    vec4 et = u_et[i];
    float ty = et.z;
    float s;
    float d = vSeg(fp, e.xy, e.zw, s) / U;
    float dd = d * d;
    float lenU = max(length(e.zw - e.xy) / U, 1e-3);
    float alertE = et.y;
    vh += 0.5 * exp(-dd / 160.0);                // grzbiet: warstwice biegną wzdłuż połączenia
    calm += 0.8 * exp(-dd / 200.0);
    near += exp(-dd / 420.0);
    clr = max(clr, 1.0 - smoothstep(2.5, 8.0, d));
    float raw = ct - et.x;
    if (ty < 0.5) {                              // 0: impuls - przed nim linia przygaszona, za nim ślad
      float bl = 0.32 * vLine(d, 1.0);
      vg += bl;
      valert += bl * alertE;
      float travel = cyc * 0.2;
      float prog = raw / travel;
      if (raw >= 0.0) {
        float aa = 1.0 / (lenU * U);
        float tr = vLine(d, 1.7) * (1.0 - smoothstep(prog - aa, prog, s)) * fade;
        vg += 0.5 * tr;
        vhot += 0.1 * tr;
        valert += 0.5 * tr * alertE;
        if (prog <= 1.0) {                       // głowa + krótki ogon
          float dh = length(fp - mix(e.xy, e.zw, prog)) / U;
          vh += 0.4 * exp(-dh * dh / 90.0);
          float behind = (prog - s) * lenU;
          float ink = max(vDisc(dh, 2.2), 0.7 * vLine(d, 2.0) * step(0.0, behind) * (1.0 - smoothstep(0.0, 14.0, behind)));
          vg += 1.1 * ink;
          vhot += 1.1 * ink;
          valert += 1.1 * ink * alertE;
          near += exp(-dh * dh / 260.0);
          clr = max(clr, 1.0 - smoothstep(4.0, 10.0, dh));
        }
      }
    } else if (ty < 1.5) {                       // 1: wypełnienie (łuk wydajności do 98%)
      float fp1 = clamp(raw / max(et.w, 1e-3), 0.0, 1.0);
      float aa = 1.0 / (lenU * U);
      float lit = (1.0 - smoothstep(fp1 - aa, fp1, s)) * step(0.0001, fp1) * fade;
      vg += 0.26 * vLine(d, 1.0) + lit * 0.72 * vLine(d, 2.2);
      vhot += lit * 0.25 * vLine(d, 2.2);
      vh += lit * 0.3 * exp(-dd / 50.0);
      if (fp1 > 0.0 && fp1 < 1.0) {
        float core = vDisc(length(fp - mix(e.xy, e.zw, fp1)) / U, 2.5);
        vg += 1.1 * core;
        vhot += 1.1 * core;
      }
    } else {                                     // 2: sam grzbiet (ostatnie 2% łuku 98/100)
      vg += 0.24 * vLine(d, 1.0);
    }
  }

  for (int i = 0; i < VMAXN; i++) {
    if (float(i) >= u_cnt.x) break;
    vec4 n = u_n[i];
    vec2 q = (fp - n.xy) / U;
    float d2 = dot(q, q);
    float dn = sqrt(d2);
    float kind = n.z;
    // Stan historii: przed dotarciem węzeł pusty i przygaszony, po dotarciu zapalony do końca cyklu.
    bool timed = n.w >= 0.0 && kind < 4.5;
    float on = timed ? step(n.w - 0.02, ct) * fade : 1.0;
    float age = timed ? ct - n.w : -1.0;
    float fl = timed ? vFlash(ct, n.w, cyc) : 0.0;
    near += exp(-d2 / 520.0);
    if (kind > 4.5) {                            // kropka łuku: zapala się, gdy dociera światło
      float onT = n.w >= 0.0 ? step(n.w, ct) * fade : 0.55;
      float c = vDisc(dn, 1.8);
      vg += mix(0.32, 0.95, onT) * c;
      vhot += onT * 0.45 * c;
      vh += (0.2 + onT * 0.2) * exp(-d2 / 40.0);
      clr = max(clr, 1.0 - smoothstep(3.0, 7.0, dn));
    } else if (kind > 3.5) {                     // źródło ataku (czerwone)
      float c = mix(0.55 * vRing(dn, 2.8, 1.1), vDisc(dn, 3.0) + 0.25 * vRing(dn, 5.8, 1.0), on) + 0.6 * vPing(dn, 3.5, age);
      vg += c;
      valert += c;
      vh += 0.45 * exp(-d2 / 200.0);
      calm += 0.7 * exp(-d2 / 500.0);
      clr = max(clr, 1.0 - smoothstep(7.0, 14.0, dn));
    } else if (kind > 2.5) {                     // tarcza (Cloudflare): podwójny wał; blok = rozbłysk
      float dr = dn - 11.0;
      float rr2 = dr * dr;
      vh += (0.6 + fl * 0.5) * exp(-rr2 / 18.0);
      calm += exp(-rr2 / 260.0);
      near += exp(-rr2 / 200.0);
      clr = max(clr, 1.0 - smoothstep(16.0, 24.0, dn));
      float blk = age >= 0.0 ? exp(-age * 2.5) : 0.0;
      float wall = vRing(dn, 11.0, 1.5) + 0.3 * vRing(dn, 7.5, 1.0);
      vg += (0.7 + 0.45 * blk) * wall;
      vhot += (0.12 + 0.8 * blk) * wall;
      float pg = 0.6 * vPing(dn, 12.0, age);
      vg += pg;
      valert += pg;
    } else if (kind > 1.5) {                     // gwiazda: szczyt, promienie po dotarciu
      vh += (0.9 + fl * 0.3) * exp(-d2 / 380.0);
      calm += exp(-d2 / 900.0);
      clr = max(clr, 1.0 - smoothstep(9.0, 18.0, dn));
      float c = mix(0.5 * vDisc(dn, 2.1) + 0.35 * vSpikes(q, 5.0),
                    vDisc(dn, 3.0) + 0.75 * vSpikes(q, 12.0) + 0.22 * vRing(dn, 7.0, 1.0), on);
      float pg = 0.55 * vPing(dn, 4.0, age);
      vg += c + pg;
      vhot += on * c + 0.3 * pg;
    } else if (kind > 0.5) {                     // kropka: pusta przed dotarciem, pełna po
      vh += (0.55 + fl * 0.3) * exp(-d2 / 260.0);
      calm += exp(-d2 / 700.0);
      clr = max(clr, 1.0 - smoothstep(7.0, 14.0, dn));
      float c = mix(0.55 * vRing(dn, 2.8, 1.1), vDisc(dn, 3.0) + 0.25 * vRing(dn, 5.8, 1.0), on);
      float pg = 0.55 * vPing(dn, 3.5, age);
      vg += c + pg;
      vhot += on * 0.55 * c + 0.25 * pg;
    }
  }
  calm = min(calm, 0.85);
}

// Wizualizacja liczona tylko w obszarze sceny (koszt na telefonach); vU = px na jednostkę.
void vizRun(vec2 fp, float t, inout float vh, inout float calm, inout float vg, inout float vhot, inout float valert, inout float near, inout float clr) {
  vU = max(u_vp.y, 1e-3);
  if (u_vp.x < 0.5) return;
  if (fp.x < u_vb.x || fp.y < u_vb.y || fp.x > u_vb.z || fp.y > u_vb.w) return;
  vizScene(fp, t, vh, calm, vg, vhot, valert, near, clr);
}

// Jasność terenu: rozkład karty (vTileF), bliskość cech lekko odsłania warstwice, "fosa" wokół
// wizualizacji je gasi.
float vBase(float lines, float F, float near, float clr) {
  float a = lines * F;
  if (u_vp.x > 0.5) a = max(a, lines * clamp(near, 0.0, 1.0) * 0.22);
  return a * 0.92 * (1.0 - 0.94 * clamp(clr, 0.0, 1.0));
}

// Kolor: warstwice w kolorze kafla, wizualizacja w jaśniejszym odcieniu (impuls i zapalone węzły
// bieleją, atak czerwienieje). Płótno nieprzemnożone bez blendingu: alfa = widoczna jasność.
vec4 vizOut(vec3 base, float baseI, float vg, float vhot, float val) {
  float b = clamp(baseI, 0.0, 1.0);
  float v = clamp(vg, 0.0, 1.0);
  if (v < 1e-4) return vec4(base, b);
  vec3 vc = mix(base, vec3(1.0), 0.42 + 0.58 * clamp(vhot / vg, 0.0, 1.0));
  vc = mix(vc, vec3(1.0, 0.42, 0.42), clamp(val / vg, 0.0, 1.0));
  return vec4((base * b + vc * v) / (b + v), clamp(b + v, 0.0, 1.0));
}
`;

// Wspólny początek FS kafla: układ p (y w górę, x w proporcji kafla), paralaksa terenu, scena.
const tileFs = (noise: string, k: string, color: string) => `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;   // oś historii (wspólna z napisami kroków)
uniform float u_tt;     // czas terenu (stoi, gdy płótno stoi - bez przeskoku po pauzie)
${SNOISE_GLSL}
${VIZ_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 pn = p - u_par.xy;
  float vh = 0.0, calm = 0.0, vg = 0.0, vhot = 0.0, val = 0.0, near = 0.0, clr = 0.0;
  vizRun(gl_FragCoord.xy, u_time, vh, calm, vg, vhot, val, near, clr);
  ${noise}
  h = h * (1.0 - calm) + vh;   // przy cechach wizualizacji szum ustępuje ich topografii
  float a = vBase(vContours(h, h * ${k}), vTileF(gl_FragCoord.xy, u_resolution), near, clr);
  gl_FragColor = vizOut(vec3(${color}), a, vg, vhot, val);
}
`;

// Kafel 1 - "Inwestycja, nie koszt" (niebieski): warstwice rosnących warstw wartości.
export const TOPO_FS = tileFs(`
  float t = u_tt * 0.04;
  float h = snoise(pn * 1.4 + vec2(t * 0.3, t * 0.2));
  h += snoise(pn * 3.0 + vec2(-t * 0.2, t * 0.4)) * 0.35;`, '3.2', '0.184, 0.357, 0.922');
// Kafel 2 - "Wirtualny asystent" (indygo): rzadsze warstwice, inny kierunek dryfu.
export const ORBS_FS = tileFs(`
  float t = u_tt * 0.05;
  float h = snoise(pn * 1.8 + vec2(-t * 0.4, t * 0.3));
  h += snoise(pn * 3.5 + vec2(t * 0.25, -t * 0.5)) * 0.25;`, '2.5', '0.55, 0.55, 0.95');
// Kafel 3 - "Wydajność i SEO" (bursztyn).
export const VOLTAGE_FS = tileFs(`
  float t = u_tt * 0.05;
  float h = snoise(pn * 1.6 + vec2(t * 0.25, -t * 0.35));
  h += snoise(pn * 3.2 + vec2(-t * 0.4, t * 0.2)) * 0.30;`, '2.6', '0.95, 0.75, 0.20');
// Kafel 4 - "Stabilność i bezpieczeństwo" (zieleń).
export const SCAN_FS = tileFs(`
  float t = u_tt * 0.045;
  float h = snoise(pn * 1.2 + vec2(-t * 0.3, t * 0.25));
  h += snoise(pn * 2.6 + vec2(t * 0.4, t * 0.15)) * 0.40;`, '3.0', '0.34, 0.78, 0.45');

const VIZ_MAX = 12; // = VMAXN / VMAXE w VIZ_GLSL
/** Zapas wokół sceny (jedn.) - dalej teren wizualizacji (szczyty, grzbiety, poświata cech) nie sięga. */
const VIZ_MARGIN = 70;
/** Paralaksa terenu przy przewijaniu (jedn. p kafla, wysokość kafla = 2) - teren leży "dalej". */
const PAR_SCROLL = 0.1;

export const ShaderCanvas = ({ fragmentShader, scene, overlayRef, paused = false }: {
  fragmentShader: string;
  /** Scena wizualizacji kafla. */
  scene: ShaderScene;
  /** Kontener nakładki z podpisami - z jego położenia shader liczy piksele sceny. */
  overlayRef: RefObject<HTMLDivElement | null>;
  /** Karta przykryta w stosie - płótno stoi (teren nie przeskakuje po wznowieniu). */
  paused?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);
  const sceneRef = useRef<ShaderScene>(scene);
  const pausedRef = useRef(paused);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);
  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;

    const setup = (): (() => void) | undefined => {
      const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
      if (!gl) return;
      // Pochodne ekranowe (fwidth / dFdx): linie o kontrolowanej szerokości w px i cieniowanie.
      const deriv = !!gl.getExtension('OES_standard_derivatives');
      const header = deriv ? '#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIV 1\n' : '';

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error('Impact shader compile:', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      };

      const vs = compile(gl.VERTEX_SHADER, SHADER_VS);
      const fs = compile(gl.FRAGMENT_SHADER, header + fragmentShader);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Impact shader link:', gl.getProgramInfoLog(program));
        return;
      }
      gl.useProgram(program);
      // Bez blendingu: jedna warstwa na wyczyszczonym, nieprzemnożonym buforze - alfa z shadera
      // to wprost widoczna jasność piksela.
      gl.disable(gl.BLEND);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const u = (name: string) => gl.getUniformLocation(program, name);
      const uTime = u('u_time'), uTt = u('u_tt'), uRes = u('u_resolution');
      const uVp = u('u_vp'), uCnt = u('u_cnt');
      const uN = u('u_n'), uE = u('u_e'), uEt = u('u_et');
      const uPar = u('u_par'), uTx = u('u_tx'), uTc = u('u_tc'), uTe = u('u_te'), uVb = u('u_vb');
      const nodesBuf = new Float32Array(4 * VIZ_MAX);
      const edgesBuf = new Float32Array(4 * VIZ_MAX);
      const edgeTBuf = new Float32Array(4 * VIZ_MAX);
      const card = canvas.closest<HTMLElement>('.im-card');
      const overlay = overlayRef.current;
      let pxScale = 1; // px bufora na px CSS

      // Scena w pikselach bufora: z położenia nakładki względem canvasa (układ nakładki żyje
      // w CSS, shader tylko mierzy) + elipsy wygaszenia: kolumna tekstu karty (elementy
      // [data-im-shield="text"]), dodatek pod nią (wynik / link, [data-im-shield="extra"] - osobno,
      // bo w ułożeniu "U góry" stoi na dole kolumny) i napis kroku historii (.iv-story-live).
      const ellipse = (loc: WebGLUniformLocation | null, els: Iterable<HTMLElement>, cr: DOMRect, sx: number, sy: number, pad: number) => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const el of els) {
          let r = el.getBoundingClientRect();
          if (el.matches('h3, p')) {
            const range = document.createRange();
            range.selectNodeContents(el);
            r = range.getBoundingClientRect();
          }
          if (r.width < 1 || r.height < 1) continue;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
          x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
        }
        if (x1 > x0) {
          gl.uniform4f(loc,
            ((x0 + x1) / 2 - cr.left) * sx, canvas.height - ((y0 + y1) / 2 - cr.top) * sy,
            ((x1 - x0) / 2) * sx * 1.1 + pad * sx, ((y1 - y0) / 2) * sy * 1.15 + pad * sy);
        } else {
          gl.uniform4f(loc, 0, 0, 0, 0);
        }
      };
      const measure = () => {
        const sc = sceneRef.current;
        gl.useProgram(program);
        const cr = canvas.getBoundingClientRect();
        if (cr.width < 1 || cr.height < 1) return;
        const sx = canvas.width / cr.width;
        const sy = canvas.height / cr.height;
        pxScale = sx;
        ellipse(uTx, card?.querySelectorAll<HTMLElement>('[data-im-shield="text"]') ?? [], cr, sx, sy, 28);
        ellipse(uTe, card?.querySelectorAll<HTMLElement>('[data-im-shield="extra"]') ?? [], cr, sx, sy, 20);
        ellipse(uTc, card?.querySelectorAll<HTMLElement>('.iv-story-live') ?? [], cr, sx, sy, 14);

        const vr = overlay?.getBoundingClientRect();
        if (!vr || vr.width < 1) {
          gl.uniform4f(uVp, 0, 1, 1, 0);
          return;
        }
        const ox = vr.left - cr.left;
        const oy = vr.top - cr.top;
        const X = (x: number) => (ox + (x / sc.w) * vr.width) * sx;
        const Y = (y: number) => canvas.height - (oy + (y / sc.h) * vr.height) * sy;
        const U = (vr.width / sc.w) * sx;
        nodesBuf.fill(0);
        edgesBuf.fill(0);
        edgeTBuf.fill(0);
        const nodes = sc.nodes.slice(0, VIZ_MAX);
        nodes.forEach((n, i) => nodesBuf.set([X(n.x), Y(n.y), n.kind, n.flash], i * 4));
        const edges = sc.edges.slice(0, VIZ_MAX);
        edges.forEach((e, i) => {
          edgesBuf.set([X(e.a[0]), Y(e.a[1]), X(e.b[0]), Y(e.b[1])], i * 4);
          edgeTBuf.set([e.start, e.alert, e.type, e.dur], i * 4);
        });
        // Obszar sceny z zapasem - poza nim shader nie liczy wizualizacji.
        let bx0 = 0, by0 = 0, bx1 = sc.w, by1 = sc.h;
        const grow = (x: number, y: number) => {
          bx0 = Math.min(bx0, x); by0 = Math.min(by0, y);
          bx1 = Math.max(bx1, x); by1 = Math.max(by1, y);
        };
        sc.nodes.forEach((n) => grow(n.x, n.y));
        sc.edges.forEach((e) => { grow(e.a[0], e.a[1]); grow(e.b[0], e.b[1]); });
        gl.uniform4f(uVb, X(bx0 - VIZ_MARGIN), Y(by1 + VIZ_MARGIN), X(bx1 + VIZ_MARGIN), Y(by0 - VIZ_MARGIN));
        gl.uniform4f(uVp, 1, U, sc.cycle, 0);
        gl.uniform4f(uCnt, nodes.length, edges.length, 0, 0);
        gl.uniform4fv(uN, nodesBuf);
        gl.uniform4fv(uE, edgesBuf);
        gl.uniform4fv(uEt, edgeTBuf);
      };

      // DPR do 2 także na dotyku (1,25 na ekranie 3x = rozciągnięte, miękkie warstwice); koszt
      // trzymają 30 fps, pauza poza ekranem / pod przykryciem i wizualizacja liczona tylko w obszarze
      // sceny. Save-Data / ≤ 2 GB RAM: 1,25.
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const lite = nav.connection?.saveData === true || (nav.deviceMemory ?? 8) <= 2;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 2);
        const w = Math.round(canvas.clientWidth * dpr);
        const h = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        measure();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      if (overlay) ro.observe(overlay);
      resize();
      const onFonts = () => measure();
      document.fonts?.ready.then(onFonts, onFonts);

      // Paralaksa terenu tylko przy przewijaniu (wolniej niż karta - teren leży "dalej");
      // bez reakcji na kursor (decyzja właściciela: bez efektu najechania).
      let parY = 0, scrollPar = 0;
      const onScroll = () => {
        if (!runningRef.current) return;
        const r = canvas.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        scrollPar = ((r.top + r.height / 2 - vh / 2) / vh) * PAR_SCROLL;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // 30 fps (kontury animują się wolno); czas terenu rośnie tylko, gdy płótno rysuje.
      const FRAME_INTERVAL = 1000 / 30;
      let lastDrawTime = 0;
      let terrainT = 0;
      let drawn = false;
      const draw = (now?: number) => {
        if (!runningRef.current) return;
        const ts = now ?? performance.now();
        if (ts - lastDrawTime >= FRAME_INTERVAL) {
          const dt = lastDrawTime ? Math.min(ts - lastDrawTime, 100) : 0;
          lastDrawTime = ts;
          terrainT += dt / 1000;
          parY += (scrollPar - parY) * (1 - Math.exp(-dt / 300));
          gl.useProgram(program);
          gl.clear(gl.COLOR_BUFFER_BIT);
          if (uTime) gl.uniform1f(uTime, (ts - VIZ_EPOCH) / 1000);
          if (uTt) gl.uniform1f(uTt, terrainT);
          if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.uniform4f(uPar, 0, parY, pxScale, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          // Shader działa → CSS chowa grafikę zapasową nakładki (zostają podpisy).
          if (!drawn) { drawn = true; card?.setAttribute('data-gl', 'on'); }
        }
        rafRef.current = requestAnimationFrame(draw);
      };
      runningRef.current = true;
      draw(); // pierwsza klatka zawsze (także karta przykryta - ma obraz, gdy się odsłoni)

      // Pauza gdy poza viewport albo pod przykryciem (paused); po wznowieniu bez przeskoku terenu.
      let visible = false;
      const wake = () => {
        const run = visible && !pausedRef.current;
        if (run && !runningRef.current) {
          runningRef.current = true;
          lastDrawTime = 0;
          onScroll();
          draw();
        } else if (!run && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      };
      wakeRef.current = wake;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        wake();
      }, { rootMargin: '100px' });
      io.observe(canvas);

      return () => {
        runningRef.current = false;
        cancelAnimationFrame(rafRef.current);
        wakeRef.current = null;
        card?.removeAttribute('data-gl');
        window.removeEventListener('scroll', onScroll);
        ro.disconnect();
        io.disconnect();
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      };
    };

    // Lazy init: pełny setup WebGL dopiero, gdy karta zbliża się do viewportu (600 px zapasu).
    const warmIo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      warmIo.disconnect();
      cleanup = setup();
    }, { rootMargin: '600px 0px' });
    warmIo.observe(canvas);

    return () => {
      warmIo.disconnect();
      if (cleanup) cleanup();
    };
  }, [fragmentShader, overlayRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block pointer-events-none" />;
};
