interface ExpItem {
  role: string
  company: string
  period: string
  description: string
}

interface ExpContent {
  title?: string
  items?: ExpItem[]
}

export default function ExperienceSection({ content }: { content: Record<string, unknown> }) {
  const c = content as ExpContent
  const items = c.items || []

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// TIMELINE</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'Experience'}</h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--border)' }} />

          <div className="space-y-12">
            {items.map((item, i) => (
              <div key={i} className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 mt-1"
                  style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }} />

                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="p-5 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{item.role}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--accent)' }}>{item.company}</div>
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>{item.period}</div>
                    <p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
