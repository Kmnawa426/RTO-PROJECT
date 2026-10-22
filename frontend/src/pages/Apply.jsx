import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Field, { FormResult } from '../components/Field.jsx'
import { postFormData } from '../api.js'

// Same values as the enums in ApplicationModel.js (spelling must match your model!)
const APPLICATION_TYPES = ['Learner Licence', 'Driving Licence']
const VEHICLE_TYPES = ['Two Wheeler With Gear', 'Two Wheeler Without Gear', 'Four Wheeler']
const DOCUMENT_NAMES = ['Adhaar Card', 'Voter ID', 'Address Proof', 'Passport', 'Pan Card']

// Youngest allowed applicant: 16 years old
const d = new Date()
d.setFullYear(d.getFullYear() - 16)
const MAX_DOB = d.toISOString().slice(0, 10)

export default function Apply() {
  const [params] = useSearchParams()
  const preset = APPLICATION_TYPES.includes(params.get('type')) ? params.get('type') : ''
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setBusy(true)
    // FormData contains: ApplicationType, VehicleType, DateOfBirth, Address, DocumentName, DocumentImage (file)
    // Your server should add: User (from the logged-in user), DateOfApplication, and status defaults.
    const res = await postFormData('/applications', new FormData(form)) // <- change to your route
    setBusy(false)
    setResult(res)
    if (res.ok) form.reset()
  }

  return (
    <>
      <div className="mb-4">
        <div className="eyebrow">Apply</div>
        <h1 className="page-title">New application</h1>
        <p className="text-muted mb-0">Fill in your details and upload one identity document. You can follow progress under <Link to="/applications">My Applications</Link>.</p>
      </div>

      <form className="card-soft" onSubmit={onSubmit} style={{ maxWidth: 780 }}>
        <h2 className="section-title mb-3">Licence details</h2>
        <div className="row g-3 mb-4">
          <Field label="Application type" name="ApplicationType" as="select" options={APPLICATION_TYPES} key={preset} defaultValue={preset} />
          <Field label="Vehicle type" name="VehicleType" as="select" options={VEHICLE_TYPES} />
          <Field label="Date of birth" name="DateOfBirth" type="date" max={MAX_DOB} help="You must be at least 16." />
          <Field col="col-12" label="Address" name="Address" as="textarea" placeholder="House no., street, city, PIN" />
        </div>

        <h2 className="section-title mb-3">Identity document</h2>
        <div className="row g-3">
          <Field label="Document type" name="DocumentName" as="select" options={DOCUMENT_NAMES} />
          <div className="col-md-6">
            <label htmlFor="f-DocumentImage" className="form-label">Upload document <span className="text-danger">*</span></label>
            <input id="f-DocumentImage" name="DocumentImage" type="file" accept="image/*,.pdf" className="form-control" required />
            <div className="form-text">Clear photo or PDF, up to 5 MB.</div>
          </div>
        </div>

        <div className="alert alert-light border mt-4 mb-0 small">
          <i className="bi bi-info-circle me-1" />
          After you submit, the RTO verifies your document. Your status starts as <b>Submitted</b>.
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-primary px-4" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button>
          <Link to="/services" className="btn btn-light">Cancel</Link>
        </div>
        <FormResult result={result} okText="Application submitted. Track it under My Applications." />
      </form>
    </>
  )
}
