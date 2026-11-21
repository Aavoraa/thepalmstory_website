import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedCarousel from '../components/home/FeaturedCarousel'
import StoryCards from '../components/home/StoryCards'
import GiftingBanner from '../components/home/GiftingBanner'
import AboutSection from '../components/home/AboutSection'
import BulkOrders from '../components/home/BulkOrders'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle(null)
  return (
    <>
      <h1 className="sr-only">The Palm Story — Traditional South Indian Karupatti Sweets</h1>
      <Hero />
      <StoryCards />
      <Categories />
      <FeaturedCarousel />
      <GiftingBanner />
      <AboutSection />
      <BulkOrders />
    </>
  )
}
