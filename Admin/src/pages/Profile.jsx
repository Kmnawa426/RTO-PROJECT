export default function Profile() {
  return (
    <>
          <div className="page-head"><div><h1>Admin Profile</h1><p>Your account details.</p></div></div>
          <div className="row g-3">
            <div className="col-lg-4"><div className="panel text-center p-4"><span className="avatar lg mx-auto mb-3">RA</span><h5 className="mb-0">R. Deshmukh</h5><div className="text-muted mb-3">Administrator · Transport Department</div><span className="pill ok">Active</span></div></div>
            <div className="col-lg-8"><form className="panel p-4"><div className="row g-3">
              <div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" defaultValue="R. Deshmukh" /></div>
              <div className="col-md-6"><label className="form-label">Role</label><input className="form-control" defaultValue="Administrator" disabled /></div>
              <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" defaultValue="r.deshmukh@rto.gov.in" /></div>
              <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" defaultValue="+91 9800000000" /></div>
              <div className="col-12"><label className="form-label">Office</label><input className="form-control" defaultValue="Regional Transport Office, Mumbai" /></div>
              <div className="col-12"><button type="button" className="btn btn-primary">Save changes</button></div>
            </div></form></div>
          </div>
    </>
  )
}
