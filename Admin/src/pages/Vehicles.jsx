export default function Vehicles() {
  return (
    <>
          <div className="page-head"><div><h1>Vehicles</h1><p>40 vehicles on record</p></div></div>
          <div className="panel">
            <div className="toolbar">
              <div className="search"><i className="bi bi-search"></i><input className="form-control" type="search" placeholder="Search reg. no., owner or model" /></div>
              <select className="form-select"><option>All types</option></select>
              <select className="form-select"><option>All statuses</option></select>
              {/* <input type="date" className="form-control" aria-label="From" /><span className="text-muted small">to</span><input type="date" className="form-control" aria-label="To" /> */}
              <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1"></i>Export CSV</button>
            </div>
            <div className="table-responsive">
              <table className="table rto-table">
                <thead><tr><th>Registration No.</th><th>Type</th><th>Manufacturer / Model</th><th>Owner</th><th>Registered</th><th>Status</th><th className="text-end">Action</th></tr></thead>
                <tbody>
                {/* One <tr> per record. Repeat this row from your database. */}
                <tr><td><span className="ref">MH12 AB 4213</span></td><td>Commercial</td><td>Mahindra<span className="sub">Bolero Pik-Up</span></td><td>Meera Das</td><td>2026-04-22</td><td><span className="pill bad">Expired</span></td><td className="text-end"><button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#viewModal">View</button></td></tr>
                
                </tbody>
              </table>
            </div>
            <div className="table-foot">
              <span>Showing 1–8 of 40</span>
              <div className="pager"><button disabled><i className="bi bi-chevron-left"></i></button><button className="on">1</button><button>2</button><span className="px-1">…</span><button>5</button><button><i className="bi bi-chevron-right"></i></button></div>
            </div>
          </div>

      {/* ============ MODAL ============ */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Vehicle MH12 AB 4213</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div className="modal-body">
              <div className="kv"><div><small>Registration no.</small><div>MH12 AB 4213</div></div><div><small>Type</small><div>Commercial</div></div><div><small>Manufacturer</small><div>Mahindra</div></div><div><small>Model</small><div>Bolero Pik-Up</div></div><div><small>Owner</small><div>Meera Das</div></div><div><small>Registered on</small><div>2026-04-22</div></div><div><small>Status</small><div><span className="pill bad">Expired</span></div></div></div>
            </div>
            <div className="modal-footer"><button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>
    </>
  )
}
