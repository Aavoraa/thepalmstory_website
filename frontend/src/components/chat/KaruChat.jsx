import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, ShoppingBag, ArrowUpRight, RotateCcw } from 'lucide-react'
import { reply, greeting } from '../../lib/karuBot'
import { useStore } from '../../context/StoreContext'
import { formatPrice, fromPrice, productImage } from '../../data/products'

const MASCOT = (mood) => `/images/mascot/${mood}.webp`
const STORE_KEY = 'tps.karu'
const EASE = [0.22, 1, 0.36, 1]

const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY)) || null
  } catch {
    return null
  }
}

/**
 * Karu — the Karupatti mascot, living in the bottom-right corner.
 * A floating launcher (bobs, winks on hover, says hello once per session)
 * opens a chat panel. Karu's face changes with every reply.
 */
export default function KaruChat() {
  const { addToCart } = useStore()
  const saved = load()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => saved?.messages || [{ from: 'bot', ...greeting() }])
  const [mood, setMood] = useState('happy')
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [hint, setHint] = useState(false)
  const [hover, setHover] = useState(false)
  const [fresh, setFresh] = useState(!saved) // unread dot until the first chat
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // persist this session's conversation
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages: messages.slice(-40) }))
    } catch {
      /* storage blocked */
    }
  }, [messages])

  // friendly hello bubble, once per session, after the page settles
  useEffect(() => {
    let shown = false
    try {
      shown = sessionStorage.getItem('tps.karuHint') === '1'
    } catch {
      /* ignore */
    }
    if (shown) return
    const t = setTimeout(() => {
      setHint(true)
      try {
        sessionStorage.setItem('tps.karuHint', '1')
      } catch {
        /* ignore */
      }
    }, 9000)
    const h = setTimeout(() => setHint(false), 17000)
    return () => {
      clearTimeout(t)
      clearTimeout(h)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setHint(false)
    setFresh(false)
    setTimeout(() => inputRef.current?.focus(), 350)
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  const send = (raw) => {
    const q = raw.trim()
    if (!q || typing) return
    setMessages((m) => [...m, { from: 'user', text: q }])
    setText('')
    setTyping(true)
    setMood('thinking')
    const r = reply(q)
    setTimeout(() => {
      setTyping(false)
      setMood(r.mood || 'happy')
      setMessages((m) => [...m, { from: 'bot', ...r }])
    }, 600 + Math.min(900, r.text.length * 8))
  }

  const reset = () => {
    setMessages([{ from: 'bot', ...greeting() }])
    setMood('wink')
  }

  const add = (p) => {
    addToCart(p.slug, p.variants[0].id, 1, { open: false })
    setMood('excited')
    setMessages((m) => [...m, { from: 'bot', text: `Added ${p.name} to your bag! Anything else?`, mood: 'excited', chips: ['Gift ideas', 'Shipping'] }])
  }

  const lastBot = [...messages].reverse().find((m) => m.from === 'bot')

  return (
    <>
      {/* ── launcher ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="fixed right-3 bottom-3 z-[65] flex items-end gap-2 sm:right-5 sm:bottom-5"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <AnimatePresence>
              {hint && (
                <motion.button
                  type="button"
                  onClick={() => setOpen(true)}
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="relative mb-12 max-w-[200px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-[13px] leading-snug text-espresso shadow-[0_14px_30px_-12px_rgba(43,18,13,0.45)] ring-1 ring-gold/25"
                >
                  <span className="block font-serif text-[15px] font-semibold text-cocoa">Vanakkam!</span>
                  I’m Karu. Need a sweet suggestion?
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Dismiss"
                    onClick={(e) => {
                      e.stopPropagation()
                      setHint(false)
                    }}
                    className="absolute -top-2 -left-2 grid h-5 w-5 place-items-center rounded-full bg-espresso text-ivory"
                  >
                    <X size={11} />
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              aria-label="Chat with Karu, our helper"
              whileTap={{ scale: 0.88, rotate: -6 }}
              className="relative grid h-[84px] w-[84px] place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#FFF8EC,#F3E2C8)] shadow-[0_16px_34px_-12px_rgba(43,18,13,0.55)] ring-2 ring-gold/50 sm:h-24 sm:w-24"
            >
              {/* soft pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-gold/60"
                animate={{ scale: [1, 1.25], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.img
                src={MASCOT(hover ? 'wink' : 'front')}
                alt=""
                className="relative -mt-3 h-[96px] w-auto drop-shadow-[0_6px_6px_rgba(43,18,13,0.3)] sm:h-[108px]"
                animate={hover ? { rotate: [0, -8, 6, 0], y: -4 } : { y: [0, -5, 0] }}
                transition={hover ? { duration: 0.6 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {fresh && <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-cocoa px-1 text-[10px] font-semibold text-ivory ring-2 ring-ivory">1</span>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Chat with Karu"
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-x-2 bottom-2 z-[65] flex h-[78svh] flex-col overflow-hidden rounded-[26px] bg-[#FFFBF5] shadow-[0_30px_80px_-30px_rgba(43,18,13,0.6)] ring-1 ring-gold/25 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[600px] sm:max-h-[calc(100svh-40px)] sm:w-[390px]"
          >
            {/* header */}
            <header className="relative flex items-center gap-3 bg-[linear-gradient(120deg,#4A120E,#6A2A14_60%,#5D1713)] px-4 pt-3 pb-3 text-ivory">
              <div className="relative h-14 w-14 shrink-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,#FFF8EC,#E9D3B0)] ring-2 ring-gold/60">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={typing ? 'thinking' : mood}
                    src={MASCOT(typing ? 'thinking' : mood)}
                    alt={`Karu looking ${typing ? 'thoughtful' : mood}`}
                    className="absolute -top-2 left-1/2 h-16 w-auto max-w-none -translate-x-1/2"
                    initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  />
                </AnimatePresence>
                <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-[#6E8C34] ring-2 ring-[#5D1713]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg leading-tight font-semibold">Karu</p>
                <p className="text-[11px] text-gold-soft">{typing ? 'Karu is thinking…' : 'Your Karupatti guide · here to help'}</p>
              </div>
              <button onClick={reset} aria-label="Start a new chat" className="grid h-8 w-8 place-items-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-ivory">
                <RotateCcw size={15} />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-ivory/80 hover:bg-white/10 hover:text-ivory">
                <X size={18} />
              </button>
            </header>

            {/* messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) => (
                <Message key={i} m={m} onChip={send} onAdd={add} onNavigate={() => setOpen(false)} last={m === lastBot} />
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 pl-1">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-2 w-2 rounded-full bg-gold" animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(text)
              }}
              className="flex items-center gap-2 border-t border-gold/20 bg-white/70 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask Karu about sweets, gifts, delivery…"
                aria-label="Message Karu"
                className="min-w-0 flex-1 rounded-full bg-peach px-4 py-2.5 text-sm text-espresso placeholder:text-cocoa-70/70 focus:ring-2 focus:ring-gold/40 focus:outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={!text.trim() || typing}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-cocoa to-espresso text-ivory shadow-md transition-opacity disabled:opacity-40"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

function Message({ m, onChip, onAdd, onNavigate, last }) {
  if (m.from === 'user')
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-b from-cocoa to-espresso px-4 py-2.5 text-[13.5px] leading-snug text-ivory">{m.text}</p>
      </motion.div>
    )

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="space-y-2">
      <div className="flex items-end gap-2">
        <img src={MASCOT(m.mood || 'happy')} alt="" className="h-9 w-auto shrink-0" />
        <p className="max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-[13.5px] leading-snug text-espresso shadow-sm ring-1 ring-gold/15">{m.text}</p>
      </div>

      {m.products?.length > 0 && (
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 pl-[3.25rem]">
          {m.products.map((p) => (
            <div key={p.slug} className="w-[150px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gold/15">
              <Link to={`/product/${p.slug}`} onClick={onNavigate} className="block">
                <img src={productImage(p)} alt={p.name} style={p.focus ? { objectPosition: p.focus } : undefined} className="aspect-[4/3] w-full bg-peach object-cover" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
              </Link>
              <div className="p-2.5">
                <p className="line-clamp-2 font-serif text-[13px] leading-tight font-semibold text-espresso">{p.name}</p>
                <p className="mt-1 text-[11px] text-cocoa-70">from {formatPrice(fromPrice(p))}</p>
                <div className="mt-2 flex gap-1.5">
                  <button onClick={() => onAdd(p)} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-cocoa py-1.5 text-[10px] font-semibold tracking-wide text-ivory uppercase hover:bg-espresso">
                    <ShoppingBag size={11} /> Add
                  </button>
                  <Link to={`/product/${p.slug}`} onClick={onNavigate} aria-label={`View ${p.name}`} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-cocoa/30 hover:bg-peach">
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {m.links?.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-11">
          {m.links.map((l) => (
            <Link key={l.to + l.label} to={l.to} onClick={onNavigate} className="inline-flex items-center gap-1 rounded-full bg-peach px-3 py-1.5 text-[12px] font-medium text-cocoa ring-1 ring-gold/30 hover:bg-cocoa hover:text-ivory">
              {l.label} <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      )}

      {last && m.chips?.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-11">
          {m.chips.map((c, i) => (
            <motion.button
              key={c}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onChip(c)}
              className="rounded-full border border-gold/50 bg-white px-3 py-1.5 text-[12px] text-espresso transition-colors hover:border-cocoa hover:bg-cocoa hover:text-ivory"
            >
              {c}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
