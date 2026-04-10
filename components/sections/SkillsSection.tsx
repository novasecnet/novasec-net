'use client'
import { useEffect, useRef, useState } from 'react'

interface SkillItem {
  name: string
  level: number
}

interface SkillsContent {
  title?: string
  items?: SkillItem[]
}

export default function SkillsSection({ content }: { content: Record<string, unknown> }) {
  const c = content as SkillsContent
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const items = c.items || []

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// EXPERTISE</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{c.title || 'Core Skills'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((skill) => (
            <div key={skill.name}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {skill.name}
                </span>
                <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
                  {skill.level}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: visible ? `${skill.level}%` : '0%',
                    background: 'linear-gradient(90deg, #00d4ff, #0ea5e9)',
                    boxShadow: '0 0 8px rgba(0,212,255,0.5)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
