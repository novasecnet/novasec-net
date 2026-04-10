'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 grid-bg"
      style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center max-w-lg">
        <p className="font-mono text-sm mb-4" style={{ color: '#ef4444' }}>
          ERROR_CODE: 500
        </p>
        <h1 className="text-7xl font-bold mb-4" style={{ color: '#ef4444' }}>500</h1>
        <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
          Internal Server Error
        </p>
        <p className="mb-8 font-mono text-sm" style={{ color: 'var(--muted)' }}>
          {'>'} An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 rounded text-sm font-medium transition-all"
            style={{ backgroundColor: '#ef4444', color: '#fff' }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded text-sm font-medium border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
