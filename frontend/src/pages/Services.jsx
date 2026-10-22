import { Link } from 'react-router-dom'

// Matches ApplicationType in your model: "Learner Licence" | "Driving Licence"
const SERVICES = [
  {
    type: 'Learner Licence', icon: 'bi-person-plus',
    text: 'Your first step to driving legally. Apply, then train with a driving school.',
    eligibility: ['Minimum age 16 for gearless two wheelers, 18 for others', 'Valid identity and address proof'],
  },
  {
    type: 'Driving Licence', icon: 'bi-person-vcard',
    text: 'For learners who have finished training and passed the driving test.',
    eligibility: ['Approved learner licence', 'Training completed with a driving school', 'Minimum age 18'],
  },
]
const VEHICLES = ['Two Wheeler With Gear', 'Two Wheeler Without Gear', 'Four Wheeler']
const DOCS = ['Adhaar Card', 'Voter ID', 'Address Proof', 'Passport', 'Pan Card']

export default function Services() {
  return (
    <>
      <div className="mb-4">
        <div className="eyebrow">Apply</div>
        <h1 className="page-title">Apply for a service</h1>
        <p className="text-muted mb-0">Check what you'll need before you start.</p>
      </div>

      <div className="row g-3 mb-4">
        {SERVICES.map(s => (
          <div className="col-lg-6" key={s.type}>
            <div className="card-soft d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-tile"><i className={'bi ' + s.icon} /></div>
                <b className="fs-5">{s.type}</b>
              </div>
              <p className="text-muted">{s.text}</p>
              <h6 className="fw-bold">Eligibility</h6>
              <ul className="check-list mb-4 flex-grow-1">
                {s.eligibility.map(e => <li key={e}><i className="bi bi-check-circle-fill" />{e}</li>)}
              </ul>
              <Link to={'/applylicence'} className="btn btn-primary">Apply now</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card-soft">
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="fw-bold">Vehicle types</h6>
            <ul className="check-list">{VEHICLES.map(v => <li key={v}><i className="bi bi-car-front" />{v}</li>)}</ul>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">Accepted documents (upload one)</h6>
            <ul className="check-list">{DOCS.map(d => <li key={d}><i className="bi bi-file-earmark-pdf" />{d}</li>)}</ul>
          </div>
        </div>
      </div>
    </>
  )
}
