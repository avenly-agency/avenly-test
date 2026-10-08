// Warstwa 2 handoffu: planeta (WebGL fragment shader, liquid glass).
// GLSL przeniesiony 1:1 z hero-12a.html (FRAG.planet). Jedyna zmiana: stałe w px
// kadru (70, 14, 340, 1.2...) liczone są w JEDNOSTKACH SCENY - piksele bufora
// dzielimy przez u_k (px bufora na jednostkę sceny), więc obraz jest identyczny
// przy każdej skali/DPR, a canvas może pokrywać tylko pas planety (nie całe niebo).
//
// DWA PRZEBIEGI (wydajność, 2026-10-05 - właściciel: „zoptymalizuj hero całe, żeby nie lagowało”;
// wzorzec mgławicy Realizacji - realizacje/nebula.ts):
// 1. SZUM - trzy fbm (5 oktaw każdy; ~90% kosztu dawnego shadera) liczone w POŁOWIE rozdzielczości
//    do tekstury: n1, n2 (zaburzenie normalnej) i szum smug. Szum jest gładki (najdrobniejsza oktawa
//    zaburzenia normalnej ma kilkanaście px), więc próbkowanie liniowe oddaje go bez widocznej różnicy;
//    dither chroni przed pasmami 8-bitowej tekstury.
// 2. ŚWIATŁO - pełna rozdzielczość: geometria kuli, fresnel, bliki, krawędź (rim) - wszystko, co ostre,
//    liczone jak dawniej, tylko szum czytany z tekstury. Wzory i stałe bez zmian.
// Koszt klatki spada do ok. 1/3 przy tym samym obrazie.

import type { HeroLayout, HeroPointer } from './layout';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Przebieg 1: u_res = rozmiar bufora płótna (px), u_nres = rozmiar bufora szumu. Pozycja liczona w px
// płótna (piksel szumu = ten sam punkt sceny co w przebiegu 2), szum także 8 jedn. poza tarczą -
// próbkowanie liniowe przy krawędzi nie łapie pustych pikseli.
const FRAG_NOISE = `precision highp float;
uniform vec2 u_res;uniform vec2 u_nres;uniform float u_time;uniform vec3 u_c;uniform float u_k;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.05+vec2(1.7,.9);a*=.5;}return v;}
void main(){vec2 f=gl_FragCoord.xy/u_nres*u_res;vec2 p=vec2(f.x,u_res.y-f.y);vec2 d=(p-u_c.xy)/u_k;float R=u_c.z/u_k;float r=length(d);
if(r-R>8.){gl_FragColor=vec4(.5,.5,.5,1.);return;}
float z=sqrt(max(R*R-r*r,0.));vec3 n=normalize(vec3(d.x,d.y,z));
vec2 uv=n.xy*4.2+vec2(u_time*.04,-u_time*.025);float n1=fbm(uv),n2=fbm(uv+vec2(7.3,2.1)-u_time*.03);
float st=fbm(uv*2.3+n1*1.5);
gl_FragColor=vec4(vec3(n1,n2,st)+(hash(gl_FragCoord.xy+7.)-.5)/255.,1.);}`;

