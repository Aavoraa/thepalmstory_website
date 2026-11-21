import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import useDocumentTitle from '../hooks/useDocumentTitle'

/** Front-end only: connect to an auth backend to make sign-in functional. */
export default function Account() {
  useDocumentTitle('Account')
  const [mode, setMode] = useState('signin')
  const [note, setNote] = useState(false)
  return (
    <>
      <PageHero eyebrow="Your account" title={mode === 'signin' ? 'Sign In' : 'Create Account'} crumbs={[['Account']]} />
      <section className="container-site py-16 lg:py-24">
        <div className="mx-auto max-w-md bg-cream p-8 ring-1 ring-gold/30 sm:p-12">
          <div className="mb-8 grid grid-cols-2 border-b border-gold/40">
            {['signin', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`pb-3 text-[11px] tracking-[0.22em] uppercase ${mode === m ? 'border-b border-cocoa text-cocoa' : 'text-cocoa-70'}`}>
                {m === 'signin' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setNote(true)
            }}
            className="space-y-6"
          >
            {mode === 'register' && (
              <label className="block"><span className="field-label">Full name</span><input required className="field" autoComplete="name" /></label>
            )}
            <label className="block"><span className="field-label">Email</span><input required type="email" className="field" autoComplete="email" /></label>
            <label className="block"><span className="field-label">Password</span><input required type="password" className="field" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label>
            <button className="btn btn-primary w-full">{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
            {note && <p className="text-center text-xs text-cocoa-70">Accounts will be enabled once the store backend is connected.</p>}
          </form>
          <p className="mt-8 text-center text-sm text-cocoa-70">
            Looking for saved items? <Link to="/wishlist" className="link-lux text-cocoa">View your wishlist</Link>
          </p>
        </div>
      </section>
    </>
  )
}
