import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

// Page title + breadcrumb shown in the top bar
const TITLES = {
  '/': ['Dashboard', 'Overview'],
  '/applications': ['Application Management', 'Operations'],
  '/vehicles': ['Vehicle Management', 'Operations'],
  '/licences': ['Driving Licence Management', 'Operations'],
  '/driving-schools': ['Driving School Management', 'Operations'],
  '/training': ['Training Management', 'Operations'],
  '/users': ['Vehicle Owners / Users', 'People'],
  '/verification': ['Verification & Approvals', 'Verification'],
  '/reports': ['Reports & Analytics', 'Reports'],
  '/notifications': ['Notifications', 'Reports'],
  '/profile': ['Admin Profile', 'Account'],
  '/settings': ['Settings', 'Settings'],
}

export default function Layout() {
  const [open, setOpen] = useState(false) // mobile menu
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  const [title, section] = TITLES[pathname] || ['Admin', 'Admin']

  return (
    <>
      <Sidebar open={open} />
      {open && <div className="sidebar-backdrop-show" onClick={() => setOpen(false)} />}
      <div className="admin-main-wrap">
        <Topbar title={title} section={section} onMenu={() => setOpen(!open)} />
        <main className="admin-main">
          
          <Outlet />
        </main>
        <footer className="admin-footer">© 2026 Regional Transport Office · Admin Portal</footer>
      </div>
    </>
  )
}