// Przebieg 2: shader z makiety 1:1, tylko n1 / n2 / szum smug z tekstury (u_noise).
const FRAG = `precision highp float;
uniform sampler2D u_noise;uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform float u_int;uniform vec3 u_c;uniform float u_k;
void main(){vec2 p=vec2(gl_FragCoord.x,u_res.y-gl_FragCoord.y);vec2 d=(p-u_c.xy)/u_k;float R=u_c.z/u_k;float r=length(d);float dist=r-R;
vec2 m=(u_mouse-.5);
float glow=exp(-max(dist,0.)/70.)*.42+exp(-max(dist,0.)/14.)*.35;
vec3 col=vec3(.376,.647,.98)*glow;float alpha=clamp(glow*1.6,0.,1.);
float inside=1.-smoothstep(-1.2,1.2,dist);
if(dist<1.5){float z=sqrt(max(R*R-r*r,0.));vec3 n=normalize(vec3(d.x,d.y,z));
vec3 q=texture2D(u_noise,gl_FragCoord.xy/u_res).rgb;float n1=q.r,n2=q.g;
vec3 nn=normalize(n+vec3(n1-.5,n2-.5,0.)*.22*u_int);
vec3 V=vec3(0.,0.,1.);float fres=pow(1.-max(nn.z,0.),3.2);
vec3 L1=normalize(vec3(-.45+m.x*.6,-.85,.55));vec3 L2=normalize(vec3(.75,-.35,.5));
float spec1=pow(max(dot(reflect(-L1,nn),V),0.),110.);float spec2=pow(max(dot(reflect(-L2,nn),V),0.),36.)*.45;float dif=max(dot(nn,L1),0.);
float depth=smoothstep(0.,340.,-dist);
vec3 deep=vec3(.02,.02,.03),body=vec3(.043,.075,.196),mid=vec3(.067,.169,.51),lite=vec3(.184,.357,.922),rim=vec3(.647,.706,.988);
vec3 c=mix(mix(lite,mid,.55),body,depth);c=mix(c,deep,smoothstep(.45,1.,depth));
c*=.6+dif*.5;
c+=rim*fres*1.25*(1.-depth*.55);
c+=vec3(1.)*(spec1+spec2)*(1.-depth*.75);
float streak=smoothstep(.56,.9,q.b)*(1.-depth)*.32;c+=lite*streak;
float sheen=smoothstep(.2,.0,abs(nn.x*.6-nn.y*.8-.25+sin(u_time*.3)*.05))*(1.-depth)*.12;c+=vec3(.85,.9,1.)*sheen;
c+=rim*exp(-abs(dist+1.5)/2.2)*.95;
col=mix(col,c,inside);alpha=max(alpha,inside);}
gl_FragColor=vec4(col,alpha);}`;

/** Ile jednostek sceny NAD horyzontem obejmuje canvas (zasięg glow atmosfery). */
const GLOW_REACH = 300;
const DPR_CLAMP = 1.25;
/** Bufor szumu jako ułamek bufora płótna (w każdym wymiarze). */
const NOISE_SCALE = 0.5;

export interface PlanetLayer {
  resize(layout: HeroLayout): void;
  render(timeSec: number, pointer: HeroPointer): void;
  destroy(): void;
}

type Uni = Record<string, WebGLUniformLocation | null>;

/**
 * Tworzy WŁASNY <canvas> wewnątrz hosta (zawsze świeży element = świeży kontekst;
 * eliminuje pułapkę "lost context po remouncie" z Sesji 25). Kompilacja bez
 * synchronicznych status checks (KHR_parallel_shader_compile, wzorzec z Sesji 28).
 * onReady - pierwsza klatka narysowana; onFail - brak WebGL / błąd → fallback CSS.
 */
