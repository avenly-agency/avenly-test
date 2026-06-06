'use client'

import { useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Check, Loader2, AlertCircle, ArrowRight, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ServiceSelect } from './ServiceSelect'
import type { ContactFormShared } from './useContactForm'

/**
 * /kontakt - Drenched-blue committed color hero + dark trust strip below.
 * Single source: dark form card, blue mesh shader, dark fallback for reduced motion.
 */
export function ContactSection({ ctx }: { ctx: ContactFormShared }) {
	const { form, isSubmitting, isSuccess, serverError, resetSuccess, onSubmit } = ctx
	const { register, handleSubmit, control, formState: { errors } } = form
	const reduce = useReducedMotion()

	// Waterfall - perceptible "one by one" without an empty-blue gap.
	// First element starts at t=0, last fully in at ~0.9s. Small y-shift only.
	const EASE = [0.22, 1, 0.36, 1] as const
	const fade = (delay: number) => ({
		initial: reduce ? false : { opacity: 0, y: 12 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5, delay, ease: EASE },
	})

	return (
		<div className="min-h-screen bg-[#050505]">
			{/* HERO FOLD - drenched blue */}
			<section className="relative overflow-hidden text-white lg:min-h-screen lg:flex lg:items-center" style={{ background: '#1538c8' }}>
				<BlueMeshBackground />

				{/* Soft top-left wash + bottom-right shade */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(8,20,80,0.45), transparent 65%)',
					}}
				/>

				<div className="relative w-full max-w-[1400px] 3xl:max-w-[1700px] 4xl:max-w-[2100px] mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-24 lg:py-24">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 2xl:gap-24 items-start">
						{/* LEFT - manifesto */}
						<div className="lg:col-span-7">
							<motion.div
								{...fade(0)}
								className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-blue-200/80 mb-5 sm:mb-6 flex items-center gap-3"
							>
								<span className="w-6 sm:w-8 h-px bg-blue-200/60" /> Avenly · 2026
							</motion.div>

							<motion.h1
								{...fade(0.07)}
								className="font-bold tracking-[-0.04em] leading-[0.92]"
								style={{ fontSize: 'clamp(2.75rem, 9vw, 9rem)' }}
							>
								Zacznijmy.
							</motion.h1>

							<motion.p
								{...fade(0.14)}
								className="mt-6 sm:mt-10 max-w-[42ch] text-base sm:text-lg lg:text-xl text-blue-50/90 leading-relaxed"
							>
								Strona, sklep, chatbot AI? Daj znać czego potrzebujesz - odpowiemy z konkretem,
								wyceną i deadlinem w 24 godziny.
							</motion.p>

							{/* Inline contact strip - items stagger one-by-one */}
							<div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
								<motion.div {...fade(0.28)}>
									<DrenchedContact icon={Mail} label="Mail" value="kontakt@avenly.pl" href="mailto:kontakt@avenly.pl" />
								</motion.div>
								<motion.div {...fade(0.34)}>
									<div className="group block border-t border-white/20 pt-3 sm:pt-4">
										<div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-blue-200/70 mb-1.5 sm:mb-2">
											<Phone size={12} /> Telefon
										</div>
										<a href="tel:+48668124367" className="block text-base lg:text-lg font-medium tracking-tight break-words hover:text-white/80 transition-colors">
											+48 668 124 367
										</a>
										<a href="tel:+48531104402" className="block text-base lg:text-lg font-medium tracking-tight break-words hover:text-white/80 transition-colors mt-1">
											+48 531 104 402
										</a>
									</div>
								</motion.div>
								<motion.div {...fade(0.4)}>
									<DrenchedContact icon={Clock} label="Godziny" value="Pon-Pt · 9-17" />
								</motion.div>
							</div>
						</div>

						{/* RIGHT - dark form card */}
						<motion.div
							{...fade(0.21)}
							className="lg:col-span-5"
						>
							<div className="bg-[#0a0a0a] text-white border border-white/15 rounded-2xl p-5 sm:p-7 lg:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,15,0.9)]">
								<AnimatePresence mode="wait">
									{isSuccess ? (
										<motion.div
											key="ok"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="text-center py-8 sm:py-10"
										>
											<div
												className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-6 text-white"
												style={{ background: '#1538c8' }}
											>
												<CheckCircle2 size={28} />
											</div>
											<h3 className="text-2xl font-bold mb-3 tracking-tight text-white">
												Wysłane.
											</h3>
											<p className="mb-8 text-sm max-w-xs mx-auto text-slate-400">
												Odpowiemy w 24h. Sprawdź też spam.
											</p>
											<button
												onClick={resetSuccess}
												className="text-sm font-medium border-b border-white text-white pb-0.5 hover:opacity-80 transition-opacity cursor-pointer"
											>
												Wyślij kolejną
											</button>
										</motion.div>
									) : (
										<form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
											<input
												type="checkbox"
												className="hidden"
												style={{ display: 'none' }}
												{...register('botcheck')}
											/>

											<div className="flex items-center justify-between mb-1 sm:mb-2">
												<span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-slate-500">
													Brief
												</span>
												<span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-slate-600">
													5 pól · 60 sek
												</span>
											</div>

											<DarkInput
												label="Imię i nazwisko"
												id="name-c"
												error={errors.name}
												autoComplete="name"
												{...register('name', { required: 'Wymagane' })}
											/>
											<DarkInput
												label="Email"
												id="email-c"
												type="email"
												autoComplete="email"
												inputMode="email"
												error={errors.email}
												{...register('email', {
													required: 'Wymagane',
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: 'Niepoprawny format',
													},
												})}
											/>

											<DarkInput
												label="Telefon (opcjonalnie)"
												id="phone-c"
												type="tel"
												autoComplete="tel"
												inputMode="tel"
												{...register('phone')}
											/>

											<ServiceSelect
												control={control}
												name="subject"
												label="Interesująca usługa"
												id="subject-c"
												theme="dark"
												variant="card"
											/>

											<div>
												<label
													htmlFor="message-c"
													className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-slate-500 block mb-2"
												>
													Wiadomość
												</label>
												<textarea
													id="message-c"
													rows={4}
													placeholder="Krótko o projekcie…"
													className={cn(
														'w-full border rounded-lg px-4 py-3 outline-none transition-colors resize-none focus:ring-2 text-base',
														errors.message
															? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
															: 'bg-[#050505] border-white/10 text-white placeholder-slate-600 focus:border-blue-400/60 focus:ring-blue-400/15'
													)}
													{...register('message', {
														required: 'Wymagane',
														minLength: { value: 10, message: 'Min 10 znaków' },
													})}
												/>
												{errors.message && (
													<span className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
														<AlertCircle size={11} /> {errors.message.message}
													</span>
												)}
											</div>

											<label className="flex items-start gap-2.5 cursor-pointer pt-1">
												<input
													type="checkbox"
													className="peer sr-only"
													{...register('privacy', { required: 'Wymagana zgoda' })}
												/>
												<span className="w-4 h-4 mt-0.5 border border-white/25 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:[&_svg]:opacity-100 transition-colors flex items-center justify-center shrink-0">
													<Check
														className="w-3 h-3 text-white opacity-0 transition-opacity"
														strokeWidth={3}
													/>
												</span>
												<span className="text-xs text-slate-400 leading-relaxed">
													Akceptuję{' '}
													<Link href="/polityka-prywatnosci" className="underline text-blue-400 hover:text-blue-300">
														Politykę Prywatności
													</Link>
													.
												</span>
											</label>
											{errors.privacy && (
												<span className="text-xs text-red-500 block -mt-2">{errors.privacy.message}</span>
											)}

											{serverError && (
												<div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
													{serverError}
												</div>
											)}

											<button
												type="submit"
												disabled={isSubmitting}
												className="w-full py-3.5 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer text-base"
												style={{ background: '#1538c8' }}
											>
												{isSubmitting ? (
													<>
														<Loader2 className="animate-spin" size={16} /> Wysyłanie…
													</>
												) : (
													<>
														Wyślij brief
														<ArrowRight size={16} />
													</>
												)}
											</button>
										</form>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				</div>

			</section>
		</div>
	)
}

