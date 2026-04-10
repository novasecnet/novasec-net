'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const MapEmbed = dynamic(() => import('@/components/ui/MapEmbed'), { ssr: false })

interface ContactContent {
  title?: string
  email?: string
  linkedin?: string
  github?: string
  lat?: number
  lng?: number
  locationLabel?: string
}

export default function ContactSection({ content }: { content: Record<string, unknown> }) {
  const c = content as ContactContent
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// CONTACT</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'Get In Touch'}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: info + map */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Contact Information</h3>
              <div className="space-y-3">
                {c.email && (
                  <a href={`mailto:${c.email}`}
                    className="flex items-center gap-3 text-sm hover:opacity-80"
                    style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>✉</span>
                    {c.email}
                  </a>
                )}
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:opacity-80"
                    style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>in</span>
                    LinkedIn Profile
                  </a>
                )}
                {c.github && (
                  <a href={c.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:opacity-80"
                    style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>⌥</span>
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)', height: '250px' }}>
              <MapEmbed
                lat={c.lat || 51.505}
                lng={c.lng || -0.09}
                label={c.locationLabel || 'Available Worldwide'}
              />
            </div>
          </div>

          {/* Right: contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>NAME *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded border text-sm outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    // @ts-ignore
                    '--tw-ring-color': 'var(--accent)',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>EMAIL *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded border text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>SUBJECT</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>MESSAGE *</label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            {status === 'success' && (
              <div className="p-3 rounded text-sm text-center"
                style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                Message sent successfully! I will get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 rounded text-sm text-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444' }}>
                Failed to send message. Please try again or email directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded font-semibold text-sm transition-all"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
