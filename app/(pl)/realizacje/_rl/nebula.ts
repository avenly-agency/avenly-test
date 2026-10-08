// Mgławica podstrony Realizacje - wersja „premium” z interakcją (runda 5, właściciel: „zrób tę mgławicę bardziej
// premium i interaktywność z kursorem jakoś zajebiście”). Kopia shadera sekcji Realizacje ze strony głównej
// (components/sections/realizacje/nebula.ts - ZAMROŻONY, bez zmian) rozbudowana o:
//   - CZARNĄ DZIURĘ pod kursorem (soczewka grawitacyjna): gwiazdy i gaz uginają się wokół kursora, gwiazdy przy nim
//     jaśnieją; BEZ rysowanej obwódki (właściciel: „o taki efekt czarnej dziury mi chodziło, tylko usuń to obramowanie
//     szare”) - widać samo ugięcie,
//   - SMUGĘ za kursorem: ruch „miesza” gaz jak dym (wir wzdłuż ostatnich pozycji kursora, gaśnie w ~0,4 s),
//   - FALE po kliknięciach: od punktu kliknięcia rozchodzi się fala, która przesuwa gaz i zapala gwiazdy - bez rysowanej
//     linii czoła; do 6 fal naraz, nakładają się (kolejne kliknięcie nie ucina poprzedniej),
//   - GŁĘBIĘ przy przewijaniu: gaz płynie ~4× wolniej niż treść, trzy warstwy gwiazd z różną paralaksą,
//   - rzadkie CZTERORAMIENNE GWIAZDY (jak „klejnoty” nieba w hero i gwiazdki etykiet „Gwiazda”) - motyw marki.
// Soczewka, smuga i fala działają w przebiegu kompozycji (przesunięcie próbkowania tekstury gazu + pola gwiazd),
// więc reagują w każdej klatce, a drogi gaz (fbm) nadal liczy się rzadko. Gaz przerysowuje się tylko po istotnej
// zmianie kadru / przewinięciu (poza tym co drugą klatkę), przewinięcie między przerysowaniami kompensuje próbkowanie.
// Runda 17 (właściciel: „animacje pojawiania się mgławicy na mobile też zrób tak samo zajebiście jak na kompie”; te same
// zmiany co w kopii app/(pl)/uslugi/_katalog/nebula.ts): kształt frontu odsłony i kolejność zapalania gwiazd na ekranie
// pionowym w proporcjach ekranu (ra = max(asp, 1)), opcja maxPx (budżet pikseli kompozycji).

