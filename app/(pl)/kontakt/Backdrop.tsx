'use client'

import { useEffect, useRef } from 'react'

// Tło strony kontaktu - OPŁYW (wybór właściciela 2026-09-29: "opływ jest zajebisty"). Włosowe linie
// przepływu płyną od lewej (od Ciebie) i opływają formularz (funkcja prądu wokół przeszkody), przy
// formularzu linie w kolorze marki, dalej biel ~7%; po co trzeciej linii suną kreski w kolorze marki
// (potencjał prędkości - przy formularzu przyspieszają jak w prawdziwym przepływie). Kursor rozsuwa
// linie jak mała przeszkoda, pisanie w formularzu przyspiesza przepływ, wysłanie przepuszcza przez
// całość pas światła. Marka: czerń, ostre linie, błękit #3b82f6 tylko jako światło (właściciel odrzucił
// wcześniej płynny błękit i odmiany: "zupełnie niepasujące do brandingu marki").
// Przeszkoda = zaokrąglony prostokąt (squircle) wokół formularza z zapasem (formularz "Bez karty",
// wybór właściciela 2026-09-29) - kształt formularza wyznacza sam strumień, w środku linii nie ma.
// Linie biegną równo także pod tekstem - wygaszanie pod nagłówkiem i danymi dawało ciemną plamę za
// lewą kolumną (właściciel: "usuń ten cień za lewą częścią"). Góra pod nawigacją czarna, dół gaśnie
// do stopki (CSS). Jeden przebieg, linie z wygładzaniem na 1 px płótna w rozdzielczości ekranu (DPR
// do 2, budżet pikseli). ~30 fps, pauza poza ekranem i przy ukrytej karcie, start po idle,
// KHR_parallel_shader_compile. Save-Data / <= 2 GB RAM / brak WebGL / brak highp: czerń (CSS).
// Ograniczony ruch: jedna nieruchoma klatka (przerysowana przy zmianie rozmiaru i wariantu).
// Płótno tworzone przy każdym montażu, w sprzątaniu loseContext() + usunięcie.

const VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FS = `
precision highp float;
uniform vec2 u_res;      // płótno w px
uniform float u_px;      // px CSS na px płótna
uniform float u_time;
uniform vec4 u_card;     // formularz: x0, y0, x1, y1 (px CSS, y w górę)
uniform float u_pad;     // zapas przeszkody wokół formularza w px CSS
uniform vec3 u_mouse;    // px CSS (y w górę), z = obecność kursora 0..1
uniform float u_sent;    // s od wysłania (99 = brak)
uniform float u_type;    // energia pisania 0..1
uniform float u_gap;     // odstęp linii w px CSS

const vec3 BG = vec3(0.0196);
const vec3 BRAND = vec3(0.231, 0.510, 0.965);
const vec3 HI = vec3(0.376, 0.647, 0.980);
const vec3 INK = vec3(0.886, 0.910, 0.941);

// włosowa linia: d = odległość w px CSS, w = grubość; wygładzanie na 1 px płótna
float hair(float d, float w) {
  float ww = max(w, u_px);
  return clamp((ww * 0.5 - d) / u_px + 0.5, 0.0, 1.0) * (w / ww);
}
float hash1(float n) { return fract(sin(n * 12.9898 + 4.1414) * 43758.5453); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec2 obsC() { return (u_card.xy + u_card.zw) * 0.5; }
vec2 obsS() { return (u_card.zw - u_card.xy) * 0.5 + u_pad; }
// "promień" przeszkody w przeskalowanych współrzędnych (1 = brzeg): squircle (n = 4) - zaokrąglony prostokąt
float obsR2(vec2 q) {
  vec2 a = q * q;
  return sqrt(a.x * a.x + a.y * a.y);
}
// funkcja prądu: przepływ w prawo opływający przeszkodę (dublet) + kursor jako mała przeszkoda
float psiAt(vec2 p) {
  vec2 s = obsS();
  vec2 q = (p - obsC()) / s;
  float qq = max(obsR2(q), 0.04);
  float psi = p.y - s.y * q.y / qq;
  vec2 dm = p - u_mouse.xy;
  psi -= 90.0 * 90.0 * u_mouse.z * dm.y / max(dot(dm, dm), 900.0);
  return psi;
}

void main() {
  vec2 css = gl_FragCoord.xy * u_px;
  vec2 view = u_res * u_px;
  float fade = smoothstep(40.0, 160.0, view.y - css.y); // pod nawigacją czysta czerń

  vec2 s = obsS();
  vec2 q = (css - obsC()) / s;
  float qq = max(obsR2(q), 0.04);
  float rq = sqrt(qq);
  float psi = psiAt(css);
  vec2 g = vec2(psiAt(css + vec2(1.0, 0.0)) - psi, psiAt(css + vec2(0.0, 1.0)) - psi);
  float k = floor(psi / u_gap + 0.5);
  float dl = abs(psi - k * u_gap) / max(length(g), 0.05);
  float out1 = smoothstep(0.95, 1.08, rq);       // w środku przeszkody linii nie ma
  float near = 1.0 - smoothstep(1.0, 2.1, rq);   // bliskość formularza
  vec3 col = BG + mix(INK * 0.075, BRAND * 0.45, near) * hair(dl, 1.0) * out1 * fade;

  // kreski płyną wzdłuż linii (potencjał prędkości), na co trzeciej linii, jasna głowa i gasnący ogon
  float phi = css.x + s.x * q.x / qq;
  float h = hash1(k);
  float sp = (70.0 + 80.0 * h) * (1.0 + 1.6 * u_type);
  float L = 260.0 + 260.0 * hash1(k + 7.0);
  float f = fract((phi - u_time * sp) / L + h * 7.0);
  float head = 0.16;
  float dash = smoothstep(0.0, head, f) * clamp((head - f) * L / u_px, 0.0, 1.0);
  col += mix(HI, BRAND, 0.35) * hair(dl, 1.5) * dash * step(0.64, h) * out1 * fade;

  // wysłanie: pas światła przepływa przez całość w stronę formularza i dalej
  if (u_sent < 4.0) {
    float bx = u_card.x - 600.0 + u_sent * 800.0;
    float b = exp(-pow((phi - bx) / 70.0, 2.0)) * (1.0 - smoothstep(2.2, 4.0, u_sent));
    col += BRAND * hair(dl, 1.3) * b * out1 * fade;
  }

  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`

