import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Lock, Check, Smartphone, CreditCard, Banknote, Truck, House, BriefcaseBusiness, MapPin, Building2, Mail, Phone,
  Gift, PenLine, ArrowLeft, ArrowRight, Leaf, ShieldCheck, Tag, ChevronDown, IdCard, UserRound, Wallet, Hash,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Ornament from '../components/ui/Ornament'
import SmartImage from '../components/ui/SmartImage'
import { useStore } from '../context/StoreContext'
import { formatPrice, productImage } from '../data/products'
import { FREE_SHIPPING_THRESHOLD } from '../data/site'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useMedia from '../hooks/useMedia'
import { EASE } from '../components/ui/Reveal'
import { scrollToTop } from '../lib/smoothScroll'

const STATES = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Maharashtra', 'Delhi', 'Gujarat', 'West Bengal', 'Other']

const ADDRESS_TYPES = [
  { id: 'home', label: 'Home', note: 'Deliver to your home address', icon: House },
  { id: 'work', label: 'Work', note: 'Deliver to your office or workplace', icon: BriefcaseBusiness },
]

const PAYMENTS = [
  { id: 'upi', label: 'UPI', note: 'Google Pay, PhonePe, Paytm & more', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', note: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', note: 'Available on orders under ₹3,000', icon: Banknote },
]

const EMPTY = { firstName: '', lastName: '', phone: '', email: '', address: '', apartment: '', city: '', state: 'Tamil Nadu', pin: '', note: '' }
const NOTE_MAX = 200

