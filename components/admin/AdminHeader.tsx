'use client'
import { signOut } from 'next-auth/react'

interface User {
  name?: string | null
  email?: string | null
}

export default function AdminHeader({ user }: { user?: User }) {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
        <span style={{ color: 'var(--accent)' }}>root@novasec</span>:~$
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-xs px-3 py-1.5 rounded border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
