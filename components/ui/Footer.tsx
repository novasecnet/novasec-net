export default function Footer() {
  return (
    <footer className="border-t mt-auto py-8 px-4"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} NovaSec.net · All rights reserved
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--border)' }}>
          // Securing the digital frontier
        </p>
      </div>
    </footer>
  )
}
