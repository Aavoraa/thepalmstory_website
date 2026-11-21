import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import useDocumentTitle from '../hooks/useDocumentTitle'

// Links like /contact?topic=bulk-sweets pre-fill the form
const TOPICS = ['Order enquiry', 'Bulk order — Sweets & Savories', 'Bulk order — Karupatti', 'Gifting & corporate', 'Wholesale', 'Feedback', 'Other']
const PRESETS = {
  'bulk-sweets': {
    topic: 'Bulk order — Sweets & Savories',
    message: 'Occasion / event:\nDate needed by:\nSweets and savories wanted (and approx. quantity):\nNumber of boxes / guests:\nPackaging (tin, box, basket):\nDelivery city:',
  },
  'bulk-karupatti': {
    topic: 'Bulk order — Karupatti',
    message: 'Business name (if any):\nBlocks or powder:\nQuantity (kg):\nOne-time or regular supply:\nDelivery city:',
  },
}

// Placeholder contact details — replace with the brand's real details.
const DETAILS = [
  [Mail, 'Email', 'hello@thepalmstory.in'],
  [Phone, 'Phone / WhatsApp', '+91 00000 00000'],
  [MapPin, 'Kitchen', 'Tamil Nadu, India'],
  [Clock, 'Hours', 'Mon – Sat · 10am – 7pm IST'],
]

export default function Contact() {
  useDocumentTitle('Contact Us')
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order enquiry', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const [params] = useSearchParams()
  const preset = PRESETS[params.get('topic')]
  useEffect(() => {
    if (preset) setForm((f) => ({ ...f, topic: preset.topic, message: f.message || preset.message }))
  }, [preset])

  return (
    <>
      <PageHero eyebrow="We’d love to hear from you" title="Contact Us" text="Questions about an order, gifting or bulk enquiries — write to us and we’ll respond within a working day." crumbs={[['Contact']]} />
      <section className="container-site grid gap-16 py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:py-24">
        <div>
          <ul className="space-y-8">
            {DETAILS.map(([Icon, l, v], i) => (
              <Reveal key={l} delay={i * 0.08}>
                <li className="flex gap-5 border-b border-gold/30 pb-6">
                  <Icon size={20} strokeWidth={1.2} className="mt-1 text-gold" />
                  <div>
                    <p className="field-label">{l}</p>
                    <p className="mt-1 font-serif text-2xl">{v}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-xs text-cocoa-70">Contact details shown are placeholders.</p>
        </div>

        <Reveal>
          <div className="bg-cream p-8 ring-1 ring-gold/30 sm:p-12">
            {sent ? (
              <div className="py-16 text-center">
                <p className="eyebrow">Message received</p>
                <p className="mt-4 font-serif text-4xl">Thank you, {form.name.split(' ')[0]}.</p>
                <p className="mt-3 text-cocoa-70">We’ll be in touch shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="grid gap-7 sm:grid-cols-2"
              >
                <h2 className="font-serif text-3xl sm:col-span-2">Send a message</h2>
                <label className="block">
                  <span className="field-label">Name</span>
                  <input required value={form.name} onChange={set('name')} className="field" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="field-label">Email</span>
                  <input required type="email" value={form.email} onChange={set('email')} className="field" autoComplete="email" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="field-label">Topic</span>
                  <select value={form.topic} onChange={set('topic')} className="field cursor-pointer">
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="field-label">Message</span>
                  <textarea required rows={5} value={form.message} onChange={set('message')} className="field resize-none" />
                </label>
                <div className="sm:col-span-2">
                  <button className="btn btn-primary">Send message</button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </>
  )
}
