'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SectionDoc {
  _id: string
  page: string
  type: string
  order: number
  visible: boolean
  content: Record<string, unknown>
}

const TYPE_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  skills: 'Skills & Proficiency',
  certifications: 'Certifications',
  testimonials: 'Client Testimonials',
  contact: 'Contact Form + Map',
  bio: 'About Bio',
  experience: 'Work Experience',
  services: 'Services Offered',
}

function SortableRow({
  section,
  onToggle,
  onEdit,
}: {
  section: SectionDoc
  onToggle: (id: string, visible: boolean) => void
  onEdit: (section: SectionDoc) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section._id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
      className="flex items-center gap-3 p-4 rounded-lg border mb-2"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-xl px-1"
        style={{ color: 'var(--muted)', touchAction: 'none' }}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {TYPE_LABELS[section.type] || section.type}
        </div>
        <div className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          page: {section.page} · order: {section.order}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(section)}
          className="text-xs px-3 py-1.5 rounded border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          Edit Content
        </button>
        <button
          onClick={() => onToggle(section._id, !section.visible)}
          className="text-xs px-3 py-1.5 rounded border transition-all"
          style={{
            borderColor: section.visible ? 'var(--success)' : 'var(--border)',
            color: section.visible ? 'var(--success)' : 'var(--muted)',
          }}
        >
          {section.visible ? '● Visible' : '○ Hidden'}
        </button>
      </div>
    </div>
  )
}

export default function PageBuilderPage() {
  const [page, setPage] = useState<'home' | 'about'>('home')
  const [sections, setSections] = useState<SectionDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editSection, setEditSection] = useState<SectionDoc | null>(null)
  const [editContent, setEditContent] = useState('')
  const [jsonError, setJsonError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchSections = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/sections?page=${page}`)
    const data = await res.json()
    setSections(data)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchSections() }, [fetchSections])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = sections.findIndex(s => s._id === active.id)
    const newIdx = sections.findIndex(s => s._id === over.id)
    const reordered = arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, order: i }))
    setSections(reordered)

    setSaving(true)
    await fetch('/api/sections/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reordered.map(s => ({ id: s._id, order: s.order }))),
    })
    setSaving(false)
  }

  const handleToggle = async (id: string, visible: boolean) => {
    setSections(prev => prev.map(s => s._id === id ? { ...s, visible } : s))
    await fetch('/api/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, visible }),
    })
  }

  const handleEdit = (section: SectionDoc) => {
    setEditSection(section)
    setEditContent(JSON.stringify(section.content, null, 2))
    setJsonError('')
  }

  const handleSaveEdit = async () => {
    if (!editSection) return
    try {
      const content = JSON.parse(editContent)
      setJsonError('')
      await fetch('/api/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editSection._id, content }),
      })
      setSections(prev => prev.map(s => s._id === editSection._id ? { ...s, content } : s))
      setEditSection(null)
    } catch {
      setJsonError('Invalid JSON — please fix the syntax before saving.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Page Builder</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Drag to reorder sections. Toggle visibility or edit content.
          </p>
        </div>
        {saving && (
          <span className="text-xs font-mono animate-pulse" style={{ color: 'var(--accent)' }}>
            Saving order...
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['home', 'about'] as const).map(p => (
          <button key={p}
            onClick={() => setPage(p)}
            className="px-4 py-2 rounded text-sm font-medium transition-all"
            style={{
              backgroundColor: page === p ? 'var(--accent)' : 'var(--surface)',
              color: page === p ? 'var(--bg)' : 'var(--muted)',
              border: `1px solid ${page === p ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            {p === 'home' ? 'Home Page' : 'About Page'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm font-mono animate-pulse" style={{ color: 'var(--muted)' }}>
          Loading sections...
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map(s => s._id)} strategy={verticalListSortingStrategy}>
            {sections.map(section => (
              <SortableRow
                key={section._id}
                section={section}
                onToggle={handleToggle}
                onEdit={handleEdit}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Content Edit Modal */}
      {editSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => e.target === e.currentTarget && setEditSection(null)}
        >
          <div className="w-full max-w-2xl rounded-lg border p-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-lg mb-1">
              Edit: {TYPE_LABELS[editSection.type] || editSection.type}
            </h2>
            <p className="text-xs mb-4 font-mono" style={{ color: 'var(--muted)' }}>
              Edit JSON content · Changes are saved immediately
            </p>
            <textarea
              rows={16}
              value={editContent}
              onChange={e => { setEditContent(e.target.value); setJsonError('') }}
              className="w-full p-3 rounded border font-mono text-xs outline-none resize-none"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: jsonError ? '#ef4444' : 'var(--border)',
                color: 'var(--accent)',
              }}
              spellCheck={false}
            />
            {jsonError && (
              <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{jsonError}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditSection(null)}
                className="px-5 py-2 rounded text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
