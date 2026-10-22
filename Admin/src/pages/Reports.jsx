export default function Reports() {
  return (
    <>
          <div className="page-head"><div><h1>Reports &amp; Analytics</h1><p>Trends and breakdowns across all RTO services.</p></div><button className="btn btn-outline-primary"><i className="bi bi-download me-1"></i>Export summary</button></div>
          <div className="row g-3 mb-3">
            <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-green"><i className="bi bi-percent"></i></div><div><small>Approval rate</small><div><b>76%</b></div></div></div></div>
            <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-amber"><i className="bi bi-clock-history"></i></div><div><small>Open applications</small><div><b>23</b></div></div></div></div>
            <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-sky"><i className="bi bi-car-front"></i></div><div><small>Active registrations</small><div><b>34</b></div></div></div></div>
            <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-blue"><i className="bi bi-mortarboard"></i></div><div><small>Training completion</small><div><b>47%</b></div></div></div></div>
          </div>
          <div className="row g-3">
            <div className="col-lg-5"><div className="panel h-100"><div className="panel-head">Vehicles by type</div><div className="panel-body">
              <div className="bar-row"><span>Two Wheeler</span><div className="track"><div style={{ width: '80%', background: '#143c85' }}></div></div><b>12</b></div>
              <div className="bar-row"><span>Four Wheeler</span><div className="track"><div style={{ width: '100%', background: '#2f7be5' }}></div></div><b>15</b></div>
              <div className="bar-row"><span>Commercial</span><div className="track"><div style={{ width: '53%', background: '#16a34a' }}></div></div><b>8</b></div>
              <div className="bar-row"><span>Transport</span><div className="track"><div style={{ width: '33%', background: '#f59e0b' }}></div></div><b>5</b></div>
            </div></div></div>
            <div className="col-lg-7"><div className="panel h-100"><div className="panel-head">Outcome by application type</div>
              <div className="table-responsive"><table className="table rto-table"><thead><tr><th>Type</th><th>Total</th><th>Approved</th><th>Rejected</th><th>Open</th></tr></thead><tbody>
                <tr><td>Learner Licence</td><td>19</td><td>13</td><td>3</td><td>3</td></tr>
                <tr><td>Driving Licence</td><td>18</td><td>9</td><td>3</td><td>6</td></tr>
                <tr><td>Vehicle Registration</td><td>13</td><td>6</td><td>2</td><td>5</td></tr>
                <tr><td>Licence Renewal</td><td>10</td><td>4</td><td>2</td><td>4</td></tr>
                <tr><td>Ownership Transfer</td><td>12</td><td>5</td><td>2</td><td>5</td></tr>
              </tbody></table></div></div></div>
          </div>
    </>
  )
}
