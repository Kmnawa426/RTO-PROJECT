import { Link } from 'react-router-dom'

export default function Topbar({ title, section, onMenu }) {
  return (
    <header className="topbar">
      <button className="icon-btn d-lg-none" onClick={onMenu} aria-label="Menu"><i className="bi bi-list" /></button>
      <div>
        <div className="crumb">Admin &gt; {section}</div>
        <div className="page-title-top">{title}</div>
      </div>
      <div className="global-search">
        {/* <i className="bi bi-search" /> */}
        {/* <input type="search" placeholder="Search applications, vehicles, users…" /> */}
      </div>
      <Link className="icon-btn" to="/notifications" aria-label="Notifications">
        {/* <i className="bi bi-bell" /><span className="dot" /> */}
      </Link>
      <div className="dropdown">
        <button className="user-btn" data-bs-toggle="dropdown">
          <span className="avatar">RA</span>
          <div><b>RTO Admin</b></div>
          <i className="bi bi-chevron-down small" />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><Link className="dropdown-item text-danger" to="/login">Logout</Link></li>
        </ul>
      </div>
    </header>
  )
}
