interface ServiceItem {
  name: string
  description: string
}

interface ServicesContent {
  title?: string
  items?: ServiceItem[]
}

const ICONS: Record<string, string> = {
  'Penetration Testing': '⚔',
  'Security Audits': '🔍',
  'Incident Response': '🚨',
  'Security Training': '🎓',
}

export default function ServicesSection({ content }: { content: Record<string, unknown> }) {
  const c = content as ServicesContent
  const items = c.items || []

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// SERVICES</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'What I Offer'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((svc) => (
            <div key={svc.name}
              className="p-6 rounded-lg border group hover:border-opacity-50 transition-all"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-4">{ICONS[svc.name] || '🔒'}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{svc.name}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{svc.description}</p>
              <div className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: 'var(--accent)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
