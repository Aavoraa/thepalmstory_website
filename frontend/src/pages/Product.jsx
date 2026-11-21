import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart, Truck, Leaf, Droplet, Flame, ShieldCheck, ShoppingBag, Zap, MapPin, Clock, ZoomIn, X, Wind, Layers, Sparkles,
} from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import QuantitySelector from '../components/ui/QuantitySelector'
import SectionHeading from '../components/ui/SectionHeading'
import ProductCard from '../components/ui/ProductCard'
import { Reveal } from '../components/ui/Reveal'
import { useStore } from '../context/StoreContext'
import { getProduct, getCategory, productImage, formatPrice, PRODUCTS, PACKAGING, SENSORY, getPackaging } from '../data/products'
import { CRAFT, FREE_SHIPPING_THRESHOLD } from '../data/site'
import useDocumentTitle from '../hooks/useDocumentTitle'
import NotFound from './NotFound'
import { EASE } from '../components/ui/Reveal'

const STORAGE = {
  sweets: 'Store in a cool, dry place in an airtight container, away from direct sunlight. Best enjoyed within 15 days of opening.',
  cakes: 'Keep refrigerated after opening. Bring to room temperature for 20 minutes before serving. Best within 7 days.',
  savories: 'Store in an airtight container at room temperature, away from moisture. Best within 30 days.',
  gifting: 'Keep the box closed in a cool, dry place. Refer to the card inside for each item’s best-before date.',
}
const FEATURES = [
  [Leaf, '100% Karupatti', 'Zero white sugar'],
  [Droplet, 'Pure ghee', 'Slow clarified'],
  [Flame, 'Bronze uruli', 'Wood-fire simmer'],
  [ShieldCheck, 'Clean recipe', 'No preservatives'],
]
const SENSE_ICONS = [Wind, Layers, Sparkles]

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  useDocumentTitle(product?.name, product?.short)
  if (!product) return <NotFound />
  return <ProductView key={slug} product={product} />
}

