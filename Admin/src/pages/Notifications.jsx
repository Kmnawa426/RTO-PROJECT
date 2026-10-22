export default function Notifications() {
  return (
    <>
          <div className="page-head"><div><h1>Notifications</h1><p>Updates from across the portal.</p></div><button className="btn btn-outline-primary">Mark all as read</button></div>
          <div className="panel">
            <div className="notice-item unread"><div className="stat-icon ic-blue"><i className="bi bi-file-earmark-text"></i></div><div><b>New application submitted</b><div className="text-muted">Rahul Singh submitted a Licence Renewal request (APP-2026-0003).</div><small className="text-muted">2 hours ago</small></div></div>
            <div className="notice-item unread"><div className="stat-icon ic-blue"><i className="bi bi-building"></i></div><div><b>School awaiting verification</b><div className="text-muted">Prime Drive School requested registration approval.</div><small className="text-muted">5 hours ago</small></div></div>
            <div className="notice-item unread"><div className="stat-icon ic-blue"><i className="bi bi-exclamation-triangle"></i></div><div><b>Vehicle registration expired</b><div className="text-muted">MH12 AB 4213 (Mahindra Bolero Pik-Up) is past its validity date.</div><small className="text-muted">Yesterday</small></div></div>
            <div className="notice-item"><div className="stat-icon ic-blue"><i className="bi bi-check2-circle"></i></div><div><b>Application approved</b><div className="text-muted">APP-2026-0015 for Priya Nair was approved.</div><small className="text-muted">Yesterday</small></div></div>
            <div className="notice-item"><div className="stat-icon ic-blue"><i className="bi bi-mortarboard"></i></div><div><b>Training completed</b><div className="text-muted">Divya Patel completed training TR-5003.</div><small className="text-muted">2 days ago</small></div></div>
            <div className="notice-item"><div className="stat-icon ic-blue"><i className="bi bi-person-plus"></i></div><div><b>New user registered</b><div className="text-muted">Gaurav Wagh created an account.</div><small className="text-muted">3 days ago</small></div></div>
          </div>
    </>
  )
}
