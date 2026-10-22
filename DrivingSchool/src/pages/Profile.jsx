import PageHeader from "../components/PageHeader.jsx";

export default function Profile() {
  return (
    <>
      <PageHeader title="School Profile" subtitle="Keep your school details up to date." />

      <div className="grid-profile">
        <section className="card">
          <div className="card-head"><h2>School Details</h2></div>
          <div className="form-grid">
            <label className="field">School name<input className="input" defaultValue="SafeWheels Driving School" /></label>
            <label className="field">Owner / Principal<input className="input" defaultValue="Rajesh Kulkarni" /></label>
            <label className="field">Email<input type="email" className="input" defaultValue="contact@safewheels.in" /></label>
            <label className="field">Phone<input className="input" defaultValue="98220 55012" /></label>
            <label className="field span-2">Address<input className="input" defaultValue="12, FC Road, Shivajinagar, Pune, Maharashtra 411004" /></label>
            <label className="field">Registration no. (set by RTO)<input className="input" defaultValue="MH12/DS/2025/0481" disabled /></label>
            <label className="field">Jurisdiction RTO<input className="input" defaultValue="RTO Pune (MH-12)" disabled /></label>
            <div className="field span-3"><button className="btn btn-primary">Save changes</button></div>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2>Admin Verification</h2></div>
          <div className="verify">
            <div className="verify-icon">✓</div>
            <div><div className="strong">Your school is verified</div><span className="badge badge-green">Verified</span></div>
          </div>
          <dl className="facts">
            <div><dt>Verified on</dt><dd>2025-03-14</dd></div>
            <div><dt>Licence valid till</dt><dd>2029-03-13</dd></div>
            <div><dt>Verified by</dt><dd>RTO Admin</dd></div>
          </dl>
          <p className="muted small">Verification status is managed by the RTO admin and cannot be changed by the school.</p>
        </section>
      </div>
    </>
  );
}
