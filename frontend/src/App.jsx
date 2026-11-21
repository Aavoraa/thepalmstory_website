import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/layout/CartDrawer'
import SearchOverlay from './components/layout/SearchOverlay'
import Toast from './components/layout/Toast'
import BrandIntro from './components/intro/BrandIntro'
import Loader from './components/intro/Loader'
import PageTransition from './components/layout/PageTransition'
import KaruChat from './components/chat/KaruChat'
import { EASE } from './components/ui/Reveal'
import { useStore } from './context/StoreContext'
import { startSmoothScroll, stopSmoothScroll, scrollToTop, lockScroll } from './lib/smoothScroll'

import Home from './pages/Home'
const Shop = lazy(() => import('./pages/Shop'))
const Gifting = lazy(() => import('./pages/Gifting'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const About = lazy(() => import('./pages/About'))
const OurStory = lazy(() => import('./pages/OurStory'))
const Contact = lazy(() => import('./pages/Contact'))
const Account = lazy(() => import('./pages/Account'))
const Help = lazy(() => import('./pages/Help'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Page({ children }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <Suspense fallback={<div className="min-h-[70vh]" />}>{children}</Suspense>
    </motion.main>
  )
}

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  if (q.has('nointro')) return false
  let seen = false
  try {
    seen = sessionStorage.getItem('tps.introSeen') === '1'
  } catch {
    /* storage blocked */
  }
  const play =
    q.has('intro') ||
    (window.location.pathname === '/' && !seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  if (play) {
    try {
      sessionStorage.setItem('tps.introSeen', '1')
    } catch {
      /* storage blocked */
    }
    document.documentElement.dataset.intro = 'playing' // header + page fade in after the intro
  }
  return play
}

// Minimal loading screen on every full page load (skipped with ?nointro / ?noloader, or reduced motion)
function shouldShowLoader() {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  if (q.has('nointro') || q.has('noloader')) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  document.documentElement.dataset.intro = 'playing' // keep header + page hidden behind it
  return true
}

// decided once per page load (outside React so StrictMode double-renders can't change it)
const INTRO_ON_LOAD = shouldPlayIntro()
const LOADER_ON_LOAD = shouldShowLoader()

export default function App() {
  const location = useLocation()
  const { cartOpen, searchOpen } = useStore()
  // Brand intro: homepage only, once per browser session; never delays deep links.
  // ?nointro skips it, ?intro forces it (handy when testing).
  const [loading, setLoading] = useState(INTRO_ON_LOAD)
  // loader first; the brand intro (home, first visit) mounts underneath as the loader lifts away
  const [booting, setBooting] = useState(LOADER_ON_LOAD)
  const [bootLifting, setBootLifting] = useState(!LOADER_ON_LOAD)

  useEffect(() => {
    startSmoothScroll()
    return () => stopSmoothScroll()
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [location.pathname])

  // freeze the page behind open drawers/overlays
  useEffect(() => {
    lockScroll(booting || loading || cartOpen || searchOpen)
    document.documentElement.style.overflow = booting || loading ? 'hidden' : ''
  }, [booting, loading, cartOpen, searchOpen])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-cocoa focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/shop" element={<Page><Shop /></Page>} />
          <Route path="/collections/:category" element={<Page><Shop /></Page>} />
          <Route path="/gifting" element={<Page><Gifting /></Page>} />
          <Route path="/product/:slug" element={<Page><Product /></Page>} />
          <Route path="/cart" element={<Page><Cart /></Page>} />
          <Route path="/wishlist" element={<Page><Wishlist /></Page>} />
          <Route path="/checkout" element={<Page><Checkout /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/our-story" element={<Page><OurStory /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/account" element={<Page><Account /></Page>} />
          <Route path="/help/:topic" element={<Page><Help /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toast />
      <PageTransition />
      <KaruChat />
      {booting && (
        <Loader
          onExitStart={() => {
            setBootLifting(true)
            if (!INTRO_ON_LOAD) delete document.documentElement.dataset.intro
          }}
          onDone={() => setBooting(false)}
        />
      )}
      {loading && bootLifting && (
        <BrandIntro
          onExitStart={() => delete document.documentElement.dataset.intro}
          onDone={() => setLoading(false)}
        />
      )}
    </>
  )
}
