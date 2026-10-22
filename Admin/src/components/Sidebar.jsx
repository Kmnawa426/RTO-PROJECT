import { NavLink } from 'react-router-dom'

// Edit this list to change the menu: [label, url, icon, optional badge number]
const NAV = [
  { group: 'Overview', items: [['Dashboard', '/', 'bi-speedometer2']] },
  { group: 'Operations', items: [
    ['Applications', '/applications', 'bi-file-earmark-text'],
    ['Document Verification ', '/verification', 'bi-check2-circle',],
    // ['Vehicles', '/vehicles', 'bi-car-front-fill'],
    ['Issue Licences', '/licences', 'bi-person-vcard'],
    ['Driving Schools', '/driving-schools', 'bi-building'],
    ['Users', '/users', 'bi-people'],
    ['Training', '/training', 'bi-mortarboard'],
    ['Logout', '/login', 'bi-box-arrow-left'],
    ['  Driving Test Management', "/driving-test-management", 'bi-box-arrow-left'],
    ['Issue Driving Licence', "/licences", 'bi-box-arrow-left'],
  ] }
]

export default function Sidebar({ open }) {
  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="sidebar-brand">
        <div className="brand-mark"><i className="bi bi-shield-check" /></div>
        <div>
          <div className="brand-name">RTO Admin</div>
          <div className="brand-sub">Transport Department</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(g => (
          <div key={g.group}>
            <div className="px-2 pt-3 pb-1 small fw-bold text-uppercase"
                 style={{ color: '#8fb0ee', fontSize: '.65rem', letterSpacing: '.07em' }}>{g.group}</div>
            {g.items.map(([label, to, icon, count]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  'nav-item-link' + (isActive ? ' active' : '') + (label === 'Logout' ? ' logout' : '')}>
                <i className={'bi ' + icon} />{label}
                {count ? <span className="nav-count">{count}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
