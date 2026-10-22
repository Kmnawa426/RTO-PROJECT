import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

// Top navbar + page (Outlet) + footer. Every page is shown inside <Outlet />.
export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 py-lg-5 flex-grow-1">
        <Outlet />
      </main>
      <footer className="portal-footer">
        <div className="container d-flex flex-column flex-md-row justify-content-between gap-1">
          <span>© 2026 RTO Connect · Citizen services portal</span>
          <span>Prototype — showing clearly labelled sample data from a mock service.</span>
        </div>
      </footer>
    </div>
  )
}
