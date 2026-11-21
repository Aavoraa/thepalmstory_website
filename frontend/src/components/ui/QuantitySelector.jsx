import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 20, size = 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  return (
    <div className={`inline-flex ${h} items-center border border-cocoa/25`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-full w-10 place-items-center text-cocoa transition-colors hover:bg-beige/60 disabled:opacity-30"
      >
        <Minus size={14} strokeWidth={1.4} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-full w-10 place-items-center text-cocoa transition-colors hover:bg-beige/60 disabled:opacity-30"
      >
        <Plus size={14} strokeWidth={1.4} />
      </button>
    </div>
  )
}