export default function Checkout() {
  useDocumentTitle('Checkout')
  const { cart, subtotal, shipping, total, clearCart } = useStore()
  const [step, setStep] = useState(1) // 1 = delivery, 2 = payment
  const [addrType, setAddrType] = useState('home')
  const [form, setForm] = useState(EMPTY)
  const [gift, setGift] = useState(false)
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('upi')
  const [order, setOrder] = useState(null)

  const set = (k) => (e) => {
    const v = k === 'pin' ? e.target.value.replace(/\D/g, '').slice(0, 6) : k === 'note' ? e.target.value.slice(0, NOTE_MAX) : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest)
  }

  const validateDelivery = () => {
    const e = {}
    ;['firstName', 'lastName', 'address', 'city'].forEach((k) => !form[k].trim() && (e[k] = 'Required'))
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a 10-digit mobile number'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!/^\d{6}$/.test(form.pin)) e.pin = 'Enter a 6-digit PIN code'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const go = (n) => {
    setStep(n)
    scrollToTop({ immediate: false })
  }

  const submit = (ev) => {
    ev.preventDefault()
    if (step === 1) {
      if (validateDelivery()) go(2)
      else setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    if (payment === 'cod' && total >= 3000) {
      setErrors({ payment: 'Cash on delivery is available for orders under ₹3,000' })
      return
    }
    // NOTE: real payment gateway integration (Razorpay / Stripe etc.) goes here
    // once credentials and a backend are available.
    setOrder({ id: `TPS-${Date.now().toString().slice(-6)}`, total, name: form.firstName, payment })
    clearCart()
    scrollToTop({ immediate: false })
  }

  if (order) return <Confirmation order={order} />

  if (cart.length === 0)
    return (
      <>
        <PageHero title="Checkout" crumbs={[['Checkout']]} />
        <div className="container-site py-20 text-center">
          <p className="font-serif text-3xl">Your bag is empty.</p>
          <Link to="/shop" className="btn btn-primary mt-8">Explore the collection</Link>
        </div>
      </>
    )

  /* called as a function (not a component) so inputs keep focus between renders */
  const field = ({ k, label, icon: Icon, optional, className = '', ...rest }) => (
    <label className={`block ${className}`}>
      <span className="co-label">
        {label} {optional ? <span className="text-cocoa-70 normal-case tracking-normal font-normal">(optional)</span> : <span className="text-gold">*</span>}
      </span>
      <span className="relative mt-2 block">
        <Icon size={17} strokeWidth={1.4} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cocoa-70" />
        <input value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} className={`co-field pl-11 ${errors[k] ? 'co-field-error' : ''}`} {...rest} />
      </span>
      {errors[k] && <span className="mt-1.5 block text-xs text-[#9b3b22]">{errors[k]}</span>}
    </label>
  )

  return (
    <div className="relative overflow-x-clip bg-[linear-gradient(180deg,#FBF6EC,#F6EEE0)]">
      {/* palm sketch along the bottom */}
      <img src="/images/heritage/sketch-strip.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full object-cover object-bottom opacity-40 mix-blend-multiply sm:h-36" />

      <div className="container-site relative pt-6 pb-36 sm:pt-8 sm:pb-44">
        <Stepper step={step} onStep={(n) => n < step && go(n)} />

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-16">
          {/* summary first on phones (collapsed), right column on desktop */}
          <div className="lg:order-2">
            <Summary subtotal={subtotal} shipping={shipping} total={total} lines={cart} />
          </div>

          <form onSubmit={submit} noValidate className="min-w-0 lg:order-1 lg:border-r lg:border-gold/15 lg:pr-12 xl:pr-16">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div key="delivery" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: EASE }}>
                  <Intro n="02" kicker="Delivery details" title="Where should we deliver your sweetness?" sub="Tell us where to send your Palm Story treats." />

                  <h2 className="mt-8 font-serif text-xl text-espresso sm:text-[22px]">Choose a delivery address</h2>
                  <div role="radiogroup" aria-label="Address type" className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {ADDRESS_TYPES.map((t) => (
                      <ChoiceCard key={t.id} on={addrType === t.id} onSelect={() => setAddrType(t.id)} icon={t.icon} label={t.label} note={t.note} name="addr" />
                    ))}
                  </div>

                  <h2 className="mt-10 font-serif text-xl text-espresso sm:text-[22px]">Delivery information</h2>
                  <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    {field({ k: 'firstName', label: 'First name', icon: UserRound, placeholder: 'Enter first name', autoComplete: 'given-name' })}
                    {field({ k: 'lastName', label: 'Last name', icon: IdCard, placeholder: 'Enter last name', autoComplete: 'family-name' })}
                    {field({ k: 'phone', label: 'Mobile number', icon: Phone, placeholder: '10-digit mobile number', type: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
                    {field({ k: 'email', label: 'Email', icon: Mail, placeholder: 'For your order updates', type: 'email', autoComplete: 'email' })}
                    {field({ k: 'address', label: 'Address', icon: MapPin, placeholder: 'House no, street name, area', autoComplete: 'address-line1' })}
                    {field({ k: 'apartment', label: 'Apartment, landmark', optional: true, icon: Building2, placeholder: 'e.g. Near bus stand, Lake view apartments', autoComplete: 'address-line2' })}
                  </div>
                  <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-3">
                    {field({ k: 'city', label: 'City', icon: Building2, placeholder: 'Enter your city', autoComplete: 'address-level2' })}
                    <label className="block">
                      <span className="co-label">State <span className="text-gold">*</span></span>
                      <span className="relative mt-2 block">
                        <select value={form.state} onChange={set('state')} autoComplete="address-level1" className="co-field cursor-pointer appearance-none pr-10 pl-4 font-medium">
                          {STATES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={17} strokeWidth={1.6} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-espresso" />
                      </span>
                    </label>
                    {field({ k: 'pin', label: 'PIN code', icon: Hash, placeholder: 'Enter 6-digit PIN', inputMode: 'numeric', autoComplete: 'postal-code' })}
                  </div>

                  <SpecialDelivery on={gift} setOn={setGift} note={form.note} onNote={set('note')} />

                  <div className="mt-10 flex flex-col-reverse items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/cart" className="group inline-flex items-center justify-center gap-2.5 font-serif text-lg text-espresso hover:text-cocoa">
                      <ArrowLeft size={18} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" /> Back to Bag
                    </Link>
                    <PrimaryButton>Continue to Payment</PrimaryButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="payment" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.45, ease: EASE }}>
                  <Intro n="03" kicker="Payment" title="How would you like to pay?" sub="Almost there — your sweets are ready to be packed." />

                  {/* delivery recap */}
                  <div className="mt-8 flex items-start gap-4 rounded-2xl border border-gold/30 bg-white/60 p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F3E6D0] text-cocoa"><Truck size={19} strokeWidth={1.4} /></span>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">Delivering to {addrType}</p>
                      <p className="mt-1 font-serif text-lg text-espresso">{form.firstName} {form.lastName}</p>
                      <p className="mt-0.5 break-words text-cocoa-70">
                        {[form.address, form.apartment, form.city, `${form.state} ${form.pin}`].filter(Boolean).join(', ')} · {form.phone}
                      </p>
                      {gift && <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold"><Gift size={13} /> Special delivery{form.note ? ' with a handwritten note' : ''}</p>}
                    </div>
                    <button type="button" onClick={() => go(1)} className="text-[11px] font-semibold tracking-[0.18em] text-cocoa uppercase underline underline-offset-4">Edit</button>
                  </div>

                  <h2 className="mt-10 font-serif text-xl text-espresso sm:text-[22px]">Choose a payment method</h2>
                  <div role="radiogroup" aria-label="Payment method" className="mt-4 grid gap-3">
                    {PAYMENTS.map((p) => (
                      <ChoiceCard key={p.id} on={payment === p.id} onSelect={() => { setPayment(p.id); setErrors({}) }} icon={p.icon} label={p.label} note={p.note} name="payment" />
                    ))}
                  </div>
                  {errors.payment && <p className="mt-3 text-xs text-[#9b3b22]">{errors.payment}</p>}
                  <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-cocoa-70">
                    <Lock size={13} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
                    Demo checkout — no payment is taken. A secure payment gateway will be connected once credentials and a backend are set up.
                  </p>

                  <div className="mt-10 flex flex-col-reverse items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => go(1)} className="group inline-flex items-center justify-center gap-2.5 font-serif text-lg text-espresso hover:text-cocoa">
                      <ArrowLeft size={18} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" /> Back to Delivery
                    </button>
                    <PrimaryButton icon={Lock}>Place order · {formatPrice(total)}</PrimaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ───────── pieces ───────── */

function Stepper({ step, onStep }) {
  const items = [
    { label: 'Your Bag', icon: Check, to: '/cart' },
    { label: 'Delivery', icon: MapPin, n: 1 },
    { label: 'Payment', icon: Wallet, n: 2 },
  ]
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gold/20 pb-6">
      <ol className="flex flex-1 items-center sm:max-w-[520px]">
        {items.map((it, i) => {
          const done = i === 0 || (it.n && it.n < step)
          const current = it.n === step
          const Icon = done ? Check : it.icon
          const dot = (
            <span className="flex flex-col items-center gap-2">
              <motion.span
                animate={{ scale: current ? 1.08 : 1 }}
                className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-500 sm:h-11 sm:w-11 ${
                  current ? 'bg-cocoa text-ivory shadow-[0_8px_20px_-8px_rgba(93,23,19,0.7)]' : done ? 'bg-gold text-ivory' : 'bg-[#EFE4D3] text-cocoa-70'
                }`}
              >
                <Icon size={17} strokeWidth={done ? 2.2 : 1.6} />
              </motion.span>
              <span className={`text-[12px] whitespace-nowrap sm:text-[15px] ${current ? 'font-semibold text-cocoa' : 'text-cocoa-70'}`}>{it.label}</span>
            </span>
          )
          return (
            <li key={it.label} className={`flex items-center ${i < items.length - 1 ? 'flex-1' : ''}`}>
              {it.to ? (
                <Link to={it.to} aria-label="Back to your bag" className="transition-opacity hover:opacity-80">{dot}</Link>
              ) : done ? (
                <button type="button" onClick={() => onStep(it.n)} className="transition-opacity hover:opacity-80">{dot}</button>
              ) : (
                <span aria-current={current ? 'step' : undefined}>{dot}</span>
              )}
              {i < items.length - 1 && (
                <span className="relative mx-2 mb-6 h-px flex-1 bg-gold/25 sm:mx-4">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-gold"
                    initial={false}
                    animate={{ width: i === 0 || step > i ? '100%' : '0%' }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <p className="hidden items-center gap-2.5 rounded-full border border-gold/30 bg-[#F6EBDA] px-5 py-2.5 text-sm text-espresso shadow-[0_6px_18px_-12px_rgba(93,23,19,0.5)] md:flex">
        <Lock size={15} strokeWidth={1.6} className="text-gold" /> Secure Checkout
      </p>
    </div>
  )
}

function Intro({ n, kicker, title, sub }) {
  return (
    <header>
      <p className="text-[11px] font-semibold tracking-[0.28em] text-espresso uppercase sm:text-xs">{n} / {kicker}</p>
      <h1 className="mt-3 font-serif text-[30px] leading-[1.12] text-cocoa sm:text-[40px] lg:text-[44px]">{title}</h1>
      <p className="mt-3 text-[15px] text-cocoa-70 sm:text-base">{sub}</p>
    </header>
  )
}

function ChoiceCard({ on, onSelect, icon: Icon, label, note, name }) {
  return (
    <label
      className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        on
          ? 'border-gold bg-[linear-gradient(135deg,#FBF1E2,#F4E4CB)] shadow-[0_12px_28px_-18px_rgba(93,23,19,0.55)]'
          : 'border-[#E6D8C3] bg-white/60 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white'
      }`}
    >
      <input type="radio" name={name} checked={on} onChange={onSelect} className="peer sr-only" />
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${on ? 'text-cocoa' : 'text-cocoa-70 group-hover:text-cocoa'}`}>
        <Icon size={26} strokeWidth={1.3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-xl text-espresso">{label}</span>
        <span className="mt-0.5 block text-[13px] text-cocoa-70">{note}</span>
      </span>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${on ? 'border-gold bg-gold text-ivory' : 'border-cocoa/30 bg-white'}`}>
        <AnimatePresence>
          {on && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
              <Check size={14} strokeWidth={2.6} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-gold/50 ring-offset-2 ring-offset-ivory peer-focus-visible:ring-2" />
    </label>
  )
}

function SpecialDelivery({ on, setOn, note, onNote }) {
  return (
    <div className="mt-10 overflow-hidden rounded-[22px] border border-gold/20 bg-[linear-gradient(135deg,#F7ECDC,#F2E2CA)] shadow-[0_18px_40px_-30px_rgba(93,23,19,0.6)]">
      <div className="flex flex-col sm:flex-row">
        <img src="/images/checkout/gift-tin.webp" alt="A gift tin tied with twine and a wax seal" className="h-40 w-full object-cover sm:h-auto sm:w-[34%] sm:max-w-[240px] sm:shrink-0" />
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Gift size={26} strokeWidth={1.3} className="mt-0.5 shrink-0 text-gold" />
            <div className="flex-1">
              <p className="font-serif text-[22px] leading-tight text-espresso sm:text-2xl">Make it a Special Delivery</p>
              <p className="mt-1.5 text-sm text-cocoa-70">Add a personal message and turn it into a memorable gift.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="Make it a special delivery"
              onClick={() => setOn(!on)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${on ? 'bg-gold' : 'bg-[#D9C8AE]'}`}
            >
              <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${on ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {on && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                <label className="relative mt-4 block rounded-xl border border-[#E6D8C3] bg-white/80 focus-within:border-gold">
                  <span className="sr-only">Gift message</span>
                  <PenLine size={16} strokeWidth={1.4} className="pointer-events-none absolute top-4 left-4 text-cocoa-70" />
                  <textarea
                    value={note}
                    onChange={onNote}
                    rows={3}
                    maxLength={NOTE_MAX}
                    placeholder="Write your gift message… (optional)"
                    className="block w-full resize-none rounded-xl bg-transparent py-3.5 pr-4 pb-7 pl-11 text-sm text-espresso placeholder:text-cocoa-70/70 focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-4 bottom-2.5 text-[11px] text-cocoa-70">{note.length} / {NOTE_MAX}</span>
                </label>
                <p className="mt-2 text-xs text-cocoa-70">We’ll handwrite it on a card and seal it with wax.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function PrimaryButton({ children, icon: Icon }) {
  return (
    <motion.button
      type="submit"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex h-[54px] items-center justify-center gap-3 overflow-hidden rounded-xl bg-cocoa px-8 font-medium text-ivory shadow-[0_14px_30px_-14px_rgba(93,23,19,0.9)] sm:min-w-[300px] sm:text-[17px]"
    >
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_20%,rgba(217,183,126,0.35)_50%,transparent_80%)] transition-transform duration-700 group-hover:translate-x-full" />
      {Icon && <Icon size={16} strokeWidth={1.6} className="relative" />}
      <span className="relative">{children}</span>
      {!Icon && <ArrowRight size={19} strokeWidth={1.6} className="relative transition-transform group-hover:translate-x-1" />}
    </motion.button>
  )
}

function Summary({ subtotal, shipping, total, lines }) {
  const { discount, promo } = useStore()
  const desktop = useMedia('(min-width: 1024px)')
  const [open, setOpen] = useState(false)
  const showItems = desktop || open
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD)
  const count = lines.reduce((n, l) => n + l.qty, 0)

  return (
    <aside className="overflow-hidden rounded-[22px] border border-gold/15 bg-[#FFFCF7] shadow-[0_24px_50px_-34px_rgba(43,18,13,0.55)] lg:sticky lg:top-24">
      {/* header photo */}
      <div className="relative h-[100px] bg-[linear-gradient(90deg,#2B140D,#4A2416)] sm:h-[150px]">
        <img src="/images/checkout/selection.webp" alt="" aria-hidden="true" className="absolute inset-y-0 right-0 h-full w-[62%] object-cover [mask-image:linear-gradient(90deg,transparent,#000_35%)]" />
        <div className="relative flex h-full flex-col justify-center px-6 sm:px-8">
          <p className="font-serif text-[24px] leading-[1.05] text-ivory italic sm:text-[28px]">Your<br />Sweet Selection</p>
          <span className="mt-3 h-[2px] w-14 bg-gold" />
        </div>
      </div>

      <div className={`px-5 sm:px-7 ${desktop ? "pt-2 pb-6" : open ? "pb-6" : ""}`}>
        {/* phones: collapsible item list */}
        {!desktop && (
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-sm text-espresso">
            <span>{open ? 'Hide' : 'Show'} order summary · {count} {count === 1 ? 'item' : 'items'}</span>
            <span className="flex items-center gap-2 font-serif text-lg">
              {formatPrice(total)}
              <ChevronDown size={17} strokeWidth={1.6} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </span>
          </button>
        )}
        <AnimatePresence initial={false}>
          {showItems && (
            <motion.div initial={desktop ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
            <ul className={desktop ? '' : 'border-t border-gold/15'}>
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 border-b border-gold/15 py-4">
                  <div className="relative shrink-0">
                    <SmartImage src={productImage(l.product)} alt="" art={l.product.art} position={l.product.focus} label={false} className="h-16 w-[74px] rounded-lg" />
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-cocoa text-[11px] font-semibold text-ivory ring-2 ring-[#FFFCF7]">{l.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[17px] leading-snug text-espresso sm:text-lg">{l.product.name}</p>
                    <p className="mt-0.5 text-xs text-cocoa-70 sm:text-[13px]">{l.variant.label} · {l.packaging.name}</p>
                  </div>
                  <span className="font-serif text-lg text-espresso">{formatPrice(l.total)}</span>
                </li>
              ))}
            </ul>

        <dl className="mt-5 space-y-2 font-serif text-[17px] text-espresso">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between text-gold"><dt>Code {promo}</dt><dd>−{formatPrice(discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd></div>
        </dl>

        <div className="mt-4 rounded-xl bg-[#F6EBDA] px-4 py-3.5">
          <p className="flex items-center gap-3 text-[13px] text-espresso">
            <Truck size={18} strokeWidth={1.4} className="shrink-0 text-gold" />
            {remaining > 0 ? (
              <span>Add <b className="font-semibold">{formatPrice(remaining)}</b> more for <span className="text-gold">complimentary shipping.</span></span>
            ) : (
              <span className="text-gold">You’ve unlocked complimentary shipping.</span>
            )}
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E6D6BD]">
            <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#8E5F25,#C0904A)]" initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }} />
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-gold/15 pt-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-espresso uppercase">Total</p>
            <p className="mt-2 text-[13px] text-cocoa-70">Inclusive of all taxes.</p>
          </div>
          <motion.p key={total} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-[32px] leading-none font-semibold text-espresso sm:text-4xl">{formatPrice(total)}</motion.p>
        </div>

        <Promo />

        <ul className="mt-6 grid grid-cols-3 divide-x divide-gold/20 border-t border-gold/15 pt-5 text-center text-[11px] leading-snug text-espresso sm:text-xs">
          <li className="px-1"><Leaf size={22} strokeWidth={1.3} className="mx-auto mb-1.5 text-cocoa" />100%<br />Pure Karupatti</li>
          <li className="px-1"><ShieldCheck size={22} strokeWidth={1.3} className="mx-auto mb-1.5 text-cocoa" />Secure<br />Payment</li>
          <li className="px-1"><Truck size={22} strokeWidth={1.3} className="mx-auto mb-1.5 text-cocoa" />Freshly Packed<br />&amp; Delivered</li>
        </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

function Promo() {
  const { promo, applyPromo, clearPromo } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  if (promo)
    return (
      <p className="mt-5 flex items-center justify-between rounded-xl border border-gold/40 bg-white px-4 py-3 text-sm text-espresso">
        <span className="flex items-center gap-2"><Tag size={15} className="text-gold" /> Code <b className="tracking-wider">{promo}</b> applied</span>
        <button onClick={clearPromo} className="text-[11px] tracking-[0.16em] text-cocoa-70 uppercase underline">Remove</button>
      </p>
    )
  return (
    <form className="mt-5" onSubmit={(e) => { e.preventDefault(); setError(applyPromo(code) ? '' : 'This code isn’t valid.') }}>
      <div className="flex gap-2.5">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Promo code</span>
          <Tag size={16} strokeWidth={1.4} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cocoa-70" />
          <input value={code} onChange={(e) => { setCode(e.target.value); setError('') }} placeholder="Promo code (e.g. PALM10)" className="co-field pl-11 uppercase placeholder:normal-case" />
        </label>
        <button className="h-[46px] shrink-0 rounded-[10px] bg-[linear-gradient(180deg,#B07F3C,#93652A)] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_-10px_rgba(147,101,42,0.9)] transition-transform hover:-translate-y-0.5">Apply</button>
      </div>
      {error && <p className="mt-1.5 text-xs text-[#9b3b22]">{error}</p>}
    </form>
  )
}

function Confirmation({ order }) {
  return (
    <section className="paper">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }} className="grid h-20 w-20 place-items-center rounded-full bg-cocoa text-ivory ring-8 ring-gold/20">
          <Check size={32} strokeWidth={1.3} />
        </motion.div>
        <p className="eyebrow mt-10">Order {order.id}</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">Thank you, {order.name}.</h1>
        <Ornament className="mx-auto my-6" />
        <p className="max-w-lg font-serif text-xl text-cocoa-70 italic">
          Your sweets are being prepared by hand. We’ll send a confirmation with tracking details shortly.
        </p>
        <p className="mt-6 text-sm text-cocoa-70">Order total: <b className="text-cocoa">{formatPrice(order.total)}</b> · {order.payment.toUpperCase()}</p>
        <p className="mt-2 text-xs text-cocoa-70">(Demo order — no payment was processed.)</p>
        <Link to="/shop" className="btn btn-primary mt-10">Continue shopping</Link>
      </div>
    </section>
  )
}
