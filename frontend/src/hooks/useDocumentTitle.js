import { useEffect } from 'react'

/** Lightweight per-page SEO: title + meta description */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title
      ? `${title} — The Palm Story`
      : 'The Palm Story — Traditional South Indian Karupatti Sweets'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