type RGB = [number, number, number];

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const GAS_FRAG = `precision mediump float;uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform vec2 u_fc;uniform vec2 u_fh;uniform float u_reveal;uniform float u_scroll;uniform vec2 u_rc;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
const mat2 R=mat2(.8,.6,-.6,.8);
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/u_res;float asp=u_res.x/u_res.y;
 // ekran pionowy (pt 0-1: 0 = poziomy / kwadrat, 1 = telefon w pionie; runda 18, właściciel: „za mało wyraźna mgławica na
 // mobile, totalnie jakby jej nie było, i za mało jest jej”): gęstszy wzór (na wąskim ekranie widać było jedną plamę),
 // większy blask wokół celu, słabsza winieta i przyciemnienie dołu; na ekranie poziomym bez zmian (pt = 0)
 float pt=clamp((1.-asp)*2.,0.,1.);
 vec2 p=(uv-u_fc)*vec2(asp,1.);p-=(u_mouse-.5)*.04;
 vec2 w=(uv*vec2(asp,1.)-vec2(0.,u_scroll))*(1.+.5*pt);
 float t=u_time*.014;
 vec2 q=vec2(fbm(w*1.1+vec2(t,-t*.6)),fbm(w*1.1+vec2(5.2,1.3)-vec2(t*.4,t*.3)));
 vec2 r=vec2(fbm(w*1.45+q*1.8+vec2(1.7-t*.5,9.2)),fbm(w*1.45+q*1.8+vec2(8.3,2.8+t*.35)));
 float n=fbm(w*1.2+r*2.);
 float dust=fbm(w*2.8-r*1.1+vec2(t*.5,0.));
 float lanes=.5+.5*smoothstep(.3,.72,dust);
 vec2 h=u_fh*vec2(asp,1.);
 vec2 e=p/(vec2(h.x+h.y*1.3,h.y*2.1)*(1.+.6*pt));
 float core=exp(-dot(e,e)*.85);
 float dens=smoothstep(.36,.86,n);
 float vig=clamp(1.-.62*(1.-.4*pt)*length((uv-u_fc)*vec2(.85,1.25)),0.,1.)*mix(.5+.3*pt,1.,smoothstep(.02,.3,uv.y));
 vec3 f=vec3((.1+.6*n*n)*(.12+.88*core),pow(dens,1.6)*core*lanes,pow(dens,4.)*core*lanes)*vig;
 float rr=u_reveal*1.95-.3;
 // kształt frontu na ekranie pionowym w proporcjach ekranu (ra = max(asp, 1); runda 17, jak w kopii /uslugi) - w proporcjach
 // pikseli wąski ekran przecinała płaska, pozioma linia; na ekranie poziomym bez zmian
 float ra=max(asp,1.);
 vec2 pr=(uv-u_rc)*vec2(ra,1.);
 float edge=length(pr*vec2(.8,1.))+(n-.5)*.55+(dust-.5)*.25;
 float band=smoothstep(rr-.3,rr-.08,edge)*(1.-smoothstep(rr-.08,rr+.02,edge))*(1.-u_reveal)*(.35+.65*core)*vig;
 f*=1.-smoothstep(rr-.3,rr,edge);
 f.g+=band*.4;f.b+=band*.3;
#ifdef LIVE
 // opcja liveGlow (2026-10-06): tekstura niesie SAME POLA GAZU - r = szum n, g / b = pierwiastki gęstości włókien,
 // a = pył. Blask wokół kadru, winietę i front odsłony dolicza kompozycja w każdej klatce (te same wzory co wyżej -
 // zmieniając jedne, zmień drugie), więc gaz nie zależy od kadru ani od postępu odsłony i jest rysowany rzadko.
 gl_FragColor=vec4(n,sqrt(clamp(pow(dens,1.6)*lanes,0.,1.)),sqrt(clamp(pow(dens,4.)*lanes,0.,1.)),dust)+vec4((hash(gl_FragCoord.xy+7.)-.5)/255.);}
#else
 gl_FragColor=vec4(sqrt(clamp(f,0.,1.))+(hash(gl_FragCoord.xy+7.)-.5)/255.,1.);}
#endif`;

const COMP_FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_gas;uniform vec2 u_res;uniform float u_scale;uniform float u_time;uniform vec2 u_mouse;uniform vec3 u_c1;uniform vec3 u_c2;uniform float u_reveal;uniform vec2 u_fc;uniform vec2 u_rc;
uniform float u_dscroll;uniform vec3 u_so;
#ifdef LIVE
uniform vec2 u_fh;uniform sampler2D u_gas2;uniform float u_mixk;uniform float u_dscroll2;
#endif
#ifndef STILL
uniform vec2 u_cur;uniform float u_lens;uniform vec4 u_trail[8];uniform vec4 u_waves[6];
#endif
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
// Czteroramienne gwiazdy (motyw „Gwiazda” z etykiet i nieba hero): ostre ramiona, bez poświaty, wolne oddychanie.
vec3 jewels(vec2 px,vec3 tint,float th0){
 float cell=300.;vec2 g=floor(px/cell);vec2 gi=mod(g,9.);float h=hash(gi+53.);
 if(h>.3)return vec3(0.);
 float ap=smoothstep(th0+.2,th0+.34,u_reveal*2.-.1);
 if(ap<=0.)return vec3(0.);
 vec2 pos=(vec2(hash(gi+61.),hash(gi+67.))*.6+.2)*cell;
 vec2 d=px-g*cell-pos;float s=4.+6.*hash(gi+71.);
 float br=.55+.45*sin(u_time*(.25+.3*hash(gi+73.))+h*40.);
 vec2 a=abs(d);
 float arms=exp(-a.x*1.9)*exp(-a.y/s)+exp(-a.y*1.9)*exp(-a.x/s);
 float core=exp(-dot(d,d)*.9);
 vec3 c=mix(vec3(.93,.96,1.),mix(tint,vec3(1.),.35),step(.5,hash(gi+79.)));
 return c*(arms*.55+core)*br*ap;}