type Rect = [number, number, number, number]
const FAR: Rect = [-1e5, -1e5, -1e5 + 1, -1e5 + 1]

export function ContactBackdrop({ sent }: { sent: boolean }) {
	const hostRef = useRef<HTMLDivElement | null>(null)
	const sentAt = useRef(-1)
	const kick = useRef<(() => void) | null>(null)

	useEffect(() => {
		if (!sent) return
		sentAt.current = performance.now()
		kick.current?.()
	}, [sent])

	useEffect(() => {
		const host = hostRef.current
		if (!host) return
		const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
		if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2)) return

		let cancelled = false
		let teardown = () => {}
		const start = () => { if (!cancelled) teardown = setup(host) }
		const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
		const idleId = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 700 }) : window.setTimeout(start, 250)

		function setup(host: HTMLDivElement) {
			const root = host.closest('.kt') as HTMLElement | null
			const section = host.closest('.kt-main') as HTMLElement | null
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

			const canvas = document.createElement('canvas')
			canvas.className = 'kt-bg-canvas'
			canvas.setAttribute('aria-hidden', 'true')
			const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' })
			const hp = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
			if (!gl || !hp || hp.precision <= 0) return () => {}
			host.appendChild(canvas)

			const vs = gl.createShader(gl.VERTEX_SHADER)!
			const fs = gl.createShader(gl.FRAGMENT_SHADER)!
			gl.shaderSource(vs, VS); gl.compileShader(vs)
			gl.shaderSource(fs, FS); gl.compileShader(fs)
			const prog = gl.createProgram()!
			gl.attachShader(prog, vs); gl.attachShader(prog, fs)
			gl.bindAttribLocation(prog, 0, 'a_pos')
			gl.linkProgram(prog)
			const buf = gl.createBuffer()
			const par = gl.getExtension('KHR_parallel_shader_compile')

			let raf = 0, idleRaf = 0, pollRaf = 0, ready = false, alive = true, visible = true, lastDraw = 0
			let lastT = performance.now()
			const t0 = performance.now()
			const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, z: 0, tz: 0 }
			let typeE = 0
			let U: Record<string, WebGLUniformLocation | null> = {}

			const size = () => {
				const cw = host.clientWidth, ch = host.clientHeight
				if (!cw || !ch) return
				const dpr = Math.min(window.devicePixelRatio || 1, 2)
				const scale = Math.min(dpr, Math.sqrt((fine ? 3.2e6 : 2.2e6) / (cw * ch)))
				const bw = Math.max(1, Math.round(cw * scale)), bh = Math.max(1, Math.round(ch * scale))
				if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh }
			}

			const rectOf = (el: Element | null, c: DOMRect): Rect => {
				if (!el) return FAR
				const r = el.getBoundingClientRect()
				if (!r.width || !r.height) return FAR
				return [r.left - c.left, c.bottom - r.bottom, r.right - c.left, c.bottom - r.top]
			}

			const draw = (now: number) => {
				const dt = Math.min(0.1, (now - lastT) / 1000)
				lastT = now
				mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt / 0.12))
				mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt / 0.12))
				mouse.z += (mouse.tz - mouse.z) * (1 - Math.exp(-dt / 0.5))
				typeE *= Math.exp(-dt / 1.2)

				const c = canvas.getBoundingClientRect()
				const px = c.width / canvas.width || 1
				const card = rectOf(root?.querySelector('.kt-card') ?? null, c)
				const since = sentAt.current > 0 && !reduced ? (now - sentAt.current) / 1000 : 99
				if (since > 6 && since < 99) sentAt.current = -1

				gl.viewport(0, 0, canvas.width, canvas.height)
				gl.uniform2f(U.res, canvas.width, canvas.height)
				gl.uniform1f(U.px, px)
				gl.uniform1f(U.time, reduced ? 30 : (now - t0) / 1000)
				gl.uniform4f(U.card, ...card)
				// zapas wokół formularza: na wąskim ekranie mniejszy (linie zaczynają się łukiem tuż nad nim)
				gl.uniform1f(U.pad, c.width < 760 ? 30 : 40)
				gl.uniform3f(U.mouse, mouse.x, c.height - mouse.y, reduced ? 0 : mouse.z)
				gl.uniform1f(U.sent, since)
				gl.uniform1f(U.type, reduced ? 0 : typeE)
				gl.uniform1f(U.gap, c.width < 760 ? 22 : 26)
				gl.drawArrays(gl.TRIANGLES, 0, 6)
				if (!host.hasAttribute('data-ready')) host.setAttribute('data-ready', '')
			}

			const loop = (now: number) => {
				raf = 0
				if (!alive || !visible || document.hidden) return
				if (now - lastDraw >= 1000 / 31) { lastDraw = now; draw(now) }
				raf = requestAnimationFrame(loop)
			}
			const run = () => {
				if (!ready || !alive) return
				if (reduced) {
					if (!idleRaf) idleRaf = requestAnimationFrame((now) => { idleRaf = 0; draw(now) })
					return
				}
				if (!raf && visible && !document.hidden) { lastT = performance.now(); raf = requestAnimationFrame(loop) }
			}
			kick.current = run

			const onReady = () => {
				if (!alive) return
				if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('Kontakt tło:', gl.getProgramInfoLog(prog)); alive = false; canvas.remove(); return }
				gl.useProgram(prog)
				gl.bindBuffer(gl.ARRAY_BUFFER, buf)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
				gl.enableVertexAttribArray(0)
				gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
				U = Object.fromEntries(['res', 'px', 'time', 'card', 'pad', 'mouse', 'sent', 'type', 'gap']
					.map((k) => [k, gl.getUniformLocation(prog, `u_${k}`)]))
				size()
				ready = true
				run()
			}
			// kompilacja bez blokowania wątku, gdy przeglądarka to umie
			if (par) {
				const poll = () => { pollRaf = 0; if (!alive) return; if (gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) onReady(); else pollRaf = requestAnimationFrame(poll) }
				pollRaf = requestAnimationFrame(poll)
			} else onReady()

			// zmiana rozmiaru (także formularza) = przerysowanie
			const ro = new ResizeObserver(() => { if (ready) size(); if (reduced) run() })
			ro.observe(host)
			if (section) ro.observe(section)
			const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() }, { rootMargin: '100px' })
			if (section) io.observe(section)
			const onVis = () => run()
			document.addEventListener('visibilitychange', onVis)
			const onMove = (e: PointerEvent) => {
				if (e.pointerType !== 'mouse') return
				const c = canvas.getBoundingClientRect()
				mouse.tx = e.clientX - c.left; mouse.ty = e.clientY - c.top; mouse.tz = 1
				if (mouse.x < -1e3) { mouse.x = mouse.tx; mouse.y = mouse.ty }
			}
			const onLeave = () => { mouse.tz = 0 }
			// pisanie w formularzu przyspiesza przepływ
			const form = root?.querySelector('.kt-form') ?? null
			const onInput = () => { typeE = Math.min(1, typeE + 0.22) }
			if (!reduced) {
				if (fine) {
					window.addEventListener('pointermove', onMove, { passive: true })
					document.documentElement.addEventListener('pointerleave', onLeave)
				}
				form?.addEventListener('input', onInput)
			}
			const onLost = (e: Event) => { e.preventDefault(); alive = false; cancelAnimationFrame(raf); host.removeAttribute('data-ready') }
			canvas.addEventListener('webglcontextlost', onLost)

			return () => {
				alive = false
				kick.current = null
				cancelAnimationFrame(raf); cancelAnimationFrame(idleRaf); cancelAnimationFrame(pollRaf)
				ro.disconnect(); io.disconnect()
				document.removeEventListener('visibilitychange', onVis)
				window.removeEventListener('pointermove', onMove)
				document.documentElement.removeEventListener('pointerleave', onLeave)
				form?.removeEventListener('input', onInput)
				canvas.removeEventListener('webglcontextlost', onLost)
				gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf)
				gl.getExtension('WEBGL_lose_context')?.loseContext()
				canvas.remove()
				host.removeAttribute('data-ready')
			}
		}

		return () => {
			cancelled = true
			if (w.cancelIdleCallback) w.cancelIdleCallback(idleId)
			else window.clearTimeout(idleId)
			teardown()
		}
	}, [])

	return (
		<div className="kt-bg" aria-hidden="true">
			<div className="kt-bg-stick" ref={hostRef} />
		</div>
	)
}
