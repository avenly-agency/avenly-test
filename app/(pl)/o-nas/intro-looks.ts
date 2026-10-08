// Propozycje wejścia strony O nas (2026-09-29). Właściciel: „daj kilka propozycji tego shadera
// i pierwszej sekcji z napisem avenly”, potem „PASUJĄCYCH DO MARKI!!!!” - dlatego każda wychodzi
// ze znaku firmowego: „AVENLY.” jak w nawigacji (Inter 700, ciasne odstępy, biel) z niebieską
// kropką marki (#3b82f6); tylko biel, czerń i niebieski marki, ostre krawędzie, bez mgły.
// Litery są oknami na pole światła (warstwa #050505 w trybie multiply), kropka to osobny element.
// Wspólne: zapłon przy wejściu (u_reveal, kierunek zależny od propozycji), przelot (u_push),
// wygaszenie (u_dim), ziarno. Geometria napisu z DOM: u_box = wersaliki (x0, dół, x1, góra w uv),
// u_dot = środek kropki (uv). Po wyborze właściciela zostaje jedna propozycja.

export const LOOKS = [
  { id: 'kropka', label: 'Kropka' },
  { id: 'planeta', label: 'Planeta' },
  { id: 'linia', label: 'Linia' },
] as const;
export type Look = (typeof LOOKS)[number]['id'];

/** Przelot: w co wlatuje kamera (kropka albo pionowa kreska E) i maksymalne przybliżenie. */
export const FLIGHT: Record<Look, { target: 'dot' | 'stem'; stemY: number; max: [number, number] }> = {
  kropka: { target: 'dot', stemY: 0.5, max: [95, 160] },
  planeta: { target: 'stem', stemY: 0.74, max: [50, 80] },
  linia: { target: 'stem', stemY: 0.7, max: [50, 80] },
};

export const VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const PRELUDE = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_push;
uniform float u_dim;
uniform float u_reveal;
uniform vec4 u_box;
uniform vec2 u_dot;
const vec3 BRAND = vec3(0.231, 0.510, 0.965);
const vec3 SNOW = vec3(0.965, 0.975, 1.0);

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
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
/** 0 = dół wersalików, 1 = góra. */
float capH(vec2 uv){ return (uv.y - u_box.y) / max(0.001, u_box.w - u_box.y); }
`;

const MAIN = `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec3 col = shade(uv);
  // Zapłon: front światła biegnie po współrzędnej revealCoord (0 → 1), za nim litery świecą.
  float c = clamp(revealCoord(uv), 0.0, 1.0);
  float front = u_reveal * 1.3 - 0.15;
  float lit = smoothstep(front + 0.015, front - 0.1, c);
  float edge = smoothstep(2.0, 0.0, abs(c - front) * revealSpan()) * (1.0 - smoothstep(0.85, 1.0, u_reveal));
  col = col * lit + mix(BRAND, vec3(1.0), 0.55) * edge * 0.9;
  col *= 1.0 - u_dim;
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012 * (1.0 - u_dim);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

/** 1. KROPKA - kropka marki jest źródłem światła: białe litery, im bliżej kropki, tym więcej
    niebieskiego; co kilka sekund od kropki w lewo biegnie wąska smuga koloru marki. Zapłon
    rozchodzi się od kropki w lewo. */
const KROPKA = `
float revealCoord(vec2 uv){ return (u_dot.x - uv.x) / max(0.05, u_dot.x - u_box.x); }
float revealSpan(){ return max(0.05, u_dot.x - u_box.x) * u_res.x; }
vec3 shade(vec2 uv){
  float asp = u_res.x / u_res.y;
  float h = clamp(capH(uv), 0.0, 1.0);
  vec3 col = mix(vec3(0.80, 0.84, 0.91), SNOW, smoothstep(0.0, 0.9, h));
  float r = length((uv - u_dot) * vec2(asp, 1.0));
  float span = max(0.05, u_dot.x - u_box.x);
  col = mix(col, BRAND, smoothstep(span * asp * 0.55, 0.0, r) * 0.62);
  // Smuga światła z kropki: pochylona, ostra, co 6 s.
  float ph = fract(u_time / 6.0);
  float s = (u_dot.x - uv.x) + (uv.y - u_dot.y) * 0.3 / asp;
  float band = smoothstep(0.004, 0.0, abs(s - ph * (span + 0.08)) - 0.006) * (1.0 - ph);
  col = mix(col, BRAND, band * 0.85);
  return col;
}
`;

