/** Gold divider: hairlines with a small diamond, echoing the logo's lines */
export default function Ornament({ className = '', width = 180 }) {
  return (
    <svg width={width} height="14" viewBox="0 0 180 14" className={`block ${className}`} aria-hidden="true">
      <line x1="0" y1="7" x2="72" y2="7" stroke="#C99A55" strokeWidth="0.8" />
      <line x1="108" y1="7" x2="180" y2="7" stroke="#C99A55" strokeWidth="0.8" />
      <path d="M90 1 L96 7 L90 13 L84 7 Z" fill="none" stroke="#C99A55" strokeWidth="0.8" />
      <circle cx="90" cy="7" r="1.6" fill="#C99A55" />
      <circle cx="78" cy="7" r="1" fill="#C99A55" />
      <circle cx="102" cy="7" r="1" fill="#C99A55" />
    </svg>
  )
}
