import { Link } from 'react-router-dom'
import StatusPill from '../components/StatusPill.jsx'
import ScheduleTestModal from '../components/ScheduleTestModal.jsx'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext.jsx'

// Application journey
const FLOW = [
  'Submitted',
  'Under Verification',
  'Approved',
  'Training',
  'Ready for Test',
  'Test Scheduled',
  'Test Passed',
  'Completed'
]

const STOPPED = ['Documents Rejected', 'Rejected', 'Test Failed']

function Progress({ status }) {
  if (STOPPED.includes(status)) {
    return (
      <div className="alert alert-danger py-2 small mb-0">
        This application stopped at: <b>{status}</b>
      </div>
    )
  }

  const current = FLOW.indexOf(status)

  return (
    <div className="timeline">
      {FLOW.map((step, index) => (
        <div
          className="tl-item"
          key={step}
          style={{ opacity: index > current ? 0.45 : 1 }}
        >
          <b>{step}</b>
          {index === current && <small>Current step</small>}
        </div>
      ))}
    </div>
  )
}

const progressLabel = (status) => {
  switch (status) {
    case 'Training':
      return 'Training underway'
    case 'Submitted':
    case 'Under Verification':
      return 'Document review'
    case 'Approved':
      return 'Application approved'
    case 'Ready for Test':
      return 'Ready for driving test'
    case 'Test Scheduled':
      return 'Driving test scheduled'
    case 'Test Passed':
      return 'Driving test passed'
    case 'Completed':
      return 'Completed successfully'
    default:
      return 'View progress'
  }
}

export default function Applications() {
  const token = localStorage.getItem('UserToken')

  const [application, setApplication] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const getMyApplication = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${host}/User/ViewApplication`, {
        headers: { 'auth-token': token }
      })

      setApplication(res.data.Applicant || [])
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Could not load applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMyApplication()
  }, [token])

  const openProgress = (app) => {
    setSelected(app)
  }

  const handleScheduled = (updatedApp) => {
    setSelected(updatedApp)
    setApplication((prev) =>
      prev.map((a) => (a._id === updatedApp._id ? updatedApp : a))
    )
    getMyApplication() // sync with backend
  }

  const canScheduleTest =
    selected?.ApplicationStatus === 'Ready for Test' &&
    selected?.PracticalTestStatus !== 'SCHEDULED'

  return (
    <div className="applications-page">
      <div className="applications-heading">
        <div>
          <div className="applications-eyebrow">TRACK</div>
          <h1 className="applications-title">My applications</h1>
          <p className="applications-subtitle">
            Follow each application from submission to decision.
          </p>
        </div>

        <Link to="/services" className="applications-new-btn">
          + New application
        </Link>
      </div>

      <section className="applications-panel">
        <div className="applications-panel-header">
          <h2>Application history</h2>
          <span className="applications-count">
            {application.length} records
          </span>
        </div>

        {loading ? (
          <div className="applications-message">Loading applications...</div>
        ) : error ? (
          <div className="applications-message applications-error">
            {error}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={getMyApplication}
            >
              Retry
            </button>
          </div>
        ) : application.length === 0 ? (
          <div className="applications-empty">
            <i className="bi bi-folder2-open" />
            <h3>No applications yet</h3>
            <p>Your submitted applications will appear here.</p>
            <Link to="/services" className="applications-new-btn">
              Apply for a service
            </Link>
          </div>
        ) : (
          <div className="applications-table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>REFERENCE</th>
                  <th>SERVICE</th>
                  <th>SUBMITTED</th>
                  <th>STATUS</th>
                  <th>PROGRESS</th>
                </tr>
              </thead>

              <tbody>
                {application.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <span className="application-reference">
                        {app._id.slice(0, 4).toUpperCase()}-
                        {app._id.slice(4, 8).toUpperCase()}
                      </span>
                    </td>

                    <td>{app.ApplicationType}</td>

                    <td>
                      {app.DateOfApplication
                        ? new Date(app.DateOfApplication).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' }
                          )
                        : '—'}
                    </td>

                    <td>
                      <StatusPill status={app.ApplicationStatus} />
                    </td>

                    <td>
                      <button
                        type="button"
                        className="application-progress-btn"
                        onClick={() => openProgress(app)}
                        data-bs-toggle="modal"
                        data-bs-target="#applicationProgressModal"
                      >
                        {progressLabel(app.ApplicationStatus)}
                        <i className="bi bi-arrow-up-right ms-2" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Application progress modal */}
      <div
        className="modal fade"
        id="applicationProgressModal"
        tabIndex="-1"
        aria-labelledby="applicationProgressModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content application-modal">
            <div className="modal-header">
              <div>
                <div className="applications-eyebrow">TRACK APPLICATION</div>
                <h5 className="modal-title" id="applicationProgressModalTitle">
                  {selected?.ApplicationType}
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {selected && (
              <div className="modal-body">
                <div className="application-details">
                  <div>
                    <span>Application reference</span>
                    <strong>
                      {selected._id.slice(0, 4).toUpperCase()}-
                      {selected._id.slice(4, 8).toUpperCase()}
                    </strong>
                  </div>

                  <div>
                    <span>Submitted</span>
                    <strong>
                      {selected.DateOfApplication
                        ? new Date(
                            selected.DateOfApplication
                          ).toLocaleDateString('en-IN')
                        : '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Vehicle type</span>
                    <strong>{selected.VehicleType || '—'}</strong>
                  </div>

                  <div>
                    <span>Document verification</span>
                    <strong>{selected.DocumentVerification || 'Pending'}</strong>
                  </div>
                </div>

                <h6 className="application-journey-title">
                  Application journey
                </h6>

                <Progress status={selected.ApplicationStatus} />

                {(selected.ApplicationStatus === 'Test Scheduled' ||
                  selected.PracticalTestStatus === 'SCHEDULED') && (
                  <div className="alert alert-info mt-3 mb-0">
                    <i className="bi bi-calendar-check me-2" />
                    Your practical driving test is scheduled.
                  </div>
                )}

                {selected.ApplicationStatus === 'Test Passed' && (
                  <div className="alert alert-success mt-3 mb-0">
                    <i className="bi bi-check-circle me-2" />
                    You passed your practical driving test. Your licence is
                    awaiting RTO processing.
                  </div>
                )}

                {selected.AdminRemarks && (
                  <div className="application-remarks mt-3">
                    <strong>RTO remarks</strong>
                    <p>{selected.AdminRemarks}</p>
                  </div>
                )}
              </div>
            )}

            <div className="modal-footer">
              {canScheduleTest && (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => setShowSchedule(true)}
                >
                  <i className="bi bi-calendar-plus me-2" />
                  Schedule driving test
                </button>
              )}

              <button
                type="button"
                className="application-close-btn"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable driving test scheduling modal */}
      <ScheduleTestModal
        show={showSchedule}
        application={selected}
        onClose={() => setShowSchedule(false)}
        onSuccess={handleScheduled}
      />
    </div>
  )
}