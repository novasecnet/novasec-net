'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HeroContent {
  headline?: string
  subheadline?: string
  cta?: string
  ctaLink?: string
}

const TYPING_STRINGS = [
  'Penetration Tester',
  'Threat Hunter',
  'Network Defender',
  'Security Architect',
  'Red Team Operator',
]

export default function HeroSection({ content }: { content: Record<string, unknown> }) {
  const c = content as HeroContent
  const [typedText, setTypedText] = useState('')
  const [stringIdx, setStringIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = TYPING_STRINGS[stringIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setTypedText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1500)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setTypedText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setCharIdx(0)
          setStringIdx(i => (i + 1) % TYPING_STRINGS.length)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? 50 : 80)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, stringIdx, c])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated background hex grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5L55 20v30L30 55 5 40V20z' fill='none' stroke='%2300d4ff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Terminal badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-mono"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'rgba(0,212,255,0.05)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
          STATUS: AVAILABLE FOR ENGAGEMENTS
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          <span style={{ color: 'var(--text)' }}>{c.headline || 'Network Security'}</span>
          <br />
          <span className="gradient-text">Expert</span>
        </h1>

        {/* Typing animation */}
        <div className="text-xl md:text-2xl font-mono mb-6 h-8"
          style={{ color: 'var(--accent)' }}>
          {'>'} <span>{typedText}</span>
          <span className="inline-block w-0.5 h-5 ml-0.5 animate-pulse align-middle"
            style={{ backgroundColor: 'var(--accent)' }} />
        </div>

        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
          style={{ color: 'var(--muted)' }}>
          {c.subheadline || 'Penetration Testing · Threat Intelligence · Security Consulting'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={c.ctaLink || '/about'}
            className="px-8 py-3 rounded font-semibold text-sm transition-all hover:opacity-90 glow"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
          >
            {c.cta || 'View My Work'}
          </Link>
          <Link
            href="/blog"
            className="px-8 py-3 rounded font-semibold text-sm border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Read Blog
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-md mx-auto">
          {[
            { value: '100+', label: 'Assessments' },
            { value: '50+', label: 'CVEs Found' },
            { value: '5+', label: 'Years Exp.' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--muted)' }}>
        <span className="text-xs font-mono">SCROLL</span>
        <div className="w-px h-12 animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
      </div>
    </section>
  )
}
