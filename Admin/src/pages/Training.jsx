import { useEffect } from "react"
import axios from 'axios'
export default function Training() {
  const getTraining=() => {
    // axios.get()
  }
  useEffect(() => {
    getTraining()
  })
  return (
    <>
      <div className="page-head"><div><h1>Training Records</h1><p>Each record links a student to their licence application and assigned driving school.</p></div></div>
      <div className="panel">
        <div className="toolbar">
          <div className="search"><i className="bi bi-search"></i><input className="form-control" type="search" placeholder="Search record, student or application" /></div>
          <select className="form-select"><option>All statuses</option></select>
          <select className="form-select"><option>All schools</option></select>
          {/* <input type="date" className="form-control" aria-label="From" /><span className="text-muted small">to</span><input type="date" className="form-control" aria-label="To" /> */}
          {/* <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1"></i>Export CSV</button> */}
        </div>
        <div className="table-responsive">
          <table className="table rto-table">
            <thead><tr><th>Record</th><th>Student</th><th>Application</th><th>Driving school</th><th>Period</th><th>Progress</th><th>Status</th><th className="text-end">Action</th></tr></thead>
            <tbody>
              {/* One <tr> per record. Repeat this row from your database. */}

              <tr><td><span className="ref">TR-5005</span></td><td>Aditya Joshi</td><td><span className="ref">LL-MH-2026-00129</span></td><td>Navjeevan Driving School</td><td>2026-08-10 – 2026-09-10</td><td><div className="progress-thin"><div style={{ width: '100%' }}></div></div><span className="pct">100%</span></td><td><span className="pill ok">Completed</span></td><td className="text-end"><button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#trainingModal">Manage</button></td></tr>

            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>Showing 1–8 of 30</span>
          <div className="pager"><button disabled><i className="bi bi-chevron-left"></i></button><button className="on">1</button><button>2</button><span className="px-1">…</span><button>4</button><button><i className="bi bi-chevron-right"></i></button></div>
        </div>
      </div>

      {/* ============ MODAL ============ */}
      <div className="modal fade" id="trainingModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Training record TR-5003</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div className="modal-body">
              <div className="p-2 mb-3 rounded small" style={{ background: '#f4f6fb' }}><i className="bi bi-person"></i> Divya Patel <i className="bi bi-arrow-right mx-1"></i> <i className="bi bi-file-earmark-text"></i> DL-MH-2026-00133 <i className="bi bi-arrow-right mx-1"></i> <i className="bi bi-building"></i> Ganesh Motor School</div>
              <div className="kv"><div><small>Start date</small><div>2026-09-18</div></div><div><small>End date</small><div>2026-10-18</div></div><div><small>Current status</small><div><span className="pill ok">Completed</span></div></div><div><small>Progress</small><div>100%</div></div></div>
              <div className="row g-3">
                <div className="col-6"><label className="form-label">Update status</label><select className="form-select" defaultValue="Completed"><option>Scheduled</option><option>In Progress</option><option>Completed</option></select></div>
                <div className="col-6"><label className="form-label">Progress</label><input type="range" className="form-range" min="0" max="100" step="5" defaultValue="100" /></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button><button className="btn btn-primary btn-sm">Save changes</button></div>
          </div>
        </div>
      </div>
    </>
  )
}
