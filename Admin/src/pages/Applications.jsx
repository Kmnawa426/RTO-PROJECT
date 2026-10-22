import { useEffect, useState } from "react"
import axios from 'axios'
import { host } from "../Context/MyContext"
import { Link } from 'react-router-dom'

export default function Applications() {
  const [applicants, setApplicants] = useState([])
  const [selected, setSelected] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const getApplications = () => {
    setLoading(true)
    axios.get(`${host}/Admin/ViewApplication`)
      .then((res) => {
        console.log(res)
        setApplicants(Array.isArray(res.data.Application) ? res.data.Application : [])
      }).catch((err) => {
        console.log(err)
        alert(err.response?.data?.message || "Could not load applications")
      }).finally(() => setLoading(false))
  }

  useEffect(() => {
    getApplications()
  }, [])

  const filteredApplications = applicants.filter((appdata) => {
    const search = searchText.toLowerCase().trim()
    const appId = appdata._id || ""
    const applicantName = appdata.User?.FullName || ""
    const matchesSearch = !search || appId.toLowerCase().includes(search) || applicantName.toLowerCase().includes(search)
    const matchesType = !selectedType || appdata.ApplicationType === selectedType
    const matchesStatus = !selectedStatus || appdata.ApplicationStatus === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const countStatus = (status) => applicants.filter((app) => app.ApplicationStatus === status).length

  return (
    <>
      <div className="page-head"><div><h1>Applications</h1><p>Review submitted applications and follow their progress.</p></div>
        <button className="btn btn-outline-primary" onClick={getApplications} disabled={loading}><i className="bi bi-arrow-clockwise me-1"></i>{loading ? "Loading..." : "Refresh"}</button>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-amber"><i className="bi bi-hourglass-split"></i></div><div><small>Submitted</small><div><b>{countStatus("Submitted")}</b></div></div></div></div>
        <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-sky"><i className="bi bi-search"></i></div><div><small>Under Review</small><div><b>{countStatus("Under Verification")}</b></div></div></div></div>
        <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-green"><i className="bi bi-check2-circle"></i></div><div><small>Approved</small><div><b>{countStatus("Approved")}</b></div></div></div></div>
        <div className="col-6 col-lg-3"><div className="stat"><div className="stat-icon ic-red"><i className="bi bi-x-circle"></i></div><div><small>Rejected</small><div><b>{countStatus("Rejected") + countStatus("Documents Rejected")}</b></div></div></div></div>
      </div>
      <div className="panel">
        <div className="toolbar">
          <div className="search"><i className="bi bi-search"></i><input className="form-control" type="search" placeholder="Search application no. or applicant" value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div>
          <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">All types</option><option value="Learner Licence">Learner Licence</option><option value="Driving Licence">Driving Licence</option>
          </select>
          <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">All statuses</option><option value="Submitted">Submitted</option><option value="Under Verification">Under Verification</option><option value="Documents Rejected">Documents Rejected</option><option value="Approved">Approved</option><option value="Training">Training</option><option value="Ready for Test">Ready for Test</option><option value="Test Scheduled">Test Scheduled</option><option value="Test Passed">Test Passed</option><option value="Test Failed">Test Failed</option><option value="Completed">Completed</option><option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table rto-table">
            <thead><tr><th>Application No.</th><th>Applicant</th><th>Type</th><th>Submitted</th><th>Documents</th><th>Status</th><th className="text-end">Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" className="text-center py-4">Loading applications...</td></tr> : filteredApplications.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No applications found.</td></tr> : filteredApplications.map((appdata) => (
                <tr key={appdata._id}>
                  <td><span className="ref">{(appdata._id || "").slice(0, 4).toUpperCase()}-{(appdata._id || "").slice(4, 8).toUpperCase()}</span></td>
                  <td>{appdata.User?.FullName || "N/A"}</td><td>{appdata.ApplicationType || "Learner Licence"}</td>
                  <td>{(appdata.DateOfApplication || appdata.createdAt || "").split("T")[0] || "N/A"}</td><td><span className="pct">{appdata.DocumentName || "Not provided"}</span></td>
                  <td><span className={`pill ${["Rejected", "Documents Rejected", "Test Failed"].includes(appdata.ApplicationStatus) ? "danger" : ["Approved", "Completed", "Test Passed"].includes(appdata.ApplicationStatus) ? "ok" : "warn"}`}>{appdata.ApplicationStatus || "Submitted"}</span></td>
                  <td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(appdata)} data-bs-toggle="modal" data-bs-target="#appModal">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot"><span>Showing {filteredApplications.length} of {applicants.length} applications</span><Link to="/verification" className="btn btn-sm btn-outline-primary">Open verification queue</Link></div>
      </div>
      <div className="modal fade" id="appModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Application {(selected?._id || "").slice(0, 4).toUpperCase()}-{(selected?._id || "").slice(4, 8).toUpperCase()}</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
          <div className="modal-body">
            <div className="kv">
              <div><small>Applicant</small><div>{selected?.User?.FullName || "N/A"}</div></div><div><small>Application type</small><div>{selected?.ApplicationType || "Learner Licence"}</div></div>
              <div><small>Submitted on</small><div>{(selected?.DateOfApplication || selected?.createdAt || "").split("T")[0] || "N/A"}</div></div><div><small>Current status</small><div><span className="pill warn">{selected?.ApplicationStatus || "Submitted"}</span></div></div>
              <div><small>Email</small><div>{selected?.User?.Email || "N/A"}</div></div><div><small>Phone</small><div>{selected?.User?.Phone || "N/A"}</div></div>
              <div><small>Vehicle type</small><div>{selected?.VehicleType || "N/A"}</div></div><div><small>Document verification</small><div>{selected?.DocumentVerification || "Pending"}</div></div>
              {selected?.AdminRemarks ? <div><small>Admin remarks</small><div>{selected.AdminRemarks}</div></div> : null}
            </div>
            <div className="sec-label mt-4">Submitted document</div>
            <div className="doc-row d-flex align-items-center gap-2 flex-wrap"><i className="bi bi-file-earmark-text"></i><span>{selected?.DocumentName || "Document"}</span>{selected?.DocumentImage ? <a className="btn btn-sm btn-outline-primary ms-auto" href={selected.DocumentImage} target="_blank" rel="noreferrer">View document</a> : <span className="text-muted small">Document URL not available</span>}</div>
          </div>
          {selected?.ApplicationStatus!=="Completed"?(
          <div className="modal-footer"><Link to="/verification" className="btn btn-primary btn-sm"><button className="bg-transparent border-0 text-white " data-bs-dismiss="modal">Review verification  </button></Link><button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button></div>
          ):(<div className="modal-footer"><button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button></div>)}
          </div></div>
      </div>
    </>
  )
}