/* ─────────────────────────────────────────────────────────────
 * Sub-components
 * ───────────────────────────────────────────────────────────── */

function DrenchedContact({
	icon: Icon,
	label,
	value,
	href,
}: {
	icon: React.ComponentType<{ size?: number; className?: string }>
	label: string
	value: string
	href?: string
}) {
	const Wrapper = href ? 'a' : 'div'
	return (
		<Wrapper
			{...(href ? { href } : {})}
			className={cn(
				'group block border-t border-white/20 pt-3 sm:pt-4',
				href && 'cursor-pointer'
			)}
		>
			<div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-blue-200/70 mb-1.5 sm:mb-2">
				<Icon size={12} /> {label}
			</div>
			<div
				className={cn(
					'text-base sm:text-base lg:text-lg font-medium tracking-tight break-words',
					href && 'group-hover:text-white/80 transition-colors'
				)}
			>
				{value}
			</div>
		</Wrapper>
	)
}

type DarkInputProps = {
	label: string
	id: string
	error?: { message?: string }
	type?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const DarkInput = ({ label, id, error, type = 'text', ...props }: DarkInputProps) => (
	<div>
		<label
			htmlFor={id}
			className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-slate-500 block mb-2"
		>
			{label}
		</label>
		<input
			id={id}
			type={type}
			className={cn(
				'w-full border rounded-lg px-4 py-3 outline-none transition-colors focus:ring-2 text-base',
				error
					? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
					: 'bg-[#050505] border-white/10 text-white placeholder-slate-600 focus:border-blue-400/60 focus:ring-blue-400/15'
			)}
			{...props}
		/>
		{error && (
			<span className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
				<AlertCircle size={11} /> {error.message}
			</span>
		)}
	</div>
)

/* ─────────────────────────────────────────────────────────────
 * Blue mesh shader - committed blue drench, large slow flow.
 * 30fps throttle, IO pause, DPR clamp, prefers-reduced-motion skip.
 * ───────────────────────────────────────────────────────────── */

const MESH_VERT = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

const MESH_FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i  = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);
	vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
	vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
	i = mod289(i);
	vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
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

