import { useState, useEffect } from 'react'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext.jsx'

// Change this to match where you mounted the DrivingTest router
const SCHEDULE_URL = `${host}/DrivingTest/Schedule`

const toInputDate = (d) => d.toLocaleDateString('en-CA') // YYYY-MM-DD

export default function ScheduleTestModal({ show, application, onClose, onSuccess }) {
  const token = localStorage.getItem('UserToken')

  const [testDate, setTestDate] = useState('')
  const [testTime, setTestTime] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setTestDate('')
      setTestTime('')
      setError('')
    }
  }, [show])

  if (!show || !application) return null

  // Earliest allowed date: 30 days after LL test pass, but never before today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let eligibleFrom = today
  if (application.LLTestPassedAt) {
    const e = new Date(application.LLTestPassedAt)
    e.setHours(0, 0, 0, 0)
    e.setDate(e.getDate() + 30)
    if (e > today) eligibleFrom = e
  }
  const minDate = toInputDate(eligibleFrom)

  const handleDateChange = (value) => {
    setError('')
    if (value) {
      const [y, m, d] = value.split('-').map(Number)
      if (new Date(y, m - 1, d).getDay() === 0) {
        setError('Driving tests cannot be scheduled on Sundays.')
        setTestDate('')
        return
      }
    }
    setTestDate(value)
  }

  const handleSchedule = async () => {
    if (!testDate || !testTime) {
      setError('Please select a test date and time.')
      return
    }

    try {
      setScheduling(true)
      setError('')

      const res = await axios.post(
        SCHEDULE_URL,
        {
          Application: application._id,
          TestDate: testDate,
          TestTime: testTime
        },
        { headers: { 'auth-token': token } }
      )

      alert(res.data?.message || 'Driving test scheduled successfully.')

      onSuccess?.({
        ...application,
        ApplicationStatus: 'Test Scheduled',
        PracticalTestStatus: 'SCHEDULED'
      })
      onClose()
    } catch (err) {
      console.error('Schedule driving test:', err)
      setError(
        err.response?.data?.message || 'Unable to schedule the driving test.'
      )
    } finally {
      setScheduling(false)
    }
  }

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="applications-eyebrow">DRIVING TEST</div>
                <h5 className="modal-title">Schedule your driving test</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={scheduling}
              />
            </div>

            <div className="modal-body">
              <p className="text-muted small">
                Tests are available from{' '}
                <b>{eligibleFrom.toLocaleDateString('en-IN')}</b> (30 days after
                your Learner's Licence test). Sundays are not available.
              </p>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="mb-3">
                <label className="form-label" htmlFor="testDate">Test date</label>
                <input
                  id="testDate"
                  type="date"
                  className="form-control"
                  value={testDate}
                  min={minDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="testTime">Test time</label>
                <input
                  id="testTime"
                  type="time"
                  className="form-control"
                  value={testTime}
                  onChange={(e) => setTestTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="application-close-btn"
                onClick={onClose}
                disabled={scheduling}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSchedule}
                disabled={scheduling || !testDate || !testTime}
              >
                {scheduling ? 'Scheduling...' : 'Schedule test'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} />
    </>
  )
}