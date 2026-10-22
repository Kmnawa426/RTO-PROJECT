import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">R</div>
          <div>
            <div className="brand-title">RTO Connect</div>
            <div className="brand-sub">Driving School Portal</div>
          </div>
        </div>
        <nav>
          <NavLink to="/" end className={linkClass}><span className="nav-icon">▦</span>Dashboard</NavLink>
          <NavLink to="/students" className={linkClass}><span className="nav-icon">☺</span>Students</NavLink>
          <NavLink to="/schedule" className={linkClass}><span className="nav-icon">◷</span>Training Schedule</NavLink>
          <NavLink to="/progress" className={linkClass}><span className="nav-icon">↗</span>Training Progress</NavLink>
          <NavLink to="/tests" className={linkClass}><span className="nav-icon">✓</span>Driving Tests</NavLink>
          <NavLink to="/profile" className={linkClass}><span className="nav-icon">⌂</span>School Profile</NavLink>
        </nav>
        <div className="note">
          <strong>Note</strong>
          <p>Licences are approved only by the RTO. Schools manage training &amp; test readiness.</p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-school">
            <div className="avatar">SW</div>
            <div className="school-meta">
              <div className="school-name">SafeWheels Driving School</div>
              <div className="school-role">Driving School</div>
            </div>
            <NavLink to="/login" className="btn btn-outline btn-sm">Log out</NavLink>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
