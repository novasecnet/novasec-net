'use client'
import { useState, useEffect } from 'react'

interface PostDoc {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  tags: string[]
  published: boolean
  createdAt: string
}

const EMPTY_POST = { title: '', slug: '', excerpt: '', body: '', tags: '', published: false }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PostDoc | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_POST)
  const [saving, setSaving] = useState(false)

  const fetchPosts = async () => {
    const res = await fetch('/api/posts?admin=1')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    // Support ?new=1 from dashboard quick action
    if (typeof window !== 'undefined' && window.location.search.includes('new=1')) {
      setCreating(true)
    }
  }, [])

  const openCreate = () => {
    setForm(EMPTY_POST)
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (post: PostDoc) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      tags: post.tags?.join(', ') || '',
      published: post.published,
    })
    setEditing(post)
    setCreating(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    if (editing) {
      await fetch(`/api/posts/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setSaving(false)
    setCreating(false)
    setEditing(null)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  const handleTogglePublish = async (post: PostDoc) => {
    await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    fetchPosts()
  }

  if (creating) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => { setCreating(false); setEditing(null) }}
            className="text-sm font-mono hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">{editing ? 'Edit Post' : 'New Post'}</h1>
        </div>

        <div className="max-w-3xl space-y-4">
          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>TITLE *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => {
                const title = e.target.value
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                setForm({ ...form, title, slug: editing ? form.slug : slug })
              }}
              className="w-full px-4 py-2.5 rounded border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>SLUG</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded border text-sm font-mono outline-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--accent)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>EXCERPT</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded border text-sm outline-none resize-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>
              BODY (Markdown)
            </label>
            <textarea
              rows={20}
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              className="w-full px-4 py-2.5 rounded border text-sm font-mono outline-none resize-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              placeholder="# Title&#10;&#10;Write your post in Markdown..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>
              TAGS (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="pentesting, network, security"
              className="w-full px-4 py-2.5 rounded border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm" style={{ color: 'var(--text)' }}>
              Published (visible on site)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.title}
              className="px-6 py-2.5 rounded text-sm font-medium"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : 'Save Post'}
            </button>
            <button
              onClick={() => { setCreating(false); setEditing(null) }}
              className="px-6 py-2.5 rounded text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {posts.length} posts total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="text-sm font-mono animate-pulse" style={{ color: 'var(--muted)' }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border rounded-lg"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <p className="font-mono">// No posts yet</p>
          <button onClick={openCreate}
            className="mt-4 text-sm"
            style={{ color: 'var(--accent)' }}>
            Write your first post →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post._id}
              className="flex items-center gap-4 p-4 rounded-lg border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{post.title}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted)' }}>
                  /{post.slug} · {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  className="text-xs px-3 py-1.5 rounded border"
                  style={{
                    borderColor: post.published ? 'var(--success)' : 'var(--border)',
                    color: post.published ? 'var(--success)' : 'var(--muted)',
                  }}
                >
                  {post.published ? '● Live' : '○ Draft'}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="text-xs px-3 py-1.5 rounded border hover:opacity-80"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-xs px-3 py-1.5 rounded border"
                  style={{ borderColor: '#ef444440', color: '#ef4444' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
