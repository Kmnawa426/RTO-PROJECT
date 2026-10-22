import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext'
// import './Training.css'


// ---------- Helpers ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const parts = (date) => {
  const d = new Date(date)
  return { day: d.getDate(), month: MONTHS[d.getMonth()] }
}
const formatDate = (date) => {
  const { day, month } = parts(date)
  return `${day} ${month}`
}
const byDate = (a, b) => new Date(a.Date) - new Date(b.Date)

// ---------- Main page ----------
export default function Training() {
  const token = localStorage.getItem('UserToken') // TODO: your user token key
  const headers = { 'auth-token': token }

  const [applications, setApplications] = useState([])
  const [schools, setSchools] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getApplications = () =>
    axios
      .get(`${host}/User/ViewApplication`, { headers })
      .then((res) => {
        console.log('ViewApplication:', res)
        const list = res.data.Applicant || []
        setApplications(list)
        setActiveId((id) => (list.some((a) => a._id === id) ? id : list[0]?._id ?? null))
      })
      .catch((err) => {
        console.log(err)
        setError(err.response?.data?.message || 'Could not load your applications')
      })

  const getSchools = () =>
    axios
      .get(`${host}/User/ViewDrivingSchools`, { headers })
      .then((res) => {
        console.log('ViewDrivingSchools:', res)
        setSchools(res.data.Schools || [])
      })
      .catch((err) => console.log(err))

  useEffect(() => {
    Promise.all([getApplications(), getSchools()]).finally(() => setLoading(false))
  }, [])

  const chooseSchool = (school) => {
    axios
      .post(
        `${host}/User/ApplyToDrivingSchool/${school._id}`,
        { appid: activeId },
        { headers }
      )
      .then((res) => {
        console.log('ApplyToDrivingSchool:', res)
        setShowModal(false)
        getApplications()
      })
      .catch((err) => alert(err.response?.data?.message || 'Failed to apply'))
  }

  const app = applications.find((a) => a._id === activeId)

  if (loading) return <div className="tr-page"><p className="tr-muted">Loading…</p></div>
  if (error) return <div className="tr-page"><p className="tr-muted">{error}</p></div>

  return (
    <div className="tr-page">
      <header className="tr-header">
        <h1>Your training</h1>
        <p>Pick an application to see its school, sessions and progress.</p>
      </header>

      {applications.length === 0 ? (
        <div className="tr-empty">
          <h2>No applications yet</h2>
          <p>Submit a licence application first, then choose a driving school.</p>
        </div>
      ) : (
        <>
          <div className="tr-apps" role="tablist">
            {applications.map((a) => (
              <button
                key={a._id}
                role="tab"
                aria-selected={a._id === activeId}
                className={`tr-app ${a._id === activeId ? 'tr-app-active' : ''}`}
                onClick={() => setActiveId(a._id)}
              >
                <strong>{a.VehicleType}</strong>
                <span>{a.ApplicationType}</span>
                <em className={a.DrivingSchool ? 'tr-dot tr-dot-on' : 'tr-dot'}>
                  {a.DrivingSchool ? a.DrivingSchool.SchoolName : 'No school yet'}
                </em>
              </button>
            ))}
          </div>

          {app?.DrivingSchool ? (
            <TrainingDetails app={app} />
          ) : (
            <div className="tr-empty">
              <div className="tr-empty-icon" aria-hidden="true">🚗</div>
              <h2>No driving school yet</h2>
              <p>Choose a school to start your sessions and track your progress.</p>
              <button className="tr-button" onClick={() => setShowModal(true)}>
                Apply to a school
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <SchoolModal
          schools={schools}
          onSelect={chooseSchool}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

// ---------- Shown when a school is already selected ----------
function TrainingDetails({ app }) {
  const sessions = useMemo(
    () => [...(app.TrainingSchedule || [])].sort(byDate),
    [app.TrainingSchedule]
  )

  const active = sessions.filter((s) => s.Status !== 'Cancelled')
  const done = active.filter((s) => s.Status === 'Completed').length
  const percent = active.length ? Math.round((done / active.length) * 100) : 0
  const nextSession = sessions.find((s) => s.Status === 'Scheduled')

  return (
    <>
      <div className="tr-grid">
        <section className="tr-card">
          <div className="tr-card-top">
            <h2>Progress</h2>
            <span className="tr-percent">{percent}%</span>
          </div>

          <div
            className="tr-road"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="tr-road-fill" style={{ width: `${percent}%` }} />
          </div>

          <p className="tr-muted">
            {done} of {active.length} sessions completed
          </p>
        </section>

        <section className="tr-card">
          <h2>{app.DrivingSchool.SchoolName}</h2>
          <p className="tr-muted">{app.DrivingSchool.City}</p>

          <div className="tr-next">
            <span className="tr-next-label">Next session</span>
            {nextSession ? (
              <>
                <strong>
                  {formatDate(nextSession.Date)} · {nextSession.StartTime}
                </strong>
                <span>{nextSession.Topic || 'Driving practice'}</span>
              </>
            ) : (
              <strong>Nothing scheduled</strong>
            )}
          </div>
        </section>
      </div>

      <section className="tr-card tr-sessions">
        <h2>Sessions</h2>

        {sessions.length === 0 ? (
          <p className="tr-muted">Your school has not scheduled any sessions yet.</p>
        ) : (
          <ul className="tr-list">
            {sessions.map((s) => {
              const { day, month } = parts(s.Date)
              return (
                <li key={s._id} className={`tr-row ${s.Status === 'Cancelled' ? 'tr-row-dim' : ''}`}>
                  <div className="tr-tile">
                    <strong>{day}</strong>
                    <span>{month}</span>
                  </div>
                  <div className="tr-row-main">
                    <div className="tr-row-topic">{s.Topic || 'Driving practice'}</div>
                    <div className="tr-muted">
                      {s.StartTime}
                      {s.EndTime && ` – ${s.EndTime}`}
                    </div>
                  </div>
                  <span className={`tr-status tr-status-${s.Status.toLowerCase()}`}>{s.Status}</span>
                </li>
              )
            })}
          </ul>
        )}

        {app.Remarks && (
          <div className="tr-remarks">
            <strong>Note from your instructor</strong>
            <p>{app.Remarks}</p>
          </div>
        )}
      </section>
    </>
  )
}

// ---------- Modal with the list of schools ----------
function SchoolModal({ schools, onSelect, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const q = query.trim().toLowerCase()
  const filtered = schools.filter(
    (s) =>
      (s.SchoolName || '').toLowerCase().includes(q) || (s.City || '').toLowerCase().includes(q)
  )

  return (
    <div className="tr-overlay" onClick={onClose}>
      <div className="tr-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="tr-modal-top">
          <h2>Choose a driving school</h2>
          <button className="tr-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <input
          className="tr-search"
          placeholder="Search by name or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <ul className="tr-school-list">
          {filtered.length === 0 && <li className="tr-muted">No schools match your search.</li>}
          {filtered.map((school) => (
            <li key={school._id} className="tr-school">
              <div>
                <strong>{school.SchoolName}</strong>
                <span>{school.City}</span>
              </div>
              <button className="tr-button tr-button-small" onClick={() => onSelect(school)}>
                Apply
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}