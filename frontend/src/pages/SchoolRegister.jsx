import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import Field, { FormResult } from '../components/Field.jsx'
import { postFormData } from '../api.js'

// Fields = DrivingSchool model. SchoolImage is a file, so the form is sent as multipart FormData.
// "Permission" is NOT asked here: it stays false until the RTO admin approves the school.
export default function SchoolRegister() {
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setBusy(true)
    const res = await postFormData('/schools/register', new FormData(form)) // <- change to your route
    setBusy(false)
    setResult(res)
    if (res.ok) form.reset()
  }

  return (
    <AuthShell wide title="Register your driving school" subtitle="Your school will appear to learners after the RTO approves it.">
      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <Field label="School name" name="SchoolName" />
          <Field label="Contact person" name="ContactPerson" />
          <Field label="Email" name="Email" type="email" />
          <Field label="Phone" name="Phone" type="tel" pattern="[0-9]{10}" maxLength={10} help="10-digit mobile number" />
          <Field col="col-12" label="Address" name="Address" as="textarea" />
          <Field label="City" name="City" />
          <Field label="Password" name="Password" type="password" minLength={6} autoComplete="new-password" />
          <div className="col-12">
            <label htmlFor="f-SchoolImage" className="form-label">School photo <span className="text-danger">*</span></label>
            <div className="upload-box">
              <input id="f-SchoolImage" name="SchoolImage" type="file" accept="image/*" className="form-control" required />
              <div className="form-text">JPG or PNG, a clear photo of your school or signboard.</div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-4 py-2" disabled={busy}>{busy ? 'Submitting…' : 'Submit for approval'}</button>
        <FormResult result={result} okText="Registration submitted. The RTO will review your school." />
      </form>
      <p className="text-center small text-muted mt-4 mb-0">
        <Link to="/" className="fw-semibold">Back to home</Link>
      </p>
    </AuthShell>
  )
}
