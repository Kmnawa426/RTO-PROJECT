import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Welcome back 👋" subtitle="Here's what's happening at your school today." />

      <div className="stats">
        <StatCard label="Total Students" value="1" hint="1 pending request" tone="blue" />
        <StatCard label="Active Training" value="1" hint="Currently in progress" tone="amber" />
        <StatCard label="Upcoming Sessions" value="1" hint="Next 7 days" tone="purple" />
        <StatCard label="Completed Training" value="1" hint="Ready for RTO test" tone="green" />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2>Upcoming Sessions</h2><Link to="/schedule" className="link">View all</Link></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Session</th><th>Student</th><th>Date &amp; Time</th><th>Instructor</th></tr></thead>
              <tbody>
                <tr>
                  <td className="strong">City traffic driving</td>
                  <td>Aarav Mehta</td>
                  <td>2026-10-17 · 08:00</td>
                  <td>Ravi Kumar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2>Enrolment Requests</h2><span className="badge badge-amber">Pending</span></div>
          <ul className="request-list">
            <li>
              <div>
                <div className="strong">Sneha Kulkarni</div>
                <div className="muted small">LMV · 2026-10-12</div>
              </div>
              <Link to="/students" className="btn btn-outline btn-sm">Review</Link>
            </li>
          </ul>
        </section>
      </div>

      <section className="card">
        <div className="card-head"><h2>Training Progress Snapshot</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Training</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>
              <tr>
                <td className="strong">Aarav Mehta</td>
                <td>LMV Basic (20 days)</td>
                <td>
                  <div className="pbar-wrap"><div className="pbar"><div className="pbar-fill" style={{ width: "91%" }} /></div><span className="pbar-num">91%</span></div>
                </td>
                <td><span className="badge badge-blue">In Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
