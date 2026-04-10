interface CertItem {
  name: string
  full: string
}

interface CertsContent {
  title?: string
  items?: CertItem[]
}

export default function CertificationsSection({ content }: { content: Record<string, unknown> }) {
  const c = content as CertsContent
  const items = c.items || []

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// CREDENTIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'Certifications'}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((cert) => (
            <div
              key={cert.name}
              className="p-6 rounded-lg border text-center transition-all hover:scale-105 cursor-default"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
            >
              <div className="text-2xl font-black mb-2 gradient-text">{cert.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{cert.full}</div>
              <div className="mt-3 w-8 h-0.5 mx-auto" style={{ backgroundColor: 'var(--accent)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
