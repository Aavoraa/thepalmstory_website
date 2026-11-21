import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SmartImage from '../components/ui/SmartImage'
import Ornament from '../components/ui/Ornament'
import SectionHeading from '../components/ui/SectionHeading'
import { Reveal, TextReveal } from '../components/ui/Reveal'
import { PILLARS } from '../components/home/AboutSection'
import useDocumentTitle from '../hooks/useDocumentTitle'

const VALUES = [
  ['Karupatti first', 'Palm jaggery is the heart of our kitchen — chosen for its deep, rounded sweetness and its place in Tamil food heritage.'],
  ['Small batches', 'We cook in quantities small enough to taste and adjust every batch, so each tin is as good as the first.'],
  ['Honest labels', 'Every ingredient is listed plainly. No artificial colours, no flavourings, no shortcuts.'],
  ['Made to be shared', 'From a weekday tea to a wedding, our sweets are made to be passed around the table.'],
]

export default function About() {
  useDocumentTitle('About Us', 'The Palm Story celebrates South Indian sweet-making heritage with palm jaggery and traditional recipes.')
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={['A Story of Heritage.', 'A Taste of Tradition.']}
        text="At THE PALM STORY, we celebrate the timeless sweetness of South Indian heritage."
        crumbs={[['About Us']]}
      />

      <section className="container-site grid items-center gap-14 py-20 lg:grid-cols-2 lg:gap-24 lg:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-t-[999px] ring-1 ring-gold/40">
            <SmartImage src="/images/brand/about.jpg" alt="Inside The Palm Story kitchen" art={{ kind: 'pot', tone: 'beige' }} className="aspect-[4/5]" />
          </div>
        </Reveal>
        <div>
          <p className="eyebrow">Who we are</p>
          <TextReveal lines={['Sweetness, the', 'way it used to be']} className="display mt-5 text-4xl sm:text-5xl" />
          <Ornament className="my-7" />
          <div className="space-y-5 text-[15px] leading-[1.9] text-cocoa-70">
            <p>
              THE PALM STORY began with a simple longing — for the sweets of childhood visits to grandmother’s home, where laddus were rolled by hand and halwa was stirred until the kitchen smelled of caramel and ghee.
            </p>
            <p>
              Inspired by the natural goodness of palm jaggery and traditional recipes, we bring authentic flavours to modern celebrations — presented with the care and elegance they deserve.
            </p>
            <p>Every tin we pack carries a little of that heritage: the palm, the patience and the people who keep these recipes alive.</p>
          </div>
          <Link to="/our-story" className="btn btn-outline mt-10">Read the Karupatti story <ArrowRight size={14} strokeWidth={1.4} /></Link>
        </div>
      </section>

      <section className="bg-cocoa py-20 text-ivory lg:py-28">
        <div className="container-site">
          <SectionHeading light eyebrow="What guides us" title="Our Philosophy" />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1} className="border-t border-gold/50 pt-6">
                <p className="font-serif text-2xl text-gold">{p.n}</p>
                <h3 className="mt-2 font-serif text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-beige/80">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-20 lg:py-28">
        <SectionHeading eyebrow="Our promise" title="What You Can Expect" />
        <div className="mt-14 grid gap-px bg-gold/40 sm:grid-cols-2">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06} className="bg-ivory">
              <div className="flex gap-6 p-8 sm:p-10">
                <span className="font-serif text-4xl text-gold">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa-70">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/shop" className="btn btn-primary">Shop the collection <ArrowRight size={14} strokeWidth={1.4} /></Link>
        </div>
      </section>
    </>
  )
}
