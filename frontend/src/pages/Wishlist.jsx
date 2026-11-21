import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ProductCard from '../components/ui/ProductCard'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Wishlist() {
  useDocumentTitle('Wishlist')
  const { wishlist } = useStore()
  const items = wishlist.map(getProduct).filter(Boolean)
  return (
    <>
      <PageHero title="Your Wishlist" eyebrow="Saved for later" crumbs={[['Wishlist']]} />
      <section className="container-site py-12 lg:py-16">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart size={34} strokeWidth={1} className="mx-auto text-gold" />
            <p className="mt-5 font-serif text-3xl">Nothing saved yet.</p>
            <p className="mt-3 text-cocoa-70">Tap the heart on any creation to keep it here.</p>
            <Link to="/shop" className="btn btn-primary mt-8">Explore the collection</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {items.map((p) => (
              <li key={p.slug}><ProductCard product={p} /></li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
