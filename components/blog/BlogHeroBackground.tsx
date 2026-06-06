'use client';

import { useEffect, useRef, useState } from 'react';

// Shader CONTOUR - plasma odwzorowana na świetliste linie topograficzne (blue/indigo).
// Tylko góra (absolute, scrolluje ze stroną), desktop-only (reguła z CLAUDE.md),
// additive blend nad ciemnym tłem, 30fps + IO pauza + DPR clamp + context-loss recovery.
const VS = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y) * 3.5;
  float t = u_time * 0.3;
  float v = sin(p.x + t)
          + sin(p.y * 0.9 - t * 0.8)
          + sin((p.x + p.y) * 0.7 + t * 0.6)
          + sin(length(p - vec2(aspect * 1.75, 1.75)) - t);
  float tri = abs(fract(v * 1.5) - 0.5) * 2.0;
  float lines = 1.0 - smoothstep(0.0, 0.07, tri);   // węższy próg = ostrzejsze, cieńsze okręgi
  float base = 0.07 * (0.5 + 0.5 * sin(v));
  float vert = smoothstep(-0.1, 1.0, uv.y);
  vec3 col = mix(vec3(0.20, 0.50, 1.0), vec3(0.5, 0.30, 1.0), 0.5 + 0.5 * sin(v));
  gl_FragColor = vec4(col * (lines + base) * vert * 1.15, 1.0);
}
`;

function ShaderCanvas() {
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    if (gl.isContextLost()) { setCanvasKey((k) => k + 1); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Contour compile:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VS);
    const frag = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, frag); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn('Contour link:', gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      // mobile: DPR clamp 1.0 (lekko); desktop: 1.5 (zgodnie z patternem mobilnych shaderów)
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
      const w = canvas.clientWidth * dpr, h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const FRAME = 1000 / 30;
    const t0 = performance.now();
    let last = 0;
    let firstFrameDone = false;
    const draw = (now?: number) => {
      if (!runningRef.current) return;
      const ts = now ?? performance.now();
      if (ts - last >= FRAME) {
        last = ts;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (uTime) gl.uniform1f(uTime, (ts - t0) / 1000);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!firstFrameDone) { firstFrameDone = true; canvas.style.visibility = 'visible'; }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !runningRef.current) { runningRef.current = true; draw(); }
      else if (!entry.isIntersecting && runningRef.current) { runningRef.current = false; cancelAnimationFrame(rafRef.current); }
    }, { rootMargin: '100px' });
    io.observe(canvas);

    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafRef.current); };
    const onRestored = () => { setCanvasKey((k) => k + 1); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      canvas.style.visibility = 'hidden';
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(frag); gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [canvasKey]);

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 inset-x-0 h-[460px] sm:h-[560px] md:h-[640px] pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    >
      <canvas key={canvasKey} ref={canvasRef} className="w-full h-full block opacity-90" style={{ visibility: 'hidden' }} />
    </div>
  );
}

export function BlogHeroBackground() {
  // Renderowany na wszystkich urządzeniach - mobile dostaje DPR 1.0 + 30fps + IO pauzę.
  return <ShaderCanvas />;
}