/** 2. PLANETA - świat z hero: litery białe u góry, a przez ich dół przechodzi ostra krawędź
    niebieskiej planety marki (wielki łuk), pod nią płynna, szklista powierzchnia w granacie.
    Przy przelocie kamera schodzi w planetę. */
const PLANETA = `
float revealCoord(vec2 uv){ return (uv.x - u_box.x) / max(0.05, u_box.z - u_box.x); }
float revealSpan(){ return max(0.05, u_box.z - u_box.x) * u_res.x; }
vec3 shade(vec2 uv){
  float asp = u_res.x / u_res.y;
  float capHgt = max(0.001, u_box.w - u_box.y);
  float cx = (u_box.x + u_box.z) * 0.5;
  // Łuk horyzontu: szczyt na 42% wysokości liter; przy przelocie planeta rośnie (kamera schodzi).
  float top = u_box.y + capHgt * (0.42 + 0.9 * u_push);
  float R = 2.6;
  vec2 q = vec2((uv.x - cx) * asp, uv.y - (top - R));
  float dist = length(q) - R;
  float px = 1.0 / u_res.y;
  // Nad krawędzią: biel logotypu, tuż przy krawędzi chłodnieje (światło planety na literach).
  vec3 sky = mix(mix(BRAND, SNOW, 0.55), SNOW, smoothstep(0.0, capHgt * 0.45, dist));
  // Pod krawędzią: powierzchnia planety - granat z płynną fakturą, jaśniejsza przy krawędzi.
  float n = snoise(vec2(q.x * 2.2 + u_time * 0.035, q.y * 5.0));
  float n2 = snoise(vec2(q.x * 5.0 - u_time * 0.05, q.y * 11.0) + n);
  vec3 surf = mix(vec3(0.015, 0.05, 0.16), BRAND * 0.95, smoothstep(-capHgt * 0.9, 0.0, dist));
  surf *= 0.82 + 0.18 * n + 0.08 * smoothstep(0.6, 0.95, n2);
  vec3 col = mix(surf, sky, smoothstep(-px, px, dist));
  // Krawędź: ostra, jasna linia światła.
  col = mix(col, vec3(1.0), smoothstep(2.2 * px, 0.0, abs(dist)) * 0.9);
  return col;
}
`;

/** 3. LINIA - litery wypełniają się od dołu gradientem logotypu (niebieski marki przy dole, biel
    u góry), front wypełnienia to cienka, jasna linia; potem co 7 s przez litery przechodzi pozioma
    linia światła. Pod znakiem linia z podpisem (CSS). */
const LINIA = `
float revealCoord(vec2 uv){ return capH(uv); }
float revealSpan(){ return max(0.001, u_box.w - u_box.y) * u_res.y; }
vec3 shade(vec2 uv){
  float h = capH(uv);
  vec3 col = mix(BRAND, SNOW, smoothstep(0.08, 0.82, h));
  float px = 1.0 / u_res.y;
  float ly = u_box.y + (u_box.w - u_box.y) * fract(u_time / 7.0);
  col = mix(col, vec3(1.0), smoothstep(1.6 * px, 0.0, abs(uv.y - ly)) * 0.7);
  // Przy przelocie wnętrze litery przechodzi w granat - lot nie kończy się bielą.
  col = mix(col, mix(vec3(0.02, 0.06, 0.18), BRAND, clamp(h, 0.0, 1.0) * 0.5), u_push);
  return col;
}
`;

const SHADES: Record<Look, string> = { kropka: KROPKA, planeta: PLANETA, linia: LINIA };

export const fragmentFor = (look: Look) => PRELUDE + SHADES[look] + MAIN;
