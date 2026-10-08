// Tło sekcji "Realizacje": mgławica (WebGL) w barwach aktywnej realizacji (decyzja właściciela -
// zastąpiła "jedwab" z handoffu 8b). Kolory podaje scene.ts co klatkę (u_c1 jasny gaz, u_c2
// głęboka poświata) - przy zmianie kadru płynnie przechodzą między paletami projektów.
//
// Dwa przebiegi (2026-09-24, "tło przytłaczające i mało wyraźne" - właściciel):
// 1. GAZ - drogi fbm liczony w obniżonej rozdzielczości (0,6x, max 1280x720) do tekstury, co
//    drugie wywołanie render() (~15 kl./s; gaz płynie bardzo wolno). Tekstura trzyma same
//    współczynniki (poświata / gaz / najjaśniejsze włókna), kodowane pierwiastkiem - więcej
//    poziomów w ciemnych partiach, bez pasm po rozciągnięciu.
// 2. KOMPOZYCJA - w pełnej rozdzielczości (DPR do 1,5, max 2560x1440): barwy projektu, ostre
//    gwiazdy, światło kursora, ziarno. highp - gwiazdy liczone w px CSS do ~3300, mediump na
//    mobilnych GPU (fp16) rozmywał ich pozycje.
// Wejście sekcji (u_reveal 0..1, podaje scene.ts ze scrolla): gaz rozlewa się od środka kadru
// poszarpaną krawędzią ze świetlistym frontem, gwiazdy zapalają się z krótkim błyskiem; 0 = czerń
// #050505 jak pasek nad sekcją, 1 = obraz identyczny jak bez odsłony.
// Kompilacja bez synchronicznych status checks (KHR_parallel_shader_compile, wzorzec
// z hero/planet.ts), własny <canvas> w hoście (świeży kontekst przy każdym remoncie).

import type { RGB } from '@/lib/i18n/home/realizacje';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Gaz: dwupoziomowy domain warp fbm (5 oktaw) → gęstość, pasy pyłu z drugiego fbm rzeźbią
// chmury. Kolor skupiony w poświacie wokół kadru: elipsa liczona z RZECZYWISTEGO położenia
// i rozmiaru kadru (u_fc środek, u_fh połowa wymiarów, ułamki hosta - podaje scene.ts), więc
// działa w obu układach (scena / kolumna); krawędzie, nagłówek i panele z tekstem zostają
// ciemne. Kursor: lekka paralaksa gazu. Wyjście:
// r = głęboka poświata (u_c2), g = gaz (u_c1), b = najjaśniejsze włókna; sqrt + dither.
const GAS_FRAG = `precision mediump float;uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform vec2 u_fc;uniform vec2 u_fh;uniform float u_reveal;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
const mat2 R=mat2(.8,.6,-.6,.8);
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/u_res;float asp=u_res.x/u_res.y;
 vec2 p=(uv-u_fc)*vec2(asp,1.);p-=(u_mouse-.5)*.04;float t=u_time*.014;
 vec2 q=vec2(fbm(p*1.1+vec2(t,-t*.6)),fbm(p*1.1+vec2(5.2,1.3)-vec2(t*.4,t*.3)));
 vec2 r=vec2(fbm(p*1.45+q*1.8+vec2(1.7-t*.5,9.2)),fbm(p*1.45+q*1.8+vec2(8.3,2.8+t*.35)));
 float n=fbm(p*1.2+r*2.);
 float dust=fbm(p*2.8-r*1.1+vec2(t*.5,0.));
 float lanes=.5+.5*smoothstep(.3,.72,dust);
 vec2 h=u_fh*vec2(asp,1.);
 vec2 e=p/vec2(h.x+h.y*1.3,h.y*2.1);
 float core=exp(-dot(e,e)*.85);
 float dens=smoothstep(.36,.86,n);
 float vig=clamp(1.-.62*length((uv-u_fc)*vec2(.85,1.25)),0.,1.)*mix(.5,1.,smoothstep(.02,.3,uv.y));
 vec3 f=vec3((.1+.6*n*n)*(.12+.88*core),pow(dens,1.6)*core*lanes,pow(dens,4.)*core*lanes)*vig;
 float rr=u_reveal*1.95-.3;
 float edge=length(p*vec2(.8,1.))+(n-.5)*.55+(dust-.5)*.25;
 float band=smoothstep(rr-.3,rr-.08,edge)*(1.-smoothstep(rr-.08,rr+.02,edge))*(1.-u_reveal)*(.35+.65*core)*vig;
 f*=1.-smoothstep(rr-.3,rr,edge);
 f.g+=band*.4;f.b+=band*.3;
 gl_FragColor=vec4(sqrt(clamp(f,0.,1.))+(hash(gl_FragCoord.xy+7.)-.5)/255.,1.);}`;

