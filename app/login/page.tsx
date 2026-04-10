'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-bg"
      style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black gradient-text mb-1">NovaSec</div>
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>ADMIN ACCESS PANEL</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          {/* Terminal prompt */}
          <div className="font-mono text-xs mb-6 p-3 rounded"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)' }}>
            <span style={{ color: 'var(--muted)' }}>root@novasec:~$</span> ./authenticate
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>EMAIL</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>PASSWORD</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>

            {error && (
              <div className="text-xs p-3 rounded text-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-semibold text-sm transition-all mt-2"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 font-mono" style={{ color: 'var(--border)' }}>
          Unauthorized access is prohibited and monitored.
        </p>
      </div>
    </div>
  )
}
