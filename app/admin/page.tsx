import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Testimonial } from '@/lib/models/Testimonial'
import { Section } from '@/lib/models/Section'
import Link from 'next/link'

async function getStats() {
  try {
    await connectDB()
    const [posts, testimonials, sections] = await Promise.all([
      Post.countDocuments(),
      Testimonial.countDocuments(),
      Section.countDocuments(),
    ])
    return { posts, testimonials, sections }
  } catch {
    return { posts: 0, testimonials: 0, sections: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Blog Posts', value: stats.posts, href: '/admin/blog', icon: '✎', color: '#00d4ff' },
    { label: 'Testimonials', value: stats.testimonials, href: '/admin/testimonials', icon: '★', color: '#f59e0b' },
    { label: 'Page Sections', value: stats.sections, href: '/admin/pages', icon: '⣿', color: '#10b981' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Welcome back. Manage your portfolio content below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {cards.map(({ label, value, href, icon, color }) => (
          <Link key={label} href={href}
            className="p-6 rounded-lg border transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{icon}</span>
              <span className="text-3xl font-black" style={{ color }}>{value}</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
            <div className="mt-2 h-0.5" style={{ backgroundColor: color, opacity: 0.3 }} />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/admin/blog?new=1"
          className="flex items-center gap-3 p-4 rounded border transition-all hover:opacity-80"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--accent)' }}>+</span>
          <span className="text-sm">Write New Blog Post</span>
        </Link>
        <Link href="/admin/pages"
          className="flex items-center gap-3 p-4 rounded border transition-all hover:opacity-80"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--accent)' }}>⣿</span>
          <span className="text-sm">Edit Page Layout</span>
        </Link>
      </div>
    </div>
  )
}
