import { useState } from 'react'
import StatusPill from '../components/StatusPill.jsx'
import { FormResult } from '../components/Field.jsx'
import { postJSON } from '../api.js'

// ---- Sample data shaped like FineModel. Replace with your API results. ----
const FINES = [
  { _id: 'f1', VehicleNumber: 'MH04AB1234', FineReason: 'Signal jumping', FineAmount: 1000, FineDate: '2026-10-08', Location: 'Thane, Naupada', FineStatus: 'Pending', Note: '' },
  { _id: 'f2', VehicleNumber: 'MH04AB1234', FineReason: 'No helmet', FineAmount: 500, FineDate: '2026-09-21', Location: 'Mulund Check Naka', FineStatus: 'Pending', Note: '' },
  { _id: 'f3', VehicleNumber: 'MH12XY9087', FineReason: 'Over speeding', FineAmount: 2000, FineDate: '2026-08-14', Location: 'Pune-Mumbai Expressway', FineStatus: 'Paid', PaymentMethod: 'UPI', PaymentDate: '2026-08-16', Note: '' },
]
const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking'] // FineModel also allows "Cash" (paid at the office)

// Payment pop-up for one fine. Sends PaymentMethod; your server sets FineStatus, PaymentDate, TransactionId.
function PayModal({ fine }) {
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const body = Object.fromEntries(new FormData(e.currentTarget)) // { PaymentMethod }
    const res = await postJSON(`/fines/${fine._id}/pay`, body)      // <- change to your route
    setBusy(false)
    setResult(res)
  }

  return (
    <div className="modal fade" id={'pay-' + fine._id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={onSubmit}>
          <div className="modal-header border-0">
            <h5 className="modal-title">Pay fine</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body pt-0">
            <div className="card-soft mb-3" style={{ background: '#f9fbff' }}>
              <div className="d-flex justify-content-between"><span className="text-muted">Vehicle</span><b>{fine.VehicleNumber}</b></div>
              <div className="d-flex justify-content-between"><span className="text-muted">Reason</span><b>{fine.FineReason}</b></div>
              <div className="d-flex justify-content-between"><span className="text-muted">Amount</span><b>₹ {fine.FineAmount}</b></div>
            </div>
            <label htmlFor={'pm-' + fine._id} className="form-label">Payment method <span className="text-danger">*</span></label>
            <select id={'pm-' + fine._id} name="PaymentMethod" className="form-select" required defaultValue="">
              <option value="" disabled>Select…</option>
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
            <FormResult result={result} okText="Payment received. Thank you." />
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Processing…' : `Pay ₹ ${fine.FineAmount}`}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Fines() {
  const [q, setQ] = useState('')
  const shown = FINES.filter(f => f.VehicleNumber.includes(q.replace(/\s/g, '').toUpperCase()))
  const pendingTotal = FINES.filter(f => f.FineStatus === 'Pending').reduce((n, f) => n + f.FineAmount, 0)

  return (
    <>
      <div className="mb-4">
        <div className="eyebrow">Payments</div>
        <h1 className="page-title">Traffic fines</h1>
        <p className="text-muted mb-0">Look up fines by vehicle number and pay them online.</p>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="card-soft">
            <label htmlFor="vehicle-search" className="form-label">Vehicle number</label>
            <input id="vehicle-search" className="form-control text-uppercase" placeholder="e.g. MH04AB1234"
              value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-soft d-flex flex-column justify-content-center">
            <small className="text-muted">Total pending</small>
            <div className="fs-3 fw-bold">₹ {pendingTotal}</div>
          </div>
        </div>
      </div>

      <div className="card-soft py-2">
        {shown.length === 0 && <div className="text-center text-muted py-4">No fines found for this vehicle.</div>}
        {shown.map(f => (
          <div className="activity" key={f._id}>
            <div className="icon-tile"><i className="bi bi-receipt" /></div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{f.FineReason} · {f.VehicleNumber}</div>
              <small className="text-muted">{f.FineDate}{f.Location ? ' · ' + f.Location : ''}</small>
              {f.FineStatus === 'Paid' && <div><small className="text-muted">Paid by {f.PaymentMethod} on {f.PaymentDate}</small></div>}
            </div>
            <div className="text-end">
              <div className="fw-bold mb-1">₹ {f.FineAmount}</div>
              {f.FineStatus === 'Pending'
                ? <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target={'#pay-' + f._id}>Pay now</button>
                : <StatusPill status={f.FineStatus} />}
            </div>
          </div>
        ))}
      </div>

      {FINES.filter(f => f.FineStatus === 'Pending').map(f => <PayModal key={f._id} fine={f} />)}
    </>
  )
}