void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 asp=vec2(u_res.x/u_res.y,1.);
#ifdef STILL
 // wariant bez interakcji (opcja still - tło podstron usług): bez soczewki, smugi i fal, czyli bez 14 obrotów pętli na piksel
 vec2 dG=vec2(0.),dS=vec2(0.);
#else
 // soczewka pod kursorem: miękka soczewka grawitacyjna (pierścień Einsteina przy r = .9 LR, w środku odwrócony,
 // pomniejszony obraz), bez osobliwości w środku
 vec2 q=(uv-u_cur)*asp;float rq=length(q);
 const float LR=.08;
 vec2 lens=q*(u_lens*LR*LR/(rq*rq+.2*LR*LR))*(1.-smoothstep(.2,.55,rq));
 // smuga (kilwater): gaz ciągnięty w kierunku ruchu + dwa przeciwne wiry po bokach toru kursora
 vec2 wake=vec2(0.);
 for(int i=0;i<8;i++){vec4 tp=u_trail[i];vec2 s=(uv-tp.xy)*asp;vec2 v=tp.zw*asp;float w=exp(-dot(s,s)/.0075);
  wake+=(v+vec2(-s.y,s.x)*(v.x*s.y-v.y*s.x)*180.)*w;}
 // fale po kliknięciach (do 6 naraz, sumują się): pierścień rozchodzi się od punktu kliknięcia i wypycha gaz i gwiazdy
 vec2 wave=vec2(0.);float wprof=0.;
 for(int i=0;i<6;i++){vec4 wv=u_waves[i];vec2 wq=(uv-wv.xy)*asp;float wr=length(wq)+1e-4;
  float wx=(wr-wv.z*.62)/.03;float pf=exp(-wx*wx)*wv.w*(1.-smoothstep(.15,1.5,wv.z));
  wave+=(wq/wr)*pf*.03;wprof+=pf;}
 vec2 dG=(lens*.45+wake+wave)/asp;
 vec2 dS=(lens+wake*.3+wave)/asp;
#endif
 // gaz: próbkowanie z przesunięciem (interakcja) + kompensacja przewinięcia między przerysowaniami gazu
 vec2 guv=uv-dG-vec2(0.,u_dscroll);
#ifdef LIVE
 // opcja liveGlow: tekstura gazu niesie same pola (r = szum n, g / b = pierwiastki gęstości włókien, a = pył), a blask
 // wokół kadru, winietę i front odsłony liczymy tutaj, w każdej klatce - te same wzory co w przebiegu gazu
 // (zmieniając jedne, zmień drugie). Gaz nie musi być wtedy rysowany w każdej klatce odsłony ani ruchu blasku.
 // Gaz to dwie klatki kluczowe (u_gas2 = poprzednia, u_gas = nowsza) i płynne przenikanie między nimi (u_mixk 0-1):
 // rysowany kilka razy na sekundę, a płynie w każdej klatce - bez przenikania było widać skoki („poklatkowany”).
 vec4 gt=mix(texture2D(u_gas2,uv-dG-vec2(0.,u_dscroll2)),texture2D(u_gas,guv),u_mixk);
 vec3 g=vec3(.1+.6*gt.r*gt.r,gt.g*gt.g,gt.b*gt.b);
 {float la=u_res.x/u_res.y;float lp=clamp((1.-la)*2.,0.,1.);
  vec2 lq=(uv-u_fc)*vec2(la,1.)-(u_mouse-.5)*.04;vec2 lh=u_fh*vec2(la,1.);
  vec2 le=lq/(vec2(lh.x+lh.y*1.3,lh.y*2.1)*(1.+.6*lp));
  float lc=exp(-dot(le,le)*.85);
  float lv=clamp(1.-.62*(1.-.4*lp)*length((uv-u_fc)*vec2(.85,1.25)),0.,1.)*mix(.5+.3*lp,1.,smoothstep(.02,.3,uv.y));
  g*=vec3(.12+.88*lc,lc,lc)*lv;
  float lr=u_reveal*1.95-.3;
  vec2 lw=(uv-u_rc)*vec2(max(la,1.),1.);
  float ledge=length(lw*vec2(.8,1.))+(gt.r-.5)*.55+(gt.a-.5)*.25;
  float lband=smoothstep(lr-.3,lr-.08,ledge)*(1.-smoothstep(lr-.08,lr+.02,ledge))*(1.-u_reveal)*(.35+.65*lc)*lv;
  g*=1.-smoothstep(lr-.3,lr,ledge);
  g.g+=lband*.4;g.b+=lband*.3;
  g=clamp(g,0.,1.);}
