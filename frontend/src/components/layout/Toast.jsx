import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../context/StoreContext'
import { EASE } from '../ui/Reveal'

export default function Toast() {
  const { toast, setToast } = useStore()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto flex items-center gap-5 bg-espresso px-5 py-3.5 text-sm text-ivory shadow-2xl ring-1 ring-gold/40"
          >
            <span className="text-gold">✦</span>
            <span>{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick()
                  setToast(null)
                }}
                className="text-[10px] tracking-[0.22em] text-gold uppercase underline-offset-4 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
