import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 grid-bg"
      style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center max-w-lg">
        <p className="font-mono text-sm mb-4" style={{ color: 'var(--accent)' }}>
          ERROR_CODE: 404
        </p>
        <h1 className="text-7xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
          Page Not Found
        </p>
        <p className="mb-8 font-mono text-sm" style={{ color: 'var(--muted)' }}>
          {'>'} The requested resource could not be located on this server.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 rounded text-sm font-medium transition-all"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
          >
            Return Home
          </Link>
          <Link
            href="/blog"
            className="px-6 py-2 rounded text-sm font-medium border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
