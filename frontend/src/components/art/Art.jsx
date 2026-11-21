import { useId } from 'react'

/**
 * Illustrated placeholder artwork in the brand palette.
 * Shown wherever real photography has not been supplied yet.
 * kinds: laddu | halwa | barfi | adhirasam | mittai | cake | brownie | murukku |
 *        ribbon | thattai | mixture | tin | box | palm | jaggery | pot
 */

const TONES = {
  ivory: { inner: '#FCF5EA', outer: '#EADBC2', arch: '#C99A55', plate: '#FFFDF8', ink: '#4A2116' },
  beige: { inner: '#F3E4CC', outer: '#D9BF99', arch: '#B98845', plate: '#FFF9EF', ink: '#4A2116' },
  cocoa: { inner: '#5C2E20', outer: '#24110C', arch: '#C99A55', plate: '#3A1C13', ink: '#F4E8D5' },
}

const SPHERES = {
  amber: ['#E2A766', '#A8642A', '#5E2E14'],
  honey: ['#EFCB93', '#C08A4A', '#7C4F22'],
  sand: ['#F6DDAF', '#D2A86A', '#9A7038'],
  sesame: ['#9A7258', '#5B3A26', '#24140C'],
}

function rng(seed) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function Art({ kind = 'laddu', tone = 'ivory', palette, className = '', title }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (s) => `${raw}${s}`
  const T = TONES[tone] || TONES.ivory
  const ctx = { id, T, palette, tone }
  const Scene = SCENES[kind] || SCENES.laddu

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label={title || `${kind} illustration`}
    >
      <defs>
        <radialGradient id={id('bg')} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor={T.inner} />
          <stop offset="100%" stopColor={T.outer} />
        </radialGradient>
        <radialGradient id={id('shadow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#28130E" stopOpacity={tone === 'cocoa' ? 0.6 : 0.28} />
          <stop offset="100%" stopColor="#28130E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('gold')} x1="0" x2="1">
          <stop offset="0%" stopColor="#9C6F33" />
          <stop offset="35%" stopColor="#E8C98F" />
          <stop offset="65%" stopColor="#C99A55" />
          <stop offset="100%" stopColor="#8A5F2A" />
        </linearGradient>
        {Object.entries(SPHERES).map(([k, [l, m, d]]) => (
          <radialGradient key={k} id={id(`sp-${k}`)} cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor={l} />
            <stop offset="55%" stopColor={m} />
            <stop offset="100%" stopColor={d} />
          </radialGradient>
        ))}
      </defs>
      <rect width="400" height="500" fill={`url(#${id('bg')})`} />
      {/* logo-inspired arch */}
      <path
        d="M118 410 V214 A82 82 0 0 1 282 214 V410"
        fill="none"
        stroke={T.arch}
        strokeWidth="1"
        opacity={tone === 'cocoa' ? 0.55 : 0.45}
      />
      <circle cx="200" cy="214" r="118" fill="none" stroke={T.arch} strokeWidth="0.6" opacity="0.25" />
      <PalmSprig x={318} y={70} color={T.arch} opacity={0.35} />
      <Scene {...ctx} />
    </svg>
  )
}

/* ───────── shared pieces ───────── */

function PalmSprig({ x, y, color, opacity = 0.4, scale = 1, flip = false }) {
  const fronds = Array.from({ length: 9 }, (_, i) => -70 + i * 17)
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} opacity={opacity}>
      <path d="M0 60 Q8 20 2 0" stroke={color} strokeWidth="1" fill="none" />
      {fronds.map((a, i) => (
        <path
          key={i}
          d="M0 0 C 10 -6 30 -8 46 -2 C 30 -1 12 2 0 0 Z"
          fill={color}
          transform={`translate(2 ${i * 2}) rotate(${a})`}
        />
      ))}
    </g>
  )
}