function ProductView({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const navigate = useNavigate()
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [pack, setPack] = useState(product.gift ? 'premium' : 'basic')
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [tab, setTab] = useState('description')
  const variant = product.variants.find((v) => v.id === variantId)
  const packaging = getPackaging(pack)
  const unit = variant.price + packaging.price
  const cat = getCategory(product.category)
  const saved = isWishlisted(product.slug)

  const gallery = [
    { src: productImage(product, 1), art: product.art, label: 'Hero profile', focus: product.focus },
    { src: productImage(product, 2), art: { ...product.art, tone: product.art.tone === 'ivory' ? 'beige' : 'ivory' }, label: 'Close-up' },
    { src: '/images/brand/craft-2.jpg', art: { kind: 'pot', tone: 'beige' }, label: 'In the making' },
    { src: '/images/products/heritage-sweet-tin.jpg', art: { kind: 'tin', tone: 'beige' }, label: 'Packaging' },
  ]
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && (p.category === product.category || p.gift)).slice(0, 4)
  const sensory = SENSORY[product.category] || SENSORY.sweets

  const add = (open = true) => addToCart(product.slug, variantId, qty, { open, pack })

  return (
    <>
      <div className="border-b border-beige bg-peach">
        <nav aria-label="Breadcrumb" className="container-site flex items-center justify-between gap-4 py-3">
          <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-[10.5px] text-cocoa-70">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li className="text-gold">/</li>
            <li><Link to={cat.slug === 'gifting' ? '/gifting' : `/collections/${cat.slug}`} className="hover:text-gold">{cat.name}</Link></li>
            <li className="text-gold">/</li>
            <li aria-current="page" className="truncate font-semibold text-espresso">{product.name}</li>
          </ol>
          <span className="chip hidden shrink-0 bg-white text-gold ring-1 ring-gold/30 sm:inline-block">Small batch · made to order</span>
        </nav>
      </div>

      <section className="bg-peach/60">
        <div className="container-site grid gap-8 py-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:py-12">
          {/* gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card relative overflow-hidden p-2">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  <SmartImage src={gallery[active].src} alt={product.name} art={gallery[active].art} position={gallery[active].focus} className="aspect-[4/3] rounded" eager />
                </motion.div>
              </AnimatePresence>
              {product.badge && (
                <div className="absolute top-5 left-5 flex flex-col items-start gap-1">
                  <span className="chip bg-espresso text-ivory">{product.badge}</span>
                  <span className="chip bg-ivory/90 text-espresso">{product.kicker}</span>
                </div>
              )}
              <button onClick={() => setZoom(true)} aria-label="Enlarge image" className="absolute right-5 bottom-5 grid h-9 w-9 place-items-center rounded-md bg-white/90 text-espresso shadow hover:bg-cocoa hover:text-ivory">
                <ZoomIn size={16} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Show ${g.label}`} aria-pressed={active === i} className="text-left">
                  <SmartImage src={g.src} alt="" art={g.art} position={g.focus} label={false} className={`aspect-[4/5] rounded transition-all ${active === i ? 'ring-2 ring-cocoa' : 'opacity-70 ring-1 ring-beige hover:opacity-100'}`} />
                  <span className="mt-1 block text-[9.5px] tracking-wide text-cocoa-70">{g.label}</span>
                </button>
              ))}
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FEATURES.map(([Icon, t, d]) => (
                <li key={t} className="flex flex-col items-center gap-1 rounded-md border border-gold/25 bg-white px-2 py-3 text-center">
                  <Icon size={16} strokeWidth={1.5} className="text-gold" />
                  <span className="text-[9.5px] font-semibold tracking-[0.1em] text-espresso uppercase">{t}</span>
                  <span className="text-[10px] text-cocoa-70">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* purchase card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }} className="card h-fit p-5 sm:p-7">
            <span className="chip inline-flex items-center gap-1.5 bg-peach text-gold ring-1 ring-gold/30">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {product.kicker}
            </span>
            <h1 className="mt-4 font-serif text-[1.9rem] leading-tight font-semibold text-espresso sm:text-[2.2rem]">{product.name}</h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-cocoa-70">{product.short}</p>

            <div className="mt-5 flex items-start justify-between gap-4 rounded-md bg-peach p-4">
              <div>
                <p className="font-serif text-3xl font-semibold text-espresso">{formatPrice(unit * qty)}</p>
                <p className="mt-1 text-[11px] text-cocoa-70">Inclusive of all taxes · fresh batch dispatched in 48h</p>
              </div>
              <p className="flex items-center gap-1.5 text-right text-[9.5px] font-semibold tracking-[0.12em] text-gold uppercase">
                <Truck size={14} /> Free over<br />{formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            </div>

            <fieldset className="mt-6">
              <legend className="flex w-full justify-between text-[10px] font-semibold tracking-[0.16em] text-espresso uppercase">
                {product.variants.length > 1 ? 'Select net quantity' : 'Format'}
              </legend>
              <div className={`mt-3 grid gap-2 ${product.variants.length > 2 ? 'grid-cols-3' : product.variants.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={v.id === variantId}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-[4px] border px-3 py-2.5 text-left transition-colors ${v.id === variantId ? 'border-cocoa bg-cocoa text-ivory' : 'border-beige bg-white hover:border-cocoa/50'}`}
                  >
                    <span className="block font-serif text-base font-semibold">{v.label}</span>
                    {v.note && <span className={`block text-[10.5px] ${v.id === variantId ? 'text-beige' : 'text-cocoa-70'}`}>{v.note}</span>}
                    <span className={`block text-[11px] font-semibold ${v.id === variantId ? 'text-gold-soft' : 'text-gold'}`}>{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-[10px] font-semibold tracking-[0.16em] text-espresso uppercase">Select presentation</legend>
              <div className="mt-3 space-y-2" role="radiogroup" aria-label="Presentation">
                {PACKAGING.map((p) => {
                  const on = pack === p.id
                  return (
                    <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-[4px] border p-3.5 transition-colors ${on ? 'border-gold bg-peach' : 'border-beige bg-white hover:border-gold/50'}`}>
                      <input type="radio" name="pack" checked={on} onChange={() => setPack(p.id)} className="sr-only" />
                      <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${on ? 'border-cocoa' : 'border-cocoa/40'}`}>
                        {on && <span className="h-2 w-2 rounded-full bg-cocoa" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[13px] font-semibold text-espresso">{p.name}</span>
                        <span className="block text-[11px] text-cocoa-70">{p.note}</span>
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.1em] text-gold uppercase">{p.price ? `+${formatPrice(p.price)}` : p.tag}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-6 flex items-center gap-2.5">
              <QuantitySelector value={qty} onChange={setQty} />
              <button onClick={() => add(true)} className="btn btn-primary h-12 flex-1 !px-3">
                <ShoppingBag size={14} /> Add to bag — {formatPrice(unit * qty)}
              </button>
              <button
                onClick={() => toggleWishlist(product.slug)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-[3px] border border-beige bg-white text-cocoa transition-colors hover:border-cocoa"
              >
                <Heart size={17} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button
              onClick={() => {
                add(false)
                navigate('/checkout')
              }}
              className="btn btn-gold mt-2.5 w-full"
            >
              <Zap size={14} /> Buy now
            </button>

            <PincodeCheck />
          </motion.div>
        </div>
      </section>

      {/* sensory */}
      <section className="py-20">
        <div className="container-site">
          <SectionHeading eyebrow="Artisanal tasting notes" title="The Sensory Experience" text="What to expect in every bite." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sensory.map(([t, d, tags], i) => {
              const Icon = SENSE_ICONS[i]
              return (
                <Reveal key={t} delay={i * 0.1}>
                  <div className="card h-full p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-peach text-gold"><Icon size={18} strokeWidth={1.5} /></span>
                    <h3 className="mt-5 font-serif text-xl font-semibold">{t}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-cocoa-70">{d}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags.map((x) => <span key={x} className="rounded-[3px] bg-peach px-2.5 py-1 text-[10px] font-semibold text-cocoa">{x}</span>)}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* tabs */}
      <section className="container-site pb-20">
        <div className="card overflow-hidden">
          <div className="no-scrollbar flex overflow-x-auto border-b border-beige bg-peach/60" role="tablist">
            {[['description', 'The making'], ['ingredients', 'Ingredients'], ['storage', 'Storage & care'], ['shipping', 'Shipping']].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`relative flex-1 shrink-0 px-5 py-4 text-[10.5px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase ${tab === id ? 'text-espresso' : 'text-cocoa-70 hover:text-espresso'}`}>
                {label}
                {tab === id && <motion.span layoutId="pd-tab" className="absolute inset-x-4 bottom-0 h-[2px] bg-gold" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="p-6 text-[14px] leading-relaxed text-cocoa-70 sm:p-9">
              {tab === 'description' && (
                <>
                  <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-espresso"><Clock size={17} className="text-gold" /> How it’s made</h3>
                  <p className="mt-3 max-w-3xl">{product.description}</p>
                </>
              )}
              {tab === 'ingredients' && (
                <>
                  <ul className="flex flex-wrap gap-2">
                    {product.ingredients.map((i) => <li key={i} className="rounded-[3px] border border-gold/30 bg-peach px-3 py-1.5 text-xs text-espresso">{i}</li>)}
                  </ul>
                  <p className="mt-4 text-xs">Prepared in a kitchen that handles nuts, dairy, gluten and sesame.</p>
                </>
              )}
              {tab === 'storage' && <p className="max-w-3xl">{STORAGE[product.category]}</p>}
              {tab === 'shipping' && <p className="max-w-3xl">Freshly packed and dispatched within 48 hours in our keepsake packaging. Complimentary shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}.</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* craft */}
      <section className="bg-peach py-20">
        <div className="container-site">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading align="left" eyebrow="Artisanal lineage" title="How We Craft Every Batch" />
            <p className="max-w-sm text-[13px] text-cocoa-70">A slow morning ritual in our kitchen — from fresh palm sap to the final pour of ghee.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CRAFT.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div className="card group h-full overflow-hidden">
                  <div className="relative overflow-hidden">
                    <SmartImage src={c.image} alt={c.title} art={c.art} className="aspect-[16/9]" imgClassName="transition-transform duration-[1200ms] group-hover:scale-105" />
                    <span className="chip absolute top-3 left-3 bg-espresso/85 text-ivory">{c.time}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold">{c.title}</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-cocoa-70">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* pairings */}
      <section className="container-site py-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Curated pairings" title="Complete Your Heritage Flight" />
          <Link to="/shop" className="link-lux hidden shrink-0 text-[11px] font-semibold tracking-[0.16em] text-gold uppercase sm:inline">View all →</Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => <li key={p.slug}><ProductCard product={p} compact /></li>)}
        </ul>
      </section>

      <AnimatePresence>
        {zoom && (
          <motion.div data-lenis-prevent className="fixed inset-0 z-[90] grid place-items-center bg-espresso/85 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)}>
            <button aria-label="Close" className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-ivory text-espresso"><X size={18} /></button>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <SmartImage src={gallery[active].src} alt={product.name} art={gallery[active].art} position={gallery[active].focus} className="aspect-[4/3] rounded-md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function PincodeCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const check = (e) => {
    e.preventDefault()
    if (!/^[1-9]\d{5}$/.test(pin)) return setResult({ ok: false, text: 'Enter a valid 6-digit PIN code.' })
    const tn = pin.startsWith('6')
    setResult({ ok: true, text: tn ? 'Delivers in 2–3 working days across Tamil Nadu.' : 'Delivers in 3–6 working days.' })
  }
  return (
    <form onSubmit={check} className="mt-6 border-t border-beige pt-5">
      <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-espresso uppercase"><MapPin size={13} className="text-gold" /> Check delivery time</p>
      <div className="mt-2.5 flex gap-2">
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          placeholder="Enter 6-digit PIN code"
          aria-label="Delivery PIN code"
          className="h-10 min-w-0 flex-1 rounded-[3px] border border-beige bg-white px-3 text-xs focus:border-gold focus:outline-none"
        />
        <button className="rounded-[3px] bg-espresso px-4 text-[10px] font-semibold tracking-[0.14em] text-ivory uppercase hover:bg-cocoa">Check</button>
      </div>
      {result && <p className={`mt-2 text-[11.5px] ${result.ok ? 'text-cocoa' : 'text-[#9b3b22]'}`}>{result.text}</p>}
    </form>
  )
}
