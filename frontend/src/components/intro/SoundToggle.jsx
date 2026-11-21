import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

/** Small, discreet sound switch. Sound is off until the visitor turns it on. */
export default function SoundToggle({ on, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? 'Turn intro sound off' : 'Turn intro sound on'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="group flex items-center gap-2 rounded-full bg-espresso/70 px-3.5 py-2 text-[10px] font-medium tracking-[0.22em] text-ivory uppercase ring-1 ring-ivory/30 backdrop-blur-md transition-colors hover:bg-espresso/60"
    >
      {on ? <Volume2 size={14} strokeWidth={1.6} /> : <VolumeX size={14} strokeWidth={1.6} />}
      <span className="hidden sm:inline">{on ? 'Sound on' : 'Sound off'}</span>
      {/* tiny equaliser while playing */}
      {on && (
        <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full bg-gold-soft"
              animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      )}
    </motion.button>
  )
}