#else
 vec3 g=texture2D(u_gas,guv).rgb;g*=g;
#endif
 vec3 c1=desat(u_c1,.2),c2=desat(u_c2,.12);
 vec3 base=mix(vec3(.0196),vec3(.005,.005,.008),smoothstep(0.,.5,u_reveal));
 // barwy: głęboki cień, środek w barwie realizacji, najjaśniejsze włókna ostrzej i jaśniej
 float fil=smoothstep(.1,.42,g.b);
 // ekran pionowy (runda 18): jaśniejszy gaz (na komputerze bez zmian)
 float pt=clamp((1.-u_res.x/u_res.y)*2.,0.,1.);
 vec3 col=base+(c2*g.r*1.35+c1*g.g*.9+mix(c1,vec3(1.,.97,.93),.5)*(g.b*.3+fil*.14))*(1.+.55*pt);
 vec2 px=(uv-dS)*u_res/u_scale;vec2 par=(u_mouse-.5)*u_res/u_scale;
 float th0=length((uv-u_rc)*vec2(max(u_res.x/u_res.y,1.)*.8,1.))*.9;
 // trzy warstwy gwiazd z różną paralaksą przewijania (u_so - przesunięcia liczone w JS, już modulo okres pola)
 vec3 sf=stars(px+par*.006+vec2(mod(u_time*1.2,1344.),u_so.x),16.,84.,17.,.16,0.,c1,th0)
  +stars(px+par*.016+vec2(mod(u_time*2.4,1344.),mod(u_time*.3+u_so.y,1344.)),112.,12.,31.,.32,1.,c1,th0)
  +jewels(px+par*.03+vec2(0.,u_so.z),c1,th0);
 // gwiazdy w soczewce jaśnieją, fala zapala te, przez które przechodzi
#ifdef STILL
 float mag=1.;
#else
 float mag=1.+1.4*u_lens*exp(-rq*rq/.01)+2.2*wprof;
