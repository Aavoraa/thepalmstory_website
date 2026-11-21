import { useParams, Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import useDocumentTitle from '../hooks/useDocumentTitle'
import NotFound from './NotFound'

// Placeholder policy copy — have it reviewed before launch.
const TOPICS = {
  faqs: {
    title: 'FAQs',
    items: [
      ['What is Karupatti?', 'Karupatti is traditional palm jaggery, made by slowly boiling the sap of the palmyra palm until it sets.'],
      ['How long do the sweets stay fresh?', 'Most sweets are best within 15 days, savories within 30 days and cakes within 7 days. Each product page lists storage instructions.'],
      ['Do you ship across India?', 'Yes — we ship to most PIN codes in India. International shipping is coming soon.'],
      ['Can I add a gift message?', 'Yes. Add a gift note at checkout and we’ll handwrite it on a card.'],
    ],
  },
  shipping: {
    title: 'Shipping',
    items: [
      ['Dispatch', 'Orders are freshly packed and dispatched within 48 hours.'],
      ['Delivery time', '2–3 working days within Tamil Nadu, 3–6 working days elsewhere in India.'],
      ['Charges', 'Complimentary shipping on orders above ₹999; a flat ₹79 applies otherwise.'],
    ],
  },
  returns: {
    title: 'Returns',
    items: [
      ['Perishable goods', 'As our products are food items, we are unable to accept returns.'],
      ['Damaged or incorrect items', 'If your order arrives damaged or incorrect, write to us within 48 hours with photos and we will replace it or refund you.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    items: [
      ['What we collect', 'Only the details needed to process and deliver your order and, if you subscribe, to send our newsletter.'],
      ['How we use it', 'We never sell your data. Payment details are handled by our payment partner and are not stored by us.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    items: [
      ['Orders', 'All orders are subject to availability and confirmation of the order price.'],
      ['Pricing', 'Prices are listed in Indian Rupees and include applicable taxes.'],
    ],
  },
}

export default function Help() {
  const { topic } = useParams()
  const t = TOPICS[topic]
  useDocumentTitle(t?.title)
  if (!t) return <NotFound />
  return (
    <>
      <PageHero eyebrow="Customer care" title={t.title} crumbs={[['Help'], [t.title]]} />
      <section className="container-site grid gap-12 py-16 lg:grid-cols-[220px_1fr] lg:py-24">
        <nav aria-label="Help topics">
          <ul className="space-y-3 text-[11px] tracking-[0.2em] uppercase">
            {Object.entries(TOPICS).map(([k, v]) => (
              <li key={k}>
                <Link to={`/help/${k}`} aria-current={k === topic ? 'page' : undefined} className={`link-lux ${k === topic ? 'text-cocoa' : 'text-cocoa-70'}`}>{v.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <dl className="max-w-3xl divide-y divide-gold/30 border-y border-gold/30">
          {t.items.map(([q, a]) => (
            <div key={q} className="py-7">
              <dt className="font-serif text-2xl">{q}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-cocoa-70">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
