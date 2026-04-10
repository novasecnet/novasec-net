'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ backgroundColor: 'rgba(10,14,23,0.9)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span style={{ color: 'var(--accent)' }}>&#9632;</span>
          <span className="gradient-text">NovaSec</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>.net</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{
                color: pathname === href ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="mailto:contact@novasec.net"
            className="text-sm font-medium px-4 py-1.5 rounded border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--muted)' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 mb-1 transition-all" style={{ background: 'var(--text)' }} />
          <div className="w-5 h-0.5 mb-1 transition-all" style={{ background: 'var(--text)' }} />
          <div className="w-5 h-0.5 transition-all" style={{ background: 'var(--text)' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium"
              style={{ color: pathname === href ? 'var(--accent)' : 'var(--text)' }}
            >
              {label}
            </Link>
          ))}
          <a
            href="mailto:contact@novasec.net"
            className="text-sm font-medium"
            style={{ color: 'var(--accent)' }}
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  )
}