function Plate({ T, id, cy = 372, rx = 150, ry = 40 }) {
  return (
    <g>
      <ellipse cx="200" cy={cy + 16} rx={rx + 20} ry={ry} fill={`url(#${id('shadow')})`} />
      <ellipse cx="200" cy={cy} rx={rx} ry={ry} fill={T.plate} />
      <ellipse cx="200" cy={cy - 2} rx={rx - 16} ry={ry - 10} fill="none" stroke="#C99A55" strokeWidth="1.2" opacity="0.8" />
      <ellipse cx="200" cy={cy} rx={rx} ry={ry} fill="none" stroke="#C99A55" strokeWidth="0.8" opacity="0.6" />
    </g>
  )
}

function Sphere({ id, cx, cy, r, pal = 'amber', seed = 1, speck = '#3A1A0C' }) {
  const rand = rng(seed)
  const dots = Array.from({ length: Math.round(r * 0.9) }, () => {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * r * 0.9
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, 0.6 + rand() * 1.4, rand()]
  })
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.92} rx={r * 0.85} ry={r * 0.2} fill="#28130E" opacity="0.18" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id(`sp-${pal}`)})`} />
      {dots.map(([x, y, s, o], i) => (
        <circle key={i} cx={x} cy={y} r={s} fill={pal === 'sesame' ? '#F1E3C8' : speck} opacity={0.15 + o * 0.35} />
      ))}
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.42} rx={r * 0.28} ry={r * 0.14} fill="#FFF6E6" opacity="0.28" transform={`rotate(-30 ${cx - r * 0.35} ${cy - r * 0.42})`} />
    </g>
  )
}

function Slab({ x, y, w = 100, h = 44, dx = 30, dy = 20, front, top, side, holes, seed = 3, nuts }) {
  const rand = rng(seed)
  return (
    <g>
      <ellipse cx={x + w / 2 + dx / 2} cy={y + h + 4} rx={w * 0.62} ry="8" fill="#28130E" opacity="0.16" />
      <path d={`M${x + w} ${y} L${x + w + dx} ${y - dy} L${x + w + dx} ${y + h - dy} L${x + w} ${y + h} Z`} fill={side} />
      <rect x={x} y={y} width={w} height={h} fill={front} rx="2" />
      <path d={`M${x} ${y} L${x + dx} ${y - dy} L${x + w + dx} ${y - dy} L${x + w} ${y} Z`} fill={top} />
      <path d={`M${x + 8} ${y - 3} L${x + dx * 0.7} ${y - dy + 4}`} stroke="#FFF2DA" strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      {holes &&
        Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={x + 4 + rand() * (w - 8)} cy={y + 4 + rand() * (h - 8)} r={0.8 + rand() * 1.8} fill="#7A4A12" opacity="0.45" />
        ))}
      {nuts &&
        Array.from({ length: nuts }, (_, i) => {
          const t = (i + 0.5) / nuts
          const nx = x + dx * 0.5 + t * w * 0.9
          const ny = y - dy * 0.5 + (rand() - 0.5) * 8
          return <ellipse key={i} cx={nx} cy={ny} rx="7" ry="3.6" fill="#EAD2A6" stroke="#B88A50" strokeWidth="0.6" transform={`rotate(${rand() * 60 - 30} ${nx} ${ny})`} />
        })}
    </g>
  )
}

function Disc({ cx, cy, rx = 66, ry = 18, th = 10, top, side, seed = 2, dots = '#F1E3C8', dotCount = 22, extra }) {
  const rand = rng(seed)
  return (
    <g>
      <ellipse cx={cx} cy={cy + th} rx={rx} ry={ry} fill={side} />
      <rect x={cx - rx} y={cy} width={rx * 2} height={th} fill={side} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={top} />
      <ellipse cx={cx - rx * 0.2} cy={cy - ry * 0.3} rx={rx * 0.5} ry={ry * 0.35} fill="#FFF3DD" opacity="0.12" />
      {Array.from({ length: dotCount }, (_, i) => {
        const a = rand() * Math.PI * 2
        const d = Math.sqrt(rand()) * 0.85
        return <ellipse key={i} cx={cx + Math.cos(a) * rx * d} cy={cy + Math.sin(a) * ry * d} rx="1.6" ry="1" fill={dots} opacity="0.75" />
      })}
      {extra?.(rand)}
    </g>
  )
}

function Bowl({ id, cy = 330, rx = 120, depth = 70 }) {
  return (
    <g>
      <ellipse cx="200" cy={cy + depth + 10} rx={rx * 0.9} ry="16" fill={`url(#${id('shadow')})`} />
      <path d={`M${200 - rx} ${cy} Q${200 - rx * 0.9} ${cy + depth * 1.25} 200 ${cy + depth} Q${200 + rx * 0.9} ${cy + depth * 1.25} ${200 + rx} ${cy} Z`} fill={`url(#${id('gold')})`} />
      <rect x={200 - 34} y={cy + depth - 6} width="68" height="12" rx="3" fill={`url(#${id('gold')})`} />
      <path d={`M${200 - rx + 20} ${cy + 18} Q200 ${cy + depth * 0.9} ${200 + rx - 20} ${cy + 18}`} stroke="#FFF1D2" strokeWidth="2" fill="none" opacity="0.35" />
    </g>
  )
}

/* ───────── scenes ───────── */

const SCENES = {
  laddu: ({ id, T, palette = 'amber' }) => (
    <g>
      <Plate T={T} id={id} />
      <Sphere id={id} cx={200} cy={206} r={46} pal={palette} seed={11} />
      <Sphere id={id} cx={156} cy={268} r={48} pal={palette} seed={12} />
      <Sphere id={id} cx={246} cy={268} r={48} pal={palette} seed={13} />
      <Sphere id={id} cx={112} cy={334} r={48} pal={palette} seed={14} />
      <Sphere id={id} cx={200} cy={338} r={50} pal={palette} seed={15} />
      <Sphere id={id} cx={288} cy={334} r={48} pal={palette} seed={16} />
      <ellipse cx="200" cy="168" rx="9" ry="4.5" fill="#EAD2A6" stroke="#B88A50" strokeWidth="0.6" />
    </g>
  ),

  halwa: ({ id, T, palette }) => {
    const c = palette === 'fig'
      ? { front: '#4E2019', top: '#7A3A2C', side: '#36150F' }
      : { front: '#6E2E12', top: '#A4521F', side: '#4A1E0B' }
    return (
      <g>
        <Plate T={T} id={id} />
        <Slab x={140} y={262} {...c} nuts={3} seed={5} />
        <Slab x={82} y={320} {...c} nuts={3} seed={6} />
        <Slab x={204} y={326} {...c} nuts={3} seed={7} />
      </g>
    )
  },

  barfi: ({ id, T }) => {
    const c = { front: '#C98A2C', top: '#E9B958', side: '#9C6418' }
    return (
      <g>
        <Plate T={T} id={id} />
        <Slab x={150} y={250} w={84} h={40} {...c} holes seed={21} />
        <Slab x={86} y={316} w={84} h={40} {...c} holes seed={22} />
        <Slab x={190} y={322} w={84} h={40} {...c} holes seed={23} />
        <Slab x={136} y={196} w={84} h={40} {...c} holes seed={24} />
      </g>
    )
  },

  adhirasam: ({ id, T }) => (
    <g>
      <Plate T={T} id={id} />
      {[0, 1, 2, 3].map((i) => (
        <Disc key={i} cx={200 + (i % 2 ? 6 : -6)} cy={340 - i * 26} top="#7A3A1C" side="#4A1F0D" seed={30 + i} />
      ))}
      <Disc cx={318} cy={350} rx={44} ry={13} th={8} top="#7A3A1C" side="#4A1F0D" seed={40} />
    </g>
  ),

  thattai: ({ id, T }) => (
    <g>
      <Plate T={T} id={id} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Disc
          key={i}
          cx={200 + (i % 2 ? 10 : -10)}
          cy={350 - i * 18}
          rx={70}
          ry={20}
          th={6}
          top="#E3B66C"
          side="#B07E36"
          dots="#8C5A1E"
          dotCount={18}
          seed={50 + i}
          extra={(rand) =>
            i === 4 &&
            Array.from({ length: 6 }, (_, k) => (
              <ellipse key={k} cx={160 + rand() * 90} cy={268 + rand() * 18} rx="4" ry="1.6" fill="#6B6A3A" opacity="0.8" transform={`rotate(${rand() * 180} 200 275)`} />
            ))
          }
        />
      ))}
    </g>
  ),

  mittai: ({ id, T }) => {
    const c = { front: '#B5762C', top: '#D9A04C', side: '#86531A' }
    const Bar = ({ x, y, seed }) => {
      const rand = rng(seed)
      return (
        <g>
          <Slab x={x} y={y} w={120} h={18} dx={26} dy={18} {...c} seed={seed} />
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={i} cx={x + 14 + i * 12 + rand() * 6} cy={y - 9 + (rand() - 0.5) * 8} rx="6" ry="3.6" fill="#E9CB92" stroke="#A4743A" strokeWidth="0.6" />
          ))}
        </g>
      )
    }
    return (
      <g>
        <Plate T={T} id={id} />
        <Bar x={124} y={250} seed={61} />
        <Bar x={96} y={296} seed={62} />
        <Bar x={150} y={342} seed={63} />
      </g>
    )
  },

  brownie: ({ id, T }) => {
    const c = { front: '#2E150D', top: '#4A2618', side: '#1E0D07' }
    return (
      <g>
        <Plate T={T} id={id} />
        <Slab x={150} y={246} w={78} h={36} {...c} seed={71} />
        <Slab x={92} y={312} w={78} h={36} {...c} seed={72} />
        <Slab x={196} y={318} w={78} h={36} {...c} seed={73} />
        <path d="M178 232 l14 -6 l10 4 l16 -8" stroke="#7A4A33" strokeWidth="1" fill="none" />
        <path d="M118 298 l12 -6 l14 3 l18 -8" stroke="#7A4A33" strokeWidth="1" fill="none" />
      </g>
    )
  },

  cake: ({ id, T, palette = 'plum' }) => {
    const crumb = { plum: '#B97843', banana: '#D7A868', date: '#9A5B32' }[palette] || '#B97843'
    const bits = { plum: '#4A1E14', banana: '#7A5232', date: '#3A1A0E' }[palette] || '#4A1E14'
    const rand = rng(81)
    return (
      <g>
        <Plate T={T} id={id} rx={160} />
        {/* loaf */}
        <path d="M70 268 L250 268 L250 352 L70 352 Z" fill="#7A3A18" />
        <path d="M250 268 L288 248 L288 334 L250 352 Z" fill="#5A2810" />
        <path d="M70 268 Q90 222 160 220 Q240 218 250 268 Z" fill="#6A3014" />
        <path d="M250 268 Q262 236 288 248 L250 268 Z" fill="#4E220C" />
        <path d="M70 268 Q90 222 160 220 Q240 218 250 268" stroke="#C99A55" strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* cut face */}
        <path d="M250 270 L250 352 L288 334 L288 250 Z" fill={crumb} opacity="0.0" />
        {/* slice */}
        <g transform="translate(286 0) rotate(8 30 330)">
          <rect x="10" y="252" width="40" height="96" rx="3" fill={crumb} />
          <path d="M10 256 Q30 236 50 256" fill="#6A3014" />
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={14 + rand() * 32} cy={262 + rand() * 80} r={1.2 + rand() * 2.4} fill={bits} opacity="0.75" />
          ))}
        </g>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={90 + rand() * 140} cy={232 + rand() * 18} r={1.5 + rand() * 2} fill="#E9C98F" opacity="0.6" />
        ))}
      </g>
    )
  },

  murukku: ({ id, T }) => {
    const spiral = (turns = 3.2, R = 80) => {
      let d = ''
      const steps = 220
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const a = t * turns * Math.PI * 2
        const r = 8 + t * R
        d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `
      }
      return d
    }
    const M = ({ x, y, s = 1, rot = 0, sy = 0.55 }) => (
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * sy})`}>
        <path d={spiral()} stroke="#28130E" strokeOpacity="0.25" strokeWidth="18" fill="none" strokeLinecap="round" transform="translate(0 8)" />
        <path d={spiral()} stroke="#A06A2C" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={spiral()} stroke="#D9A866" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d={spiral()} stroke="#F2D29A" strokeWidth="4" fill="none" strokeDasharray="3 7" strokeLinecap="round" />
      </g>
    )
    return (
      <g>
        <Plate T={T} id={id} rx={160} />
        <M x={150} y={300} s={0.8} rot={-8} />
        <M x={262} y={316} s={0.72} rot={14} />
        <M x={206} y={250} s={0.78} rot={4} />
      </g>
    )
  },

  ribbon: ({ id }) => {
    const rand = rng(91)
    return (
      <g>
        <Bowl id={id} />
        {Array.from({ length: 11 }, (_, i) => {
          const x = 110 + rand() * 170
          const y = 270 + rand() * 50
          const d = `M${x} ${y} q12 -10 24 0 t24 0 t24 0`
          return (
            <g key={i} transform={`rotate(${rand() * 70 - 35} ${x + 36} ${y})`}>
              <path d={d} stroke="#A0682A" strokeWidth="13" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#E0AE62" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#8A5520" strokeWidth="9" fill="none" strokeDasharray="1 3" opacity="0.5" />
            </g>
          )
        })}
      </g>
    )
  },

  mixture: ({ id }) => {
    const rand = rng(101)
    const cols = ['#E0AE62', '#C68A3A', '#F0CB82', '#8C5A22', '#6B6A3A', '#B5762C']
    return (
      <g>
        <Bowl id={id} />
        <path d="M86 332 Q200 230 314 332 Z" fill="#C68A3A" />
        {Array.from({ length: 170 }, (_, i) => {
          const x = 92 + rand() * 216
          const top = 332 - Math.sin(((x - 86) / 228) * Math.PI) * 96
          const y = top + rand() * (332 - top)
          const c = cols[Math.floor(rand() * cols.length)]
          return rand() > 0.55 ? (
            <circle key={i} cx={x} cy={y} r={2 + rand() * 3} fill={c} />
          ) : (
            <rect key={i} x={x} y={y} width={8 + rand() * 8} height="2.4" rx="1.2" fill={c} transform={`rotate(${rand() * 180} ${x} ${y})`} />
          )
        })}
      </g>
    )
  },

  tin: ({ id, T, tone, palette }) => {
    const dark = tone === 'cocoa'
    const body = dark ? ['#E8D5B9', '#FFF8EC', '#D9C19D'] : ['#3A1A10', '#6A3424', '#2A120B']
    const s = palette === 'petite' ? 0.8 : 1
    return (
      <g transform={`translate(${200 - 200 * s} ${380 - 380 * s}) scale(${s})`}>
        <defs>
          <linearGradient id={id('tin')} x1="0" x2="1">
            <stop offset="0%" stopColor={body[2]} />
            <stop offset="45%" stopColor={body[1]} />
            <stop offset="100%" stopColor={body[2]} />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="386" rx="140" ry="24" fill={`url(#${id('shadow')})`} />
        {/* body */}
        <path d="M100 236 L100 360 A100 26 0 0 0 300 360 L300 236 Z" fill={`url(#${id('tin')})`} />
        <path d="M100 344 L100 360 A100 26 0 0 0 300 360 L300 344 A100 26 0 0 1 100 344 Z" fill={`url(#${id('gold')})`} />
        {/* lid */}
        <path d="M94 206 L94 238 A106 28 0 0 0 306 238 L306 206 Z" fill={`url(#${id('tin')})`} />
        <path d="M94 232 L94 238 A106 28 0 0 0 306 238 L306 232 A106 28 0 0 1 94 232 Z" fill={`url(#${id('gold')})`} />
        <ellipse cx="200" cy="206" rx="106" ry="28" fill={body[1]} />
        <ellipse cx="200" cy="206" rx="106" ry="28" fill="none" stroke={`url(#${id('gold')})`} strokeWidth="3" />
        <ellipse cx="200" cy="206" rx="84" ry="20" fill="none" stroke="#C99A55" strokeWidth="0.8" opacity="0.8" />
        {/* emblem */}
        <image href={dark ? '/images/logo/mark.png' : '/images/logo/mark-light.png'} x="174" y="252" width="52" height="66" preserveAspectRatio="xMidYMid meet" />
        <text x="200" y="334" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" letterSpacing="3" fill="#C99A55">
          THE PALM STORY
        </text>
        {/* laddus beside the tin */}
        {palette !== 'petite' && (
          <>
            <Sphere id={id} cx={322} cy={364} r={22} pal="amber" seed={7} />
            <Sphere id={id} cx={78} cy={368} r={18} pal="honey" seed={8} />
          </>
        )}
      </g>
    )
  },

  box: ({ id, palette }) => {
    const hamper = palette === 'hamper'
    const x = hamper ? 70 : 96, w = hamper ? 220 : 180, y = 250, h = 110, dx = 46, dy = 34
    return (
      <g>
        <ellipse cx="210" cy={y + h + 14} rx={w * 0.7} ry="20" fill={`url(#${id('shadow')})`} />
        <path d={`M${x + w} ${y} L${x + w + dx} ${y - dy} L${x + w + dx} ${y + h - dy} L${x + w} ${y + h} Z`} fill="#2E140C" />
        <rect x={x} y={y} width={w} height={h} fill="#4A2116" />
        <path d={`M${x} ${y} L${x + dx} ${y - dy} L${x + w + dx} ${y - dy} L${x + w} ${y} Z`} fill="#5E2C1D" />
        {/* lid edge */}
        <rect x={x - 3} y={y} width={w + 3} height="20" fill="#3A1A10" />
        <path d={`M${x + w} ${y} L${x + w + dx} ${y - dy} L${x + w + dx} ${y - dy + 20} L${x + w} ${y + 20} Z`} fill="#24100A" />
        {/* ribbons */}
        <rect x={x + w / 2 - 7} y={y} width="14" height={h} fill={`url(#${id('gold')})`} />
        <path d={`M${x + w / 2 - 7} ${y} L${x + w / 2 - 7 + dx} ${y - dy} L${x + w / 2 + 7 + dx} ${y - dy} L${x + w / 2 + 7} ${y} Z`} fill={`url(#${id('gold')})`} />
        <path d={`M${x + w} ${y + h / 2 + 4} L${x + w + dx} ${y + h / 2 + 4 - dy} L${x + w + dx} ${y + h / 2 + 18 - dy} L${x + w} ${y + h / 2 + 18} Z`} fill="#A87A3E" />
        <path d={`M${x + dx / 2 + 4} ${y - dy / 2} L${x + w + dx / 2 + 4} ${y - dy / 2}`} stroke={`url(#${id('gold')})`} strokeWidth="10" />
        {/* bow */}
        <g transform={`translate(${x + w / 2 + dx / 2} ${y - dy / 2})`}>
          <path d="M0 0 C -30 -34 -56 -6 -40 6 C -28 14 -10 6 0 0 Z" fill={`url(#${id('gold')})`} />
          <path d="M0 0 C 30 -34 56 -6 40 6 C 28 14 10 6 0 0 Z" fill={`url(#${id('gold')})`} />
          <path d="M0 0 L -14 30 M0 0 L 12 32" stroke="#C99A55" strokeWidth="6" strokeLinecap="round" />
          <circle r="7" fill="#E8C98F" />
        </g>
        <image href="/images/logo/mark-light.png" x={x + 18} y={y + 34} width="34" height="44" />
        {hamper && <Sphere id={id} cx={334} cy={y + h + 2} r={20} pal="amber" seed={4} />}
      </g>
    )
  },

  palm: ({ T, tone }) => {
    const ink = tone === 'cocoa' ? '#E8D5B9' : '#4A2116'
    const Frond = ({ a, len = 120, droop = 30 }) => (
      <g transform={`rotate(${a})`}>
        <path d={`M0 0 Q${len * 0.5} ${-droop} ${len} ${droop * 0.4}`} stroke={ink} strokeWidth="1.6" fill="none" />
        {Array.from({ length: 14 }, (_, i) => {
          const t = (i + 1) / 15
          const px = len * t
          const py = -droop * 4 * t * (1 - t) + droop * 0.4 * t * t
          const l = 30 * (1 - t * 0.6)
          return (
            <g key={i}>
              <path d={`M${px} ${py} q${l * 0.4} ${-l * 0.6} ${l * 0.2} ${-l}`} stroke={ink} strokeWidth="1" fill="none" opacity="0.85" />
              <path d={`M${px} ${py} q${l * 0.5} ${l * 0.3} ${l * 0.3} ${l * 0.9}`} stroke={ink} strokeWidth="1" fill="none" opacity="0.85" />
            </g>
          )
        })}
      </g>
    )
    return (
      <g>
        <circle cx="236" cy="170" r="70" fill="#C99A55" opacity="0.28" />
        <circle cx="236" cy="170" r="70" fill="none" stroke="#C99A55" strokeWidth="1" opacity="0.7" />
        <path d="M30 412 Q200 392 370 412" stroke={T.arch} strokeWidth="1" fill="none" opacity="0.7" />
        <path d="M0 430 L400 430 L400 500 L0 500 Z" fill={ink} opacity="0.06" />
        {/* trunk */}
        <path d="M188 420 C 194 340 208 260 214 160" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M188 420 C 194 340 208 260 214 160" stroke={tone === 'cocoa' ? '#24110C' : '#F4E8D5'} strokeWidth="13" fill="none" strokeDasharray="1.5 9" opacity="0.6" />
        <g transform="translate(214 160)">
          {[-200, -170, -140, -110, -60, -30, 0, 25].map((a, i) => (
            <Frond key={i} a={a} len={i % 2 ? 110 : 128} droop={i % 2 ? 20 : 30} />
          ))}
        </g>
        {/* small palm */}
        <g opacity="0.55" transform="translate(88 300) scale(0.45)">
          <path d="M0 260 C 4 180 12 100 16 0" stroke={ink} strokeWidth="13" fill="none" />
          <g transform="translate(16 0)">
            {[-200, -160, -120, -60, -20, 20].map((a, i) => (
              <Frond key={i} a={a} />
            ))}
          </g>
        </g>
      </g>
    )
  },

  jaggery: ({ id, T }) => {
    const Cup = ({ x, y, s = 1, seed }) => {
      const rand = rng(seed)
      return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx="0" cy="34" rx="44" ry="10" fill="#28130E" opacity="0.2" />
          <path d="M-40 30 C -42 -10 -30 -34 0 -36 C 30 -34 42 -10 40 30 A40 10 0 0 1 -40 30 Z" fill="#5A2C16" />
          <path d="M-40 30 C -42 -10 -30 -34 0 -36 C -14 -20 -22 4 -18 34 Z" fill="#7A3E1E" opacity="0.7" />
          <ellipse cx="-14" cy="-20" rx="10" ry="5" fill="#E4B47A" opacity="0.18" transform="rotate(-30 -14 -20)" />
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={-34 + rand() * 68} cy={-28 + rand() * 56} r={0.6 + rand()} fill="#2A1209" opacity="0.5" />
          ))}
        </g>
      )
    }
    return (
      <g>
        {/* woven palm-leaf mat */}
        <g opacity="0.9">
          <ellipse cx="200" cy="368" rx="178" ry="58" fill="#D9BC8C" />
          <clipPath id={id('mat')}>
            <ellipse cx="200" cy="368" rx="178" ry="58" />
          </clipPath>
          <g clipPath={`url(#${id('mat')})`} stroke="#B48E58" strokeWidth="1.4" opacity="0.7">
            {Array.from({ length: 40 }, (_, i) => (
              <path key={i} d={`M${i * 12 - 40} 300 l60 140`} />
            ))}
            {Array.from({ length: 40 }, (_, i) => (
              <path key={`b${i}`} d={`M${i * 12 - 40} 440 l60 -140`} opacity="0.6" />
            ))}
          </g>
          <ellipse cx="200" cy="368" rx="178" ry="58" fill="none" stroke="#C99A55" strokeWidth="1" />
        </g>
        <Cup x={150} y={318} seed={1} />
        <Cup x={252} y={322} s={1.05} seed={2} />
        <Cup x={200} y={262} s={0.95} seed={3} />
        <Cup x={96} y={372} s={0.8} seed={4} />
        <Cup x={310} y={376} s={0.82} seed={5} />
        {/* broken piece */}
        <path d="M188 388 l18 -14 l22 6 l-6 18 l-24 4 Z" fill="#8A4A22" />
        <path d="M188 388 l18 -14 l22 6" stroke="#B9763E" strokeWidth="1" fill="none" />
        <path d="M170 410 l10 -6 l8 5 l-6 7 Z" fill="#6A3418" />
        {T && null}
      </g>
    )
  },

  pot: ({ id, T }) => (
    <g>
      <ellipse cx="200" cy="398" rx="150" ry="22" fill={`url(#${id('shadow')})`} />
      {/* kolam dots */}
      <g fill="#C99A55" opacity="0.7">
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={80 + i * 24} cy={430 - Math.sin((i / 10) * Math.PI) * 10} r="2" />
        ))}
      </g>
      {/* pot */}
      <path d="M118 270 C 96 300 100 370 150 392 L250 392 C 300 370 304 300 282 270 Z" fill="#7A3E22" />
      <path d="M118 270 C 96 300 100 370 150 392 L176 392 C 140 368 132 312 150 270 Z" fill="#9A5530" opacity="0.6" />
      <rect x="118" y="252" width="164" height="22" rx="6" fill="#5A2814" />
      <ellipse cx="200" cy="252" rx="82" ry="16" fill="#3A180C" />
      <ellipse cx="200" cy="254" rx="70" ry="11" fill="#6E2E12" />
      <path d="M118 300 Q200 316 282 300" stroke="#C99A55" strokeWidth="1.5" fill="none" />
      <path d="M114 312 Q200 330 286 312" stroke="#C99A55" strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* ladle */}
      <path d="M232 250 L300 150" stroke="#8A5A32" strokeWidth="7" strokeLinecap="round" />
      <path d="M300 150 L312 132" stroke="#C99A55" strokeWidth="9" strokeLinecap="round" />
      {/* steam */}
      <g stroke="#C99A55" strokeWidth="1.4" fill="none" opacity="0.8">
        <path d="M170 228 C 160 206 184 196 172 172 C 162 150 182 140 176 120" />
        <path d="M204 226 C 194 200 218 190 206 162" opacity="0.7" />
        <path d="M234 230 C 226 212 246 204 238 184" opacity="0.5" />
      </g>
      {T && null}
    </g>
  ),
}