// Gwiazdy: dwie warstwy w komórkach siatki (px CSS) z pozycją sub-pikselową - drobny pył
// i rzadsze jaśniejsze gwiazdy (małe halo, promienie tylko przy kilku najjaśniejszych).
// Łagodne pulsowanie (nigdy nie gasną), powolny dryf w różnym tempie (głębia), paralaksa za
// kursorem, ~12% w barwie projektu. Halo i promienie gasną OKRĄGŁO przed krawędzią komórki
// (inaczej widać kwadratowe kafle). Wzór okresowy (mod po komórkach, okres 1344 px), więc
// dryf zawija się bez szwu. Barwy projektu lekko przygaszone (desat), ziarno statyczne.
const COMP_FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_gas;uniform vec2 u_res;uniform float u_scale;uniform float u_time;uniform vec2 u_mouse;uniform vec3 u_c1;uniform vec3 u_c2;uniform float u_reveal;uniform vec2 u_fc;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 desat(vec3 c,float k){return mix(vec3(dot(c,vec3(.2126,.7152,.0722))),c,1.-k);}
vec3 stars(vec2 px,float cell,float per,float seed,float dens,float big,vec3 tint,float th0){
 vec2 g=floor(px/cell);vec2 gi=mod(g,per);float h=hash(gi+seed);
 if(h>dens)return vec3(0.);
 float th=th0+hash(gi+seed+7.7)*.3;
 float ap=smoothstep(th,th+.12,u_reveal*2.-.1);
 if(ap<=0.)return vec3(0.);
 vec2 pos=(vec2(hash(gi+seed+1.7),hash(gi+seed+9.2))*.7+.15)*cell;
 vec2 d=px-g*cell-pos;
 float b=pow(hash(gi+seed+3.3),2.4);
 float tw=.84+.16*sin(u_time*(.3+.9*hash(gi+seed+4.4))+h*60.);
 float r2=dot(d,d),r=sqrt(r2);
 float core=exp(-r2/(.28+.9*b+.6*big*b));
 float halo=big*exp(-r/(1.+3.*b))*b*.34;
 float sp=big*step(.8,b)*(exp(-abs(d.x)*2.4)*exp(-abs(d.y)*.38)+exp(-abs(d.y)*2.4)*exp(-abs(d.x)*.38))*(b-.8)*1.6;
 vec3 c=mix(vec3(.8,.87,1.),vec3(1.,.92,.82),hash(gi+seed+2.9));
 c=mix(c,mix(tint,vec3(1.),.4),step(.88,hash(gi+seed+6.1)));
 float edge=min(min(pos.x,cell-pos.x),min(pos.y,cell-pos.y));
 float win=1.-smoothstep(edge*.45,edge,r);
 return c*(core*(.34+.66*b)+(halo+sp)*win)*tw*ap*(1.+3.*ap*(1.-ap));}
