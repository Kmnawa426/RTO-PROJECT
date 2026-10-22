import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <>
          <div className="page-head"><div><h1>Good afternoon, Admin</h1><p>Here’s what is happening across the RTO office today.</p></div><Link to="/verification" className="btn btn-primary"><i className="bi bi-check2-circle me-1"></i>Review queue</Link></div>
          {/* Stat cards: edit the numbers */}
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-blue"><i className="bi bi-people"></i></div><div><small>Total Registered Users</small><div><b>36</b><em className="up">+8.2%</em></div></div></div></div>
            {/* <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-sky"><i className="bi bi-car-front"></i></div><div><small>Registered Vehicles</small><div><b>40</b><em className="up">+5.1%</em></div></div></div></div> */}
            <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-teal"><i className="bi bi-file-earmark-text"></i></div><div><small>Total Applications</small><div><b>72</b><em className="up">+12.4%</em></div></div></div></div>
            <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-amber"><i className="bi bi-hourglass-split"></i></div><div><small>Pending Applications</small><div><b>23</b><em className="down">-3.2%</em></div></div></div></div>
            {/* <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-green"><i className="bi bi-check2-circle"></i></div><div><small>Approved Applications</small><div><b>37</b><em className="up">+9.6%</em></div></div></div></div> */}
            <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-blue"><i className="bi bi-building"></i></div><div><small>Driving Schools</small><div><b>12</b><em className="up">+2%</em></div></div></div></div>
            {/* <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-sky"><i className="bi bi-mortarboard"></i></div><div><small>Active Training Records</small><div><b>13</b><em className="up">+4.4%</em></div></div></div></div> */}
            {/* <div className="col-sm-6 col-xl-3"><div className="stat"><div className="stat-icon ic-red"><i className="bi bi-x-circle"></i></div><div><small>Rejected Applications</small><div><b>12</b><em className="down">-1.5%</em></div></div></div></div> */}
          </div>
          <div className="row g-3 mb-3">
            <div className="col-lg-8"><div className="panel h-100"><div className="panel-head">Applications received<select className="form-select form-select-sm w-auto"><option>All time</option><option>Last 6 months</option><option>Last 3 months</option></select></div>
              <div className="panel-body">
              <svg viewBox="0 0 600 220" className="w-100" role="img" aria-label="Applications received per month">
                {/* Static placeholder chart. Replace with a chart library or your own data. */}
                <g stroke="#eef1f7"><line x1="40" y1="190" x2="580" y2="190"/><line x1="40" y1="120" x2="580" y2="120"/><line x1="40" y1="50" x2="580" y2="50"/></g>
                <polygon points="50,190 50,134 135,134 220,141 305,43 390,99 475,120 560,155 560,190" fill="rgba(20,60,133,.1)"/>
                <polyline points="50,134 135,134 220,141 305,43 390,99 475,120 560,155" fill="none" stroke="#143c85" strokeWidth="2.5"/>
                <circle cx="50" cy="134" r="3.5" fill="#143c85"/><text x="50" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Apr</text><circle cx="135" cy="134" r="3.5" fill="#143c85"/><text x="135" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">May</text><circle cx="220" cy="141" r="3.5" fill="#143c85"/><text x="220" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Jun</text><circle cx="305" cy="43" r="3.5" fill="#143c85"/><text x="305" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Jul</text><circle cx="390" cy="99" r="3.5" fill="#143c85"/><text x="390" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Aug</text><circle cx="475" cy="120" r="3.5" fill="#143c85"/><text x="475" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Sep</text><circle cx="560" cy="155" r="3.5" fill="#143c85"/><text x="560" y="210" fontSize="11" fill="#6b7a99" textAnchor="middle">Oct</text>
              </svg>
              </div></div></div>
            <div className="col-lg-4"><div className="panel h-100"><div className="panel-head">Status distribution</div><div className="panel-body">
              {/* Donut is CSS only: change the degrees in .donut in assets/css/style.css */}
              <div className="donut"></div>
              <div className="legend"><span><i style={{ background: '#f59e0b' }}></i>Pending</span><span><i style={{ background: '#3b82f6' }}></i>Under Review</span><span><i style={{ background: '#16a34a' }}></i>Approved</span><span><i style={{ background: '#dc2626' }}></i>Rejected</span></div>
            </div></div></div>
          </div>
          <div className="row g-3">
            <div className="col-lg-4"><div className="panel h-100"><div className="panel-head">Applications by type</div><div className="panel-body">
              <div className="bar-row"><span>Learner Licence</span><div className="track"><div style={{ width: '100%', background: '#143c85' }}></div></div><b>19</b></div>
              <div className="bar-row"><span>Driving Licence</span><div className="track"><div style={{ width: '95%', background: '#2f7be5' }}></div></div><b>18</b></div>
              {/* <div className="bar-row"><span>Vehicle Registration</span><div className="track"><div style={{ width: '68%', background: '#16a34a' }}></div></div><b>13</b></div> */}
              <div className="bar-row"><span>Licence Renewal</span><div className="track"><div style={{ width: '53%', background: '#f59e0b' }}></div></div><b>10</b></div>
              {/* <div className="bar-row"><span>Ownership Transfer</span><div className="track"><div style={{ width: '63%', background: '#dc2626' }}></div></div><b>12</b></div> */}
            </div></div></div>
            <div className="col-lg-5"><div className="panel h-100"><div className="panel-head">Pending tasks</div><div className="panel-body">
              <div className="task-row"><div className="stat-icon ic-amber"><i className="bi bi-file-earmark-text"></i></div><div>Pending applications<small>Awaiting first review</small></div><b className="n">9</b></div>
              <div className="task-row"><div className="stat-icon ic-sky"><i className="bi bi-folder2-open"></i></div><div>Documents to verify<small>Across open applications</small></div><b className="n">34</b></div>
              <div className="task-row"><div className="stat-icon ic-blue"><i className="bi bi-building"></i></div><div>School verifications<small>New registration requests</small></div><b className="n">3</b></div>
              {/* <div className="task-row"><div className="stat-icon ic-red"><i className="bi bi-mortarboard"></i></div><div>Training needing attention<small>Not started or low progress</small></div><b className="n">9</b></div> */}
            </div></div></div>
            <div className="col-lg-3"><div className="panel h-100"><div className="panel-head">Quick actions</div><div className="panel-body"><div className="quick">
                <Link to="/verification"><i className="bi bi-clipboard-check"></i>Review Pending</Link>
                {/* <Link to="/vehicles"><i className="bi bi-car-front"></i>Manage Vehicles</Link> */}
                <Link to="/driving-schools"><i className="bi bi-building"></i>Driving Schools</Link>
                <Link to="/training"><i className="bi bi-mortarboard"></i>Training Records</Link>
                {/* <Link to="/reports"><i className="bi bi-bar-chart"></i>Open Reports</Link> */}
                <Link to="/licences"><i className="bi bi-person-vcard"></i>Licences</Link>
              </div></div></div></div>
          </div>
    </>
  )
}