#endif
 float low=mix(.5+.3*pt,1.,smoothstep(.02,.3,uv.y));
 col+=sf*(1.-g.g*.7)*low*.9*mag;
 col+=c1*exp(-length((uv-u_mouse)*vec2(1.6,1.))*2.8)*.035*low*u_reveal;
 col+=(hash(gl_FragCoord.xy)-.5)*.008;
 gl_FragColor=vec4(col,1.);}`;

const GAS_MAX_W = 1440;
const GAS_MAX_H = 900;
const COMP_MAX_DPR = 1.5;
const COMP_MAX_W = 2560;
const COMP_MAX_H = 1440;
const TRAIL = 8;
const WAVES = 6;

export interface NebulaPlus {
  resize(width: number, height: number): void;
  frame(cx: number, cy: number, hw: number, hh: number): void;
  /** Interakcja (ułamki okna, y od góry): kursor, siła soczewki 0-1, smuga = do 8 punktów (x, y, vx, vy - ciągnięcie
      w ułamkach ekranu, już przemnożone przez siłę), fale = do 6 (x, y, wiek w s, 1 = aktywna), przewinięcie strony w px, rc = środek odsłony (skąd mgławica wyłania się
      z czerni; domyślnie środek ekranu). */
  interact(s: { cx: number; cy: number; lens: number; rc?: [number, number]; trail: ArrayLike<number>; waves: ArrayLike<number>; scrollY: number; viewH: number }): void;
  render(timeSec: number, mouseX: number, mouseY: number, c1: RGB, c2: RGB, reveal?: number): boolean;
  destroy(): void;
}

type U = (name: string) => WebGLUniformLocation | null;

export interface NebulaPlusOpts {
  maxDpr?: number; maxPx?: number; gasScale?: number;
  /** true = bez interakcji: kompozycja bez soczewki, smugi i fal (lżejszy shader - tło podstron usług, 2026-10-05). */
  still?: boolean;
  /** Co ile klatek przerysować gaz w spoczynku (domyślnie 2). */
  gasEvery?: number;
  /** Najmniejszy odstęp (w klatkach) między przerysowaniami gazu, gdy kadr się rusza (domyślnie 1 = każda klatka). */
  gasBusy?: number;
  /** true = blask wokół kadru, winietę i front odsłony liczy kompozycja w każdej klatce, a tekstura gazu niesie same
      pola gazu (tło podstron usług, 2026-10-06 - właściciel: „efekty na nebuli lagują, np. to z podświetleniem przy
      scrollu”, potem „pojawianie się nebuli po wejściu nie jest płynne i szarpie”). Blask i odsłona idą wtedy płynnie
      w tempie kompozycji, a drogi gaz jest przerysowywany rzadko (`gasMs`) albo gdy przewinięcie ucieknie od
      narysowanego - także w czasie odsłony, która bez tej opcji rysuje oba przebiegi w każdej klatce. Domyślnie
      false = dawne zachowanie (wszystko w teksturze gazu). Gdyby wariant shadera z tą opcją się nie zbudował, moduł sam
      wraca do zwykłego. */
  liveGlow?: boolean;
  /** Przy liveGlow: co ile ms przerysować gaz, gdy nic go nie unieważniło (domyślnie 260; gaz płynie bardzo wolno). */
  gasMs?: number;
}

export function createNebulaPlus(host: HTMLElement, onReady: () => void, onFail: () => void, opts: NebulaPlusOpts = {}): NebulaPlus {
  const maxDpr = opts.maxDpr ?? COMP_MAX_DPR;
  /** Budżet pikseli kompozycji (runda 17, jak w kopii /uslugi): ostre gwiazdy na telefonie bez przekroczenia kosztu. */
  const maxPx = opts.maxPx ?? Infinity;
  const gasScale = opts.gasScale ?? 0.72;
  const gasEvery = Math.max(1, opts.gasEvery ?? 2), gasBusy = Math.max(1, opts.gasBusy ?? 1);
  // liveGlow: liveOn = wariant shadera zbudowany z tą opcją (blask, winietę i front odsłony liczy kompozycja);
  // liveNow = tryb, w którym narysowano teksturę gazu (zmiana = przerysować)
  const gasMs = Math.max(0, opts.gasMs ?? 260);
  let liveOn = !!opts.liveGlow, liveNow = liveOn, gasTime = 0;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  let disposed = false, ready = false, failed = false, announced = false, pollId = 0;
  // gasDrawn = gaz aktualny (false: warto przerysować); gasValid = tekstura ma treść (false: trzeba przerysować od razu)
  let cssW = 0, cssH = 0, scale = 1, gasW = 0, gasH = 0, gasDrawn = false, gasValid = false, calls = 0, gasAt = 0;
  const fr = { cx: 0.5, cy: 0.5, hw: 0.28, hh: 0.28 };
  const it = { cx: 0.5, cy: 0.5, lens: 0, rc: [0.5, 0.5] as number[], trail: new Float32Array(TRAIL * 4), waves: new Float32Array(WAVES * 4), scrollUv: 0, so: [0, 0, 0] };
  let gasScroll = 0;
  // liveGlow: dwie klatki kluczowe gazu (tex i tex2) z przenikaniem. newIs2 = nowsza leży w tex2; haveOld = jest też
  // poprzednia (po pierwszym rysowaniu i po zmianie rozmiaru jeszcze nie); gasScroll2 = przewinięcie poprzedniej
  let gasScroll2 = 0, newIs2 = false, haveOld = false, keySpan = gasMs;

  let gl: WebGLRenderingContext | null = null;
  let pGas: WebGLProgram | null = null, pComp: WebGLProgram | null = null;
  let shaders: WebGLShader[] = [];
  let buf: WebGLBuffer | null = null, tex: WebGLTexture | null = null, tex2: WebGLTexture | null = null, fb: WebGLFramebuffer | null = null;
  let uGas: Record<string, WebGLUniformLocation | null> | null = null;
  let uComp: Record<string, WebGLUniformLocation | null> | null = null;

  const fail = () => { if (failed) return; failed = true; ready = false; canvas.style.display = 'none'; onFail(); };

  const applySize = () => {
    if (!cssW || !cssH) return;
    const dpr = window.devicePixelRatio || 1;
    scale = Math.min(dpr, maxDpr, COMP_MAX_W / cssW, COMP_MAX_H / cssH, Math.max(1, Math.sqrt(maxPx / (cssW * cssH))));
    const cw = Math.max(1, Math.round(cssW * scale)), ch = Math.max(1, Math.round(cssH * scale));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    const f = Math.min(gasScale, GAS_MAX_W / cssW, GAS_MAX_H / cssH);
    const gw = Math.max(1, Math.round(cssW * f)), gh = Math.max(1, Math.round(cssH * f));
    if (gl && tex && (gw !== gasW || gh !== gasH)) {
      gasW = gw; gasH = gh;
      if (tex2) { gl.bindTexture(gl.TEXTURE_2D, tex2); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gw, gh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gw, gh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gasDrawn = false; gasValid = false; haveOld = false; newIs2 = false;
    }
  };

  const finish = () => {
    if (disposed || !gl || !pGas || !pComp) return;
    for (const pr of [pGas, pComp]) {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        // wariant z liveGlow się nie zbudował (sterownik / błąd w shaderze) - budujemy zwykły (dawne zachowanie)
        if (liveOn) {
          console.warn('Realizacje mgławica+: wariant liveGlow nie zbudowany, wracam do zwykłego', gl.getProgramInfoLog(pr));
          liveOn = false; liveNow = false;
          gl.deleteProgram(pGas); gl.deleteProgram(pComp);
          shaders.forEach((s) => gl!.deleteShader(s));
          shaders = []; pGas = null; pComp = null;
          init();
          return;
        }
        console.warn('Realizacje mgławica+: link error', gl.getProgramInfoLog(pr)); fail(); return;
      }
    }
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // liveGlow: druga tekstura gazu (poprzednia klatka kluczowa do przenikania) - tworzona pierwsza, żeby po tym
    // bloku związana została tex, jak dotąd
    tex2 = null;
    if (liveOn) {
      tex2 = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex2);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gasW = 0; gasH = 0;
    fb = gl.createFramebuffer();
    applySize();
    if (!gasW) {
      gasW = 1; gasH = 1;
      if (tex2) { gl.bindTexture(gl.TEXTURE_2D, tex2); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); gl.bindTexture(gl.TEXTURE_2D, tex); }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!complete) { console.warn('Realizacje mgławica+: framebuffer incomplete'); fail(); return; }
    const ug: U = (n) => gl!.getUniformLocation(pGas!, n);
    const uc: U = (n) => gl!.getUniformLocation(pComp!, n);
    uGas = Object.fromEntries(['res', 'time', 'mouse', 'fc', 'fh', 'reveal', 'scroll', 'rc'].map((k) => [k, ug(`u_${k}`)]));
    uComp = Object.fromEntries(['gas', 'res', 'scale', 'time', 'mouse', 'c1', 'c2', 'reveal', 'fc', 'rc', 'cur', 'lens', 'dscroll', 'so', 'fh', 'gas2', 'mixk', 'dscroll2'].map((k) => [k, uc(`u_${k}`)]));
    uComp.trail = uc('u_trail[0]') ?? uc('u_trail');
    uComp.waves = uc('u_waves[0]') ?? uc('u_waves');
    gasDrawn = false; gasValid = false;
    ready = true;
  };

  const init = () => {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || gl.isContextLost()) { fail(); return; }
    const parallel = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;
    const build = (frag: string): WebGLProgram | null => {
      const vs = gl!.createShader(gl!.VERTEX_SHADER), fs = gl!.createShader(gl!.FRAGMENT_SHADER), pr = gl!.createProgram();
      if (!vs || !fs || !pr) return null;
      shaders.push(vs, fs);
      gl!.shaderSource(vs, VERT); gl!.compileShader(vs);
      gl!.shaderSource(fs, frag); gl!.compileShader(fs);
      gl!.attachShader(pr, vs); gl!.attachShader(pr, fs);
      gl!.bindAttribLocation(pr, 0, 'p');
      gl!.linkProgram(pr);
      return pr;
    };
    pGas = build(liveOn ? `#define LIVE\n${GAS_FRAG}` : GAS_FRAG);
    pComp = build(`${opts.still ? '#define STILL\n' : ''}${liveOn ? '#define LIVE\n' : ''}${COMP_FRAG}`);
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
      const ncy = 1 - cy;
      // przerysuj gaz tylko przy wyraźnej zmianie kadru (drobne kroki wygładzania nie kosztują przebiegu fbm);
      // przy liveGlow po odsłonie kadr nie dotyczy gazu - blask liczy kompozycja
      if (!liveNow && Math.abs(cx - fr.cx) + Math.abs(ncy - fr.cy) + Math.abs(hw - fr.hw) + Math.abs(hh - fr.hh) > 0.004) gasDrawn = false;
      fr.cx = cx; fr.cy = ncy; fr.hw = hw; fr.hh = hh;
    },
    interact(s) {
      it.cx = s.cx; it.cy = 1 - s.cy; it.lens = s.lens;
      if (s.rc) it.rc = [s.rc[0], 1 - s.rc[1]];
      for (let i = 0; i < TRAIL; i++) {
        const k = i * 4;
        it.trail[k] = s.trail[k] ?? 0;
        it.trail[k + 1] = 1 - (s.trail[k + 1] ?? 0);
        it.trail[k + 2] = s.trail[k + 2] ?? 0;
        it.trail[k + 3] = -(s.trail[k + 3] ?? 0);
      }
      for (let i = 0; i < WAVES; i++) {
        const k = i * 4;
        it.waves[k] = s.waves[k] ?? 0;
        it.waves[k + 1] = 1 - (s.waves[k + 1] ?? 0);
        it.waves[k + 2] = s.waves[k + 2] ?? 0;
        it.waves[k + 3] = s.waves[k + 3] ?? 0;
      }
      // głębia przy przewijaniu: gaz płynie z ~1/4 prędkości treści, gwiazdy wolniej (3 warstwy, dalsze wolniej);
      // przesunięcia gwiazd modulo okres pola (1344 / 2700 px) - bez utraty precyzji przy długiej stronie
      const y = s.scrollY, wrap = (v: number, per: number) => ((v % per) + per) % per;
      it.scrollUv = (y / Math.max(1, s.viewH)) * 0.22;
      it.so = [wrap(-y * 0.04, 1344), wrap(-y * 0.1, 1344), wrap(-y * 0.18, 2700)];
      if (Math.abs(it.scrollUv - gasScroll) > 0.06) gasDrawn = false; // daleko od narysowanego gazu - przerysuj
    },
    render(timeSec, mouseX, mouseY, c1, c2, reveal = 1) {
      if (!ready || !gl || !uGas || !uComp || !pGas || !pComp) return false;
      const my = 1 - mouseY;
      const rv = Math.min(1, Math.max(0, reveal));
      // gaz: od razu, gdy tekstura jest pusta i w trakcie odsłony; poza tym co gasEvery klatek, a gdy kadr się zmienił -
      // nie częściej niż co gasBusy klatek (domyślne 2 i 1 = dawne zachowanie: co druga klatka / natychmiast)
      const since = ++calls - gasAt;
      // liveGlow: tekstura gazu niesie same pola gazu (bez blasku, winiety i frontu odsłony - te liczy kompozycja), więc
      // gaz rysujemy tylko co gasMs albo gdy przewinięcie uciekło od narysowanego (gasDrawn = false w interact) -
      // także w czasie odsłony, która dotąd rysowała oba przebiegi w każdej klatce
      const live = liveOn, nowMs = performance.now();
      if (live !== liveNow) { liveNow = live; gasValid = false; }
      const due = live ? (!gasDrawn && since >= gasBusy) || nowMs - gasTime >= gasMs : rv < 1 || since >= (gasDrawn ? gasEvery : gasBusy);
      if (!gasValid || due) {
        // liveGlow: klatka kluczowa „z czasu” (minęło gasMs) idzie do drugiej tekstury, a dotychczasowa zostaje jako
        // poprzednia - kompozycja płynnie przenika od niej do nowej. Klatka wymuszona przewinięciem (albo pierwsza /
        // po zmianie rozmiaru) nadpisuje nowszą bez przenikania - poprzednia byłaby za daleko od bieżącego przewinięcia
        if (live) {
          if (gasValid && gasDrawn && nowMs - gasTime >= gasMs) {
            // przenikanie trwa tyle, ile minęło między dwiema ostatnimi klatkami kluczowymi (klatki kompozycji nie
            // trafiają dokładnie w gasMs) - dochodzi do końca akurat przy następnej, bez przystanku
            keySpan = Math.min(gasMs * 2.5, Math.max(gasMs, nowMs - gasTime));
            newIs2 = !newIs2; haveOld = true; gasScroll2 = gasScroll;
          } else { haveOld = false; if (!gasValid) newIs2 = false; }
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        if (live) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, newIs2 ? tex2 : tex, 0);
        gl.viewport(0, 0, gasW, gasH);
        gl.useProgram(pGas);
        gl.uniform2f(uGas.res, gasW, gasH);
        gl.uniform1f(uGas.time, timeSec);
        gl.uniform2f(uGas.mouse, mouseX, my);
        gl.uniform2f(uGas.fc, fr.cx, fr.cy);
        gl.uniform2f(uGas.fh, fr.hw, fr.hh);
        gl.uniform1f(uGas.reveal, rv);
        gl.uniform1f(uGas.scroll, it.scrollUv);
        gl.uniform2f(uGas.rc, it.rc[0], it.rc[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gasDrawn = true; gasValid = true; gasAt = calls; gasTime = nowMs;
        gasScroll = it.scrollUv;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(pComp);
      if (live) {
        // jednostka 1 = poprzednia klatka kluczowa (gdy jej nie ma - ta sama co nowsza), jednostka 0 = nowsza;
        // przenikanie 0-1 w czasie gasMs od narysowania nowszej (po dojściu do 1 rysowana jest następna)
        const newer = newIs2 ? tex2 : tex, older = haveOld ? (newIs2 ? tex : tex2) : newer;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, older);
        gl.uniform1i(uComp.gas2, 1);
        gl.uniform1f(uComp.mixk, haveOld ? Math.min(1, (nowMs - gasTime) / Math.max(1, keySpan)) : 1);
        gl.uniform1f(uComp.dscroll2, it.scrollUv - (haveOld ? gasScroll2 : gasScroll));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, newer);
      } else {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
      }
      gl.uniform1i(uComp.gas, 0);
      gl.uniform2f(uComp.res, canvas.width, canvas.height);
      gl.uniform1f(uComp.scale, scale);
      gl.uniform1f(uComp.time, timeSec);
      gl.uniform2f(uComp.mouse, mouseX, my);
      gl.uniform3f(uComp.c1, c1[0], c1[1], c1[2]);
      gl.uniform3f(uComp.c2, c2[0], c2[1], c2[2]);
      gl.uniform1f(uComp.reveal, rv);
      gl.uniform2f(uComp.fc, fr.cx, fr.cy);
      gl.uniform2f(uComp.fh, fr.hw, fr.hh);
      gl.uniform2f(uComp.rc, it.rc[0], it.rc[1]);
      gl.uniform2f(uComp.cur, it.cx, it.cy);
      gl.uniform1f(uComp.lens, it.lens);
      if (uComp.trail) gl.uniform4fv(uComp.trail, it.trail);
      if (uComp.waves) gl.uniform4fv(uComp.waves, it.waves);
      // przewinięcie od ostatniego przerysowania gazu: gaz przesunięty w próbkowaniu (bez skoku między klatkami)
      gl.uniform1f(uComp.dscroll, it.scrollUv - gasScroll);
      gl.uniform3f(uComp.so, it.so[0], it.so[1], it.so[2]);
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
        if (tex2) gl.deleteTexture(tex2);
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