export function createPlanet(
  host: HTMLElement,
  onReady: () => void,
  onFail: () => void,
): PlanetLayer {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;display:block;pointer-events:none;';
  host.appendChild(canvas);

  let layout: HeroLayout | null = null;
  let disposed = false;
  let ready = false;
  let failed = false;
  let announced = false;
  let pollId = 0;
  let topCss = 0;
  let noiseW = 0;
  let noiseH = 0;

  let gl: WebGLRenderingContext | null = null;
  let pNoise: WebGLProgram | null = null;
  let pMain: WebGLProgram | null = null;
  let shaders: WebGLShader[] = [];
  let buf: WebGLBuffer | null = null;
  let tex: WebGLTexture | null = null;
  let fb: WebGLFramebuffer | null = null;
  let uNoise: Uni | null = null;
  let uMain: Uni | null = null;

  const fail = () => {
    if (failed) return;
    failed = true;
    ready = false;
    canvas.style.display = 'none';
    onFail();
  };

  /** Tekstura szumu w rozmiarze połowy bufora płótna (alokacja tylko przy zmianie rozmiaru). */
  const sizeNoise = () => {
    if (!gl || !tex) return;
    const nw = Math.max(1, Math.round(canvas.width * NOISE_SCALE));
    const nh = Math.max(1, Math.round(canvas.height * NOISE_SCALE));
    if (nw === noiseW && nh === noiseH) return;
    noiseW = nw; noiseH = nh;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nw, nh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  };

  const applySize = () => {
    if (!layout) return;
    const { W, H, k, oy, horizon } = layout;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CLAMP);
    topCss = Math.max(0, Math.floor(oy + (horizon - GLOW_REACH) * k));
    const hCss = Math.max(1, H - topCss);
    // transform zamiast `top`: zmiana top na widocznym elemencie liczy się do CLS.
    canvas.style.transform = `translate3d(0,${topCss}px,0)`;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${hCss}px`;
    const bw = Math.max(1, Math.round(W * dpr));
    const bh = Math.max(1, Math.round(hCss * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    sizeNoise();
  };

  const finish = () => {
    if (disposed || !gl || !pNoise || !pMain) return;
    for (const pr of [pNoise, pMain]) {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        console.warn('Hero planet: link error', gl.getProgramInfoLog(pr));
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
    noiseW = 0; noiseH = 0;
    fb = gl.createFramebuffer();
    applySize(); // ustawia rozmiar płótna i alokuje teksturę szumu
    sizeNoise(); // gdy układ jeszcze nie przyszedł: tekstura w rozmiarze domyślnego płótna
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!complete) { console.warn('Hero planet: framebuffer incomplete'); fail(); return; }

    const un = (n: string) => gl!.getUniformLocation(pNoise!, n);
    const um = (n: string) => gl!.getUniformLocation(pMain!, n);
    uNoise = { res: un('u_res'), nres: un('u_nres'), time: un('u_time'), c: un('u_c'), k: un('u_k') };
    uMain = { noise: um('u_noise'), res: um('u_res'), time: um('u_time'), mouse: um('u_mouse'), int: um('u_int'), c: um('u_c'), k: um('u_k') };
    gl.clearColor(0, 0, 0, 0);
    ready = true;
  };

  const init = () => {
    gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
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
    pNoise = build(FRAG_NOISE);
    pMain = build(FRAG);
    if (!pNoise || !pMain) { fail(); return; }
    const done = (pr: WebGLProgram) => !parallel || gl!.getProgramParameter(pr, parallel.COMPLETION_STATUS_KHR);
    const wait = () => {
      if (disposed || !gl || !pNoise || !pMain) return;
      if (!done(pNoise) || !done(pMain)) { pollId = requestAnimationFrame(wait); return; }
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
    resize(next) { layout = next; applySize(); },
    render(timeSec, pointer) {
      if (!ready || !gl || !uNoise || !uMain || !pNoise || !pMain || !layout || !noiseW) return;
      const { k, ox, oy, cx, horizon, R } = layout;
      const pxPerUnit = (canvas.width / layout.W) * k; // px bufora na jednostkę sceny
      const pxPerCss = canvas.width / layout.W;
      const cX = (ox + cx * k) * pxPerCss;
      const cY = (oy + (horizon + R) * k - topCss) * pxPerCss;
      const cR = R * pxPerUnit;

      // 1. Szum do tekstury (pół rozdzielczości).
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, noiseW, noiseH);
      gl.useProgram(pNoise);
      gl.uniform2f(uNoise.res, canvas.width, canvas.height);
      gl.uniform2f(uNoise.nres, noiseW, noiseH);
      gl.uniform1f(uNoise.time, timeSec);
      gl.uniform3f(uNoise.c, cX, cY, cR);
      gl.uniform1f(uNoise.k, pxPerUnit);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 2. Światło w pełnej rozdzielczości.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(pMain);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uMain.noise, 0);
      gl.uniform2f(uMain.res, canvas.width, canvas.height);
      gl.uniform1f(uMain.time, timeSec);
      gl.uniform2f(uMain.mouse, pointer.x, 1 - pointer.y);
      gl.uniform1f(uMain.int, 1);
      gl.uniform3f(uMain.c, cX, cY, cR);
      gl.uniform1f(uMain.k, pxPerUnit);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!announced) { announced = true; onReady(); }
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
        if (pNoise) gl.deleteProgram(pNoise);
        if (pMain) gl.deleteProgram(pMain);
        shaders.forEach((s) => gl!.deleteShader(s));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      canvas.remove();
    },
  };
}
