import { Link } from 'react-router-dom'

// Centered card used by Login / Register / School registration (no navbar)
export default function AuthShell({ title, subtitle, wide, children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: wide ? 680 : 420 }}>
        <Link to="/" className="d-flex align-items-center gap-2 mb-4 text-decoration-none" style={{ color: 'var(--primary-dark)' }}>
          <span className="brand-mark"><i className="bi bi-shield-check" /></span>
          <b>RTO Connect</b>
        </Link>
        <h1 className="h4 fw-bold mb-1">{title}</h1>
        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}
