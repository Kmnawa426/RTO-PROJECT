export default function Settings() {
  return (
    <>
          <div className="page-head"><div><h1>Settings</h1><p>Portal preferences.</p></div></div>
          <div className="panel p-4" style={{ maxWidth: '640px' }}>
            <div className="form-check form-switch py-2"><input className="form-check-input" type="checkbox" id="s1" defaultChecked /><label className="form-check-label" htmlFor="s1"><b>Email alerts for new applications</b><div className="text-muted small">Send an email when an application is submitted.</div></label></div>
            <div className="form-check form-switch py-2"><input className="form-check-input" type="checkbox" id="s2" defaultChecked /><label className="form-check-label" htmlFor="s2"><b>Notify on school registrations</b><div className="text-muted small">Alert when a driving school requests verification.</div></label></div>
            <div className="form-check form-switch py-2"><input className="form-check-input" type="checkbox" id="s3" defaultChecked /><label className="form-check-label" htmlFor="s3"><b>Require all documents verified before approval</b><div className="text-muted small">Stops approvals until every document is verified.</div></label></div>
            <div className="form-check form-switch py-2"><input className="form-check-input" type="checkbox" id="s4" /><label className="form-check-label" htmlFor="s4"><b>Weekly summary report</b><div className="text-muted small">Email a weekly summary every Monday.</div></label></div>
            <div className="mt-3"><button className="btn btn-primary">Save settings</button></div>
          </div>
    </>
  )
}
