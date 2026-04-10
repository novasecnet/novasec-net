'use client'
import { useState, useEffect } from 'react'

interface TestimonialDoc {
  _id: string
  name: string
  company?: string
  role?: string
  text: string
  rating: number
  visible: boolean
}

const EMPTY = { name: '', company: '', role: '', text: '', rating: 5, visible: true }

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<TestimonialDoc | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    const res = await fetch('/api/testimonials')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }

  const openEdit = (t: TestimonialDoc) => {
    setForm({ name: t.name, company: t.company || '', role: t.role || '', text: t.text, rating: t.rating, visible: t.visible })
    setEditing(t)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      await fetch(`/api/testimonials/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchAll()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{items.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
        >
          + Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="text-sm font-mono animate-pulse" style={{ color: 'var(--muted)' }}>Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t._id} className="p-4 rounded-lg border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{t.name}</div>
                  {(t.role || t.company) && (
                    <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                      {[t.role, t.company].filter(Boolean).join(' @ ')}
                    </div>
                  )}
                  <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{t.text}</p>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={{ color: '#f59e0b' }}>★</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(t)}
                    className="text-xs px-3 py-1.5 rounded border"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t._id)}
                    className="text-xs px-3 py-1.5 rounded border"
                    style={{ borderColor: '#ef444440', color: '#ef4444' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="w-full max-w-lg rounded-lg border p-6 space-y-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-lg">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

            {[
              { key: 'name', label: 'NAME *', type: 'text' },
              { key: 'role', label: 'ROLE', type: 'text' },
              { key: 'company', label: 'COMPANY', type: 'text' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form] as string}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded border text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>MESSAGE *</label>
              <textarea rows={4} value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>RATING</label>
              <select value={form.rating}
                onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                className="px-4 py-2.5 rounded border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.name || !form.text}
                className="px-5 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
