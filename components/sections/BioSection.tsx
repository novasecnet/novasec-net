interface BioContent {
  name?: string
  title?: string
  bio?: string
  avatar?: string
}

export default function BioSection({ content }: { content: Record<string, unknown> }) {
  const c = content as BioContent
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-full border-2 overflow-hidden flex items-center justify-center"
              style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface2)' }}>
              {c.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl" style={{ color: 'var(--accent)' }}>⬡</div>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div>
            <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// ABOUT ME</span>
            <h1 className="text-4xl font-bold mt-2 mb-1">{c.name || 'Security Professional'}</h1>
            <p className="text-lg mb-6 gradient-text font-semibold">{c.title || 'Network Security Expert'}</p>
            <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>{c.bio}</p>

            {/* Terminal-style info */}
            <div className="mt-6 p-4 rounded-lg font-mono text-sm"
              style={{ backgroundColor: 'var(--surface)', borderLeft: '3px solid var(--accent)' }}>
              <div style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--accent)' }}>$</span> whoami
              </div>
              <div className="mt-1" style={{ color: 'var(--text)' }}>
                {c.name || 'security_professional'} // Network Security Expert
              </div>
              <div className="mt-2" style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--accent)' }}>$</span> cat /etc/skills
              </div>
              <div className="mt-1" style={{ color: 'var(--text)' }}>
                pentest | red-team | threat-intel | network-defense
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
