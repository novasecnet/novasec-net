interface Testimonial {
  _id: string
  name: string
  company?: string
  role?: string
  text: string
  rating?: number
}

interface TestimonialsContent {
  title?: string
}

export default function TestimonialsSection({
  content,
  extra,
}: {
  content: Record<string, unknown>
  extra?: unknown
}) {
  const c = content as TestimonialsContent
  const testimonials = (extra as Testimonial[]) || []

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// CLIENT FEEDBACK</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'What Clients Say'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-lg border relative"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {/* Quote mark */}
              <div className="text-4xl font-serif absolute top-4 right-5 opacity-20"
                style={{ color: 'var(--accent)' }}>&rdquo;</div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <span key={i} style={{ color: '#f59e0b' }}>★</span>
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                {(t.role || t.company) && (
                  <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                    {[t.role, t.company].filter(Boolean).join(' @ ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