void main(){
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 p = uv*2.0 - 1.0;
	p.x *= u_resolution.x / u_resolution.y;

	float t = u_time * 0.08;

	float n1 = snoise(p*0.5 + vec2(t*0.6, t*0.2));
	float n2 = snoise(p*1.1 + vec2(-t*0.3, t*0.7) + n1*0.5);

	vec3 deepNavy   = vec3(0.040, 0.080, 0.380);
	vec3 royal      = vec3(0.082, 0.220, 0.784);
	vec3 brightBlue = vec3(0.184, 0.357, 0.922);
	vec3 lightFlare = vec3(0.450, 0.640, 1.000);

	vec3 col = royal;
	col = mix(col, deepNavy, smoothstep(-0.6, 0.6, -n1) * 0.55);
	col = mix(col, brightBlue, smoothstep(-0.2, 0.8, n2) * 0.6);
	col = mix(col, lightFlare, smoothstep(0.5, 1.0, n2) * 0.35);

	col *= mix(1.0, 0.78, smoothstep(-0.4, 1.0, p.y));

	gl_FragColor = vec4(col, 1.0);
}
`

function BlueMeshBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const rafRef = useRef<number>(0)
	const runningRef = useRef(true)

	// useLayoutEffect runs synchronously AFTER DOM commit but BEFORE the browser
	// paints. Shader compile + first draw happen here → the very first paint of
	// /kontakt already shows the rendered shader. Zero gap, no "solid blue then
	// gradient" jump. Trade-off: route transition costs ~50-150ms more (shader
	// setup blocks first paint). Acceptable for the visual win.
	useLayoutEffect(() => {
		const reduceMotion = typeof window !== 'undefined'
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduceMotion) return

		const canvas = canvasRef.current
		if (!canvas) return
		const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
		if (!gl) return

		const compile = (type: number, src: string) => {
			const s = gl.createShader(type)
			if (!s) return null
			gl.shaderSource(s, src)
			gl.compileShader(s)
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				gl.deleteShader(s)
				return null
			}
			return s
		}

		const vs = compile(gl.VERTEX_SHADER, MESH_VERT)
		const fs = compile(gl.FRAGMENT_SHADER, MESH_FRAG)
		if (!vs || !fs) return

		const program = gl.createProgram()
		if (!program) return
		gl.attachShader(program, vs)
		gl.attachShader(program, fs)
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
		gl.useProgram(program)

		const buf = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buf)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW,
		)
		const aPos = gl.getAttribLocation(program, 'a_position')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

		const uTime = gl.getUniformLocation(program, 'u_time')
		const uRes = gl.getUniformLocation(program, 'u_resolution')

		const isMobile = !window.matchMedia('(min-width: 1024px)').matches
		const dprClamp = isMobile ? 1.0 : 1.25

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, dprClamp)
			const w = canvas.clientWidth * dpr
			const h = canvas.clientHeight * dpr
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w
				canvas.height = h
				gl.viewport(0, 0, w, h)
			}
		}
		resize()
		const ro = new ResizeObserver(resize)
		ro.observe(canvas)

		const FRAME_INTERVAL = 1000 / 30
		const t0 = performance.now()
		let lastDraw = 0

		const draw = (now?: number) => {
			if (!runningRef.current) return
			const ts = now ?? performance.now()
			if (ts - lastDraw >= FRAME_INTERVAL) {
				lastDraw = ts
				const t = (ts - t0) / 1000
				if (uTime) gl.uniform1f(uTime, t)
				if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height)
				gl.drawArrays(gl.TRIANGLES, 0, 6)
			}
			rafRef.current = requestAnimationFrame(draw)
		}
		// First draw - synchronous, before useLayoutEffect returns. Canvas backing
		// buffer has pixels by the time the browser composites the first paint.
		draw()

		const io = new IntersectionObserver(([entry]) => {
			const visible = entry.isIntersecting
			requestAnimationFrame(() => {
				if (visible && !runningRef.current) {
					runningRef.current = true
					draw()
				} else if (!visible && runningRef.current) {
					runningRef.current = false
					cancelAnimationFrame(rafRef.current)
				}
			})
		}, { rootMargin: '150px' })
		io.observe(canvas)

		const onVisibility = () => {
			if (document.hidden) {
				runningRef.current = false
				cancelAnimationFrame(rafRef.current)
			} else if (!runningRef.current) {
				runningRef.current = true
				draw()
			}
		}
		document.addEventListener('visibilitychange', onVisibility)

		return () => {
			runningRef.current = false
			cancelAnimationFrame(rafRef.current)
			ro.disconnect()
			io.disconnect()
			document.removeEventListener('visibilitychange', onVisibility)
			gl.deleteProgram(program)
			gl.deleteShader(vs)
			gl.deleteShader(fs)
			gl.deleteBuffer(buf)
		}
	}, [])

	// Shader is already rendering from frame 1 (useLayoutEffect above) - the
	// fade-in just smooths the transition from solid #1538c8 to full gradient.
	// "Color comes alive" rather than "blue → gradient swap".
	return (
		<motion.canvas
			ref={canvasRef}
			aria-hidden
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
			className="pointer-events-none absolute inset-0 w-full h-full"
		/>
	)
}
