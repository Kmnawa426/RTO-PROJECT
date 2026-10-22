import { useEffect, useState } from 'react'
import axios from 'axios'
import StatusPill from '../components/StatusPill.jsx'

const HOST = 'http://localhost:7002'

export default function DrivingTest() {
  const [application, setApplication] = useState(null)
  const [tests, setTests] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [holidays, setHolidays] = useState([])
  const [times, setTimes] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('UserToken')

  useEffect(() => {
    getDrivingTest()
  }, [])

  const getDrivingTest = async () => {
    try {
      const response = await axios.get(`${HOST}/User/ViewApplication`, {
        headers: { 'auth-token': token },
      })

      setApplication(response.data.Application)

      const testResponse = await axios.get(
        `${HOST}/User/ViewMyDrivingTests`,
        { headers: { 'auth-token': token } }
      )

      setTests(testResponse.data.Tests || [])
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load driving test details.')
    } finally {
      setLoading(false)
    }
  }

  const scheduleDrivingTest = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!date || !time) {
      setMessage('Please select a date and time.')
      return
    }

    try {
      const response = await axios.post(
        `${HOST}/User/ScheduleDrivingTest`,
        {
          Application: application._id,
          TestDate: date,
          TestTime: time,
        },
        { headers: { 'auth-token': token } }
      )

      setMessage(response.data.message)
      setDate('')
      setTime('')
      getDrivingTest()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to schedule the test.')
    }
  }

  if (loading) return <p>Loading...</p>

  if (!application) {
    return <p>{message || 'No driving licence application found.'}</p>
  }

  const ready = application.ApplicationStatus === 'Ready for Test'
  const appointment = tests.find(
    (test) => ['Scheduled', 'Rescheduled'].includes(test.TestStatus)
  )

  const earliestDate = application.LLTestPassedAt
    ? new Date(
        new Date(application.LLTestPassedAt).setDate(
          new Date(application.LLTestPassedAt).getDate() + 30
        )
      ).toISOString().split('T')[0]
    : ''

  const checkDate = (value) => {
    setDate('')
    setTime('')

    const selectedDate = new Date(`${value}T00:00:00`)

    if (selectedDate.getDay() === 0) {
      setMessage('Sundays are holidays. Please select another date.')
      return
    }

    if (value < earliestDate) {
      setMessage(`You can select a date from ${earliestDate}.`)
      return
    }

    if (holidays.includes(value)) {
      setMessage('This date is a government holiday. Please select another date.')
      return
    }

    setMessage('')
    setDate(value)
  }

  const getAvailability = async () => {
    try {
      const response = await axios.get(
        `${HOST}/User/DrivingTestAvailability`,
        {
          headers: { 'auth-token': token },
          params: { applicationId: application._id },
        }
      )

      setHolidays(response.data.Holidays || [])
      setTimes(response.data.AvailableTimes || [])
    } catch (error) {
      setMessage('Unable to load available dates and times.')
    }
  }

  return (
    <div>
      {message && <p className="text-danger">{message}</p>}

      {appointment ? (
        <div className="card-soft">
          <h2 className="section-title">Your appointment</h2>

          <p>
            <strong>Date:</strong>{' '}
            {new Date(appointment.TestDate).toLocaleDateString('en-IN')}
          </p>

          <p><strong>Time:</strong> {appointment.TestTime}</p>

          <p>
            <strong>Status:</strong>{' '}
            <StatusPill status={appointment.TestStatus} />
          </p>

          <p>
            <strong>Remarks:</strong>{' '}
            {appointment.TestRemarks || 'No remarks yet.'}
          </p>
        </div>
      ) : ready ? (
        <div className="card-soft">
          <h2 className="section-title">Schedule Driving Test</h2>

          <p>
            Earliest date:{' '}
            {earliestDate || 'Learner licence test pass date unavailable'}
          </p>

          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={getAvailability}
          >
            Schedule Driving Test
          </button>

          {times.length > 0 && (
            <form onSubmit={scheduleDrivingTest}>
              <div className="mb-3">
                <label className="form-label">Select date</label>
                <input
                  type="date"
                  className="form-control"
                  min={earliestDate}
                  value={date}
                  onChange={(e) => checkDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Select time</label>
                <select
                  className="form-select"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="">Choose time</option>
                  {times.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary" type="submit">
                Confirm Appointment
              </button>
            </form>
          )}
        </div>
      ) : (
        <p>Your driving school has not marked you ready for the test yet.</p>
      )}

      {tests.length > 0 && (
        <div className="mt-4">
          <h2 className="section-title">Test history</h2>

          {tests.map((test) => (
            <div className="card-soft mb-2" key={test._id}>
              <p className="mb-1">
                {new Date(test.TestDate).toLocaleDateString('en-IN')} — {test.TestTime}
              </p>
              <StatusPill status={test.TestStatus} />
              {test.TestRemarks && <p className="mb-0">{test.TestRemarks}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
