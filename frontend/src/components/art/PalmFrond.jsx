/** Large palm frond used for the storytelling leaf-sweep transition */
export default function PalmFrond({ className = '', color = '#4A2116', gold = '#C99A55', style }) {
  const leaflets = Array.from({ length: 22 }, (_, i) => i)
  return (
    <svg viewBox="0 0 600 600" className={className} style={style} aria-hidden="true">
      <path d="M40 560 C 180 420 320 260 560 60" stroke={gold} strokeWidth="2.5" fill="none" />
      {leaflets.map((i) => {
        const t = (i + 1) / 23
        const x = 40 + (560 - 40) * t + Math.sin(t * Math.PI) * -30
        const y = 560 - (560 - 60) * t + Math.sin(t * Math.PI) * -10
        const len = 210 * Math.sin(Math.PI * (0.15 + t * 0.8))
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path
              d={`M0 0 C ${len * 0.3} ${-len * 0.05} ${len * 0.75} ${len * 0.05} ${len} ${len * 0.32} C ${len * 0.7} ${len * 0.18} ${len * 0.3} ${len * 0.12} 0 0 Z`}
              fill={color}
              transform="rotate(-8)"
              opacity={0.92}
            />
            <path
              d={`M0 0 C ${-len * 0.05} ${len * 0.3} ${len * 0.05} ${len * 0.75} ${-len * 0.32} ${len} C ${-len * 0.18} ${len * 0.7} ${-len * 0.12} ${len * 0.3} 0 0 Z`}
              fill={color}
              transform="rotate(188) scale(-1 1)"
              opacity={0.82}
            />
          </g>
        )
      })}
    </svg>
  )
}