void main(){vec2 uv=gl_FragCoord.xy/u_res;
 vec3 g=texture2D(u_gas,uv).rgb;g*=g;
 vec3 c1=desat(u_c1,.22),c2=desat(u_c2,.15);
 vec3 base=mix(vec3(.0196),vec3(.006,.006,.009),smoothstep(0.,.5,u_reveal));
 vec3 col=base+c2*g.r*1.3+c1*g.g*.85+mix(c1,vec3(1.),.4)*g.b*.34;
 vec2 px=gl_FragCoord.xy/u_scale;vec2 par=(u_mouse-.5)*u_res/u_scale;
 float th0=length((uv-u_fc)*vec2(u_res.x/u_res.y*.8,1.))*.9;
 vec3 sf=stars(px+par*.006+vec2(mod(u_time*1.2,1344.),0.),16.,84.,17.,.16,0.,c1,th0)
  +stars(px+par*.016+vec2(mod(u_time*2.4,1344.),mod(u_time*.3,1344.)),112.,12.,31.,.32,1.,c1,th0);
 float low=mix(.5,1.,smoothstep(.02,.3,uv.y));
 col+=sf*(1.-g.g*.7)*low*.9;
 col+=c1*exp(-length((uv-u_mouse)*vec2(1.6,1.))*2.8)*.045*low*u_reveal;
 col+=(hash(gl_FragCoord.xy)-.5)*.008;
 gl_FragColor=vec4(col,1.);}`;

/** Gaz: ułamek rozmiaru CSS i limit bufora (drogi fbm; gaz jest miękki z natury). */
const GAS_SCALE = 0.6;
const GAS_MAX_W = 1280;
const GAS_MAX_H = 720;
/** Kompozycja (gwiazdy muszą być ostre): DPR do 1,5 (dotyk: 1,25 z opcji `maxDpr`), limit bufora. */
const COMP_MAX_DPR = 1.5;
const COMP_MAX_W = 2560;
const COMP_MAX_H = 1440;

export interface NebulaLayer {
  /** Rozmiar CSS hosta (px) - bufory liczone z limitami (gaz 0,6x, kompozycja do DPR 1,5). */
  resize(width: number, height: number): void;
  /** Kadr względem hosta (ułamki 0-1, początek w lewym górnym rogu): środek i połowa wymiarów. */
  frame(cx: number, cy: number, hw: number, hh: number): void;
  /** Rysuje klatkę w podanych barwach; zwraca false dopóki program nie jest gotowy.
      `reveal` 0..1 = wejście sekcji (0 = czerń jak pasek nad sekcją, 1 = pełny obraz).
      `calm` = nic się nie dzieje (bez ruchu kursora i przejść): gaz przerysowywany co 3. wywołanie zamiast co 2. */
  render(timeSec: number, mouseX: number, mouseY: number, c1: RGB, c2: RGB, reveal?: number, calm?: boolean): boolean;
  destroy(): void;
}

type U = (name: string) => WebGLUniformLocation | null;

/**
 * onReady - pierwsza klatka narysowana (host dostaje data-ready → CSS fade-in);
 * onFail - brak WebGL / błąd kompilacji → zostaje statyczny gradient CSS hosta.
 */
export function createNebula(
  host: HTMLElement,
  onReady: () => void,
  onFail: () => void,
  opts: { maxDpr?: number } = {},
): NebulaLayer {
  const maxDpr = opts.maxDpr ?? COMP_MAX_DPR;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  let disposed = false;
  let ready = false;
  let failed = false;
  let announced = false;
  let pollId = 0;
  let cssW = 0;
  let cssH = 0;
  let scale = 1;
  let gasW = 0;
  let gasH = 0;
  let gasDrawn = false;
  let calls = 0;
  // Kadr w układzie GL (y od dołu): środek i połowa wymiarów; domyślnie środek hosta.
  const fr = { cx: 0.5, cy: 0.5, hw: 0.28, hh: 0.28 };

  let gl: WebGLRenderingContext | null = null;
  let pGas: WebGLProgram | null = null;
  let pComp: WebGLProgram | null = null;
  let shaders: WebGLShader[] = [];
  let buf: WebGLBuffer | null = null;
  let tex: WebGLTexture | null = null;
  let fb: WebGLFramebuffer | null = null;
  let uGas: Record<'res' | 'time' | 'mouse' | 'fc' | 'fh' | 'reveal', WebGLUniformLocation | null> | null = null;
  let uComp: Record<'gas' | 'res' | 'scale' | 'time' | 'mouse' | 'c1' | 'c2' | 'reveal' | 'fc', WebGLUniformLocation | null> | null = null;

  const fail = () => {
    if (failed) return;
    failed = true;
    ready = false;
    canvas.style.display = 'none';
    onFail();
  };

  const applySize = () => {
    if (!cssW || !cssH) return;
    const dpr = window.devicePixelRatio || 1;
    scale = Math.min(dpr, maxDpr, COMP_MAX_W / cssW, COMP_MAX_H / cssH);
    const cw = Math.max(1, Math.round(cssW * scale));
    const ch = Math.max(1, Math.round(cssH * scale));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const f = Math.min(GAS_SCALE, GAS_MAX_W / cssW, GAS_MAX_H / cssH);
    const gw = Math.max(1, Math.round(cssW * f));
    const gh = Math.max(1, Math.round(cssH * f));
    if (gl && tex && (gw !== gasW || gh !== gasH)) {
      gasW = gw;
      gasH = gh;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gw, gh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gasDrawn = false;
    }
  };

  const finish = () => {
    if (disposed || !gl || !pGas || !pComp) return;
    for (const pr of [pGas, pComp]) {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        console.warn('Realizacje nebula: link error', gl.getProgramInfoLog(pr));
        fail();
        return;
      }
    }
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gasW = 0; gasH = 0;
    fb = gl.createFramebuffer();
    applySize(); // alokuje teksturę gazu w bieżącym rozmiarze
    if (!gasW) { gasW = 1; gasH = 1; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!complete) { console.warn('Realizacje nebula: framebuffer incomplete'); fail(); return; }

    const ug: U = (n) => gl!.getUniformLocation(pGas!, n);
    const uc: U = (n) => gl!.getUniformLocation(pComp!, n);
    uGas = { res: ug('u_res'), time: ug('u_time'), mouse: ug('u_mouse'), fc: ug('u_fc'), fh: ug('u_fh'), reveal: ug('u_reveal') };
    uComp = { gas: uc('u_gas'), res: uc('u_res'), scale: uc('u_scale'), time: uc('u_time'), mouse: uc('u_mouse'), c1: uc('u_c1'), c2: uc('u_c2'), reveal: uc('u_reveal'), fc: uc('u_fc') };
    gasDrawn = false;
    ready = true;
  };

  const init = () => {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || gl.isContextLost()) { fail(); return; }
    const parallel = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;
    const build = (frag: string): WebGLProgram | null => {
      const vs = gl!.createShader(gl!.VERTEX_SHADER);
      const fs = gl!.createShader(gl!.FRAGMENT_SHADER);
      const pr = gl!.createProgram();
      if (!vs || !fs || !pr) return null;
      shaders.push(vs, fs);
      gl!.shaderSource(vs, VERT); gl!.compileShader(vs);
      gl!.shaderSource(fs, frag); gl!.compileShader(fs);
      gl!.attachShader(pr, vs); gl!.attachShader(pr, fs);
      gl!.bindAttribLocation(pr, 0, 'p'); // ten sam bufor i atrybut dla obu przebiegów
      gl!.linkProgram(pr);
      return pr;
    };
    pGas = build(GAS_FRAG);
    pComp = build(COMP_FRAG);
    if (!pGas || !pComp) { fail(); return; }
    const done = (pr: WebGLProgram) => !parallel || gl!.getProgramParameter(pr, parallel.COMPLETION_STATUS_KHR);
    const wait = () => {
      if (disposed || !gl || !pGas || !pComp) return;
      if (!done(pGas) || !done(pComp)) { pollId = requestAnimationFrame(wait); return; }
      finish();
    };
    wait();
  };

  const onLost = (e: Event) => { e.preventDefault(); ready = false; };
  const onRestored = () => { if (!disposed) { failed = false; shaders = []; init(); } };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  init();

  return {
    resize(width, height) { cssW = width; cssH = height; applySize(); },
    frame(cx, cy, hw, hh) {
      if (![cx, cy, hw, hh].every(Number.isFinite) || hw <= 0 || hh <= 0) return;
      fr.cx = cx; fr.cy = 1 - cy; fr.hw = hw; fr.hh = hh;
      gasDrawn = false;
    },
    render(timeSec, mouseX, mouseY, c1, c2, reveal = 1, calm = false) {
      if (!ready || !gl || !uGas || !uComp || !pGas || !pComp) return false;
      const my = 1 - mouseY;
      const rv = Math.min(1, Math.max(0, reveal));
      // 1. Gaz do tekstury - co drugie wywołanie (i zawsze po zmianie rozmiaru / pierwszy raz);
      //    w trakcie odsłony w każdym, żeby front rozlewał się płynnie. W spoczynku (`calm`, 2026-10-05)
      //    co trzecie: gaz płynie wtedy ~14 px/s, więc rzadsze odświeżanie to kroki poniżej 2 px.
      if (!gasDrawn || rv < 1 || ++calls >= (calm ? 3 : 2)) {
        calls = 0;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.viewport(0, 0, gasW, gasH);
        gl.useProgram(pGas);
        gl.uniform2f(uGas.res, gasW, gasH);
        gl.uniform1f(uGas.time, timeSec);
        gl.uniform2f(uGas.mouse, mouseX, my);
        gl.uniform2f(uGas.fc, fr.cx, fr.cy);
        gl.uniform2f(uGas.fh, fr.hw, fr.hh);
        gl.uniform1f(uGas.reveal, rv);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gasDrawn = true;
      }
      // 2. Kompozycja w pełnej rozdzielczości.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(pComp);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uComp.gas, 0);
      gl.uniform2f(uComp.res, canvas.width, canvas.height);
      gl.uniform1f(uComp.scale, scale);
      gl.uniform1f(uComp.time, timeSec);
      gl.uniform2f(uComp.mouse, mouseX, my);
      gl.uniform3f(uComp.c1, c1[0], c1[1], c1[2]);
      gl.uniform3f(uComp.c2, c2[0], c2[1], c2[2]);
      gl.uniform1f(uComp.reveal, rv);
      gl.uniform2f(uComp.fc, fr.cx, fr.cy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!announced) { announced = true; onReady(); }
      return true;
    },
    destroy() {
      disposed = true;
      ready = false;
      cancelAnimationFrame(pollId);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (gl) {
        if (buf) gl.deleteBuffer(buf);
        if (tex) gl.deleteTexture(tex);
        if (fb) gl.deleteFramebuffer(fb);
        if (pGas) gl.deleteProgram(pGas);
        if (pComp) gl.deleteProgram(pComp);
        shaders.forEach((s) => gl!.deleteShader(s));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      canvas.remove();
    },
  };
}
