'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/pages', label: 'Page Builder', icon: '⣿' },
  { href: '/admin/blog', label: 'Blog Posts', icon: '✎' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '★' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 border-r"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="font-black gradient-text text-lg">NovaSec</Link>
        <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted)' }}>Admin Panel</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all"
              style={{
                backgroundColor: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              <span>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 text-xs"
          style={{ color: 'var(--muted)' }}>
          ↗ View Site
        </Link>
      </div>
    </aside>
  )
}
