import { Link } from 'react-router-dom'
import Ornament from '../components/ui/Ornament'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="paper">
      <div className="container-site flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <img src="/images/logo/mark.png" alt="" className="h-24 w-auto opacity-80" />
        <p className="eyebrow mt-8">404</p>
        <h1 className="display mt-3 text-5xl">This page has wandered off</h1>
        <Ornament className="mx-auto my-6" />
        <p className="font-serif text-xl text-cocoa-70 italic">Perhaps it went looking for laddus.</p>
        <Link to="/" className="btn btn-primary mt-10">Return home</Link>
      </div>
    </section>
  )
}
