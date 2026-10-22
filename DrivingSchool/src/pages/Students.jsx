import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import axios from "axios";
import { host } from "../../../Admin/src/Context/MyContext";

const TABS = ["All", "Pending", "Accepted", "Rejected"];

// Map your ApplicationStatus values to the tab/badge categories
const getEnrolment = (status) => {
  if (status === "Documents Rejected") return "Rejected";
  if (status === "Submitted" || status === "Under Verification") return "Pending";
  return "Accepted"; // Approved, Training, Ready for Test, Test..., Completed
};

const BADGE = {
  Pending: "badge-yellow",
  Accepted: "badge-green",
  Rejected: "badge-red",
};

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");

export default function Students() {
  const token = localStorage.getItem("SchoolToken");
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("All");

  const getStudents = () => {
    axios
      .get(`${host}/School/ViewStudents`, { headers: { "auth-token": token } })
      .then((res) => setStudents(res.data.Students || []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getStudents();
  }, []);

  const filtered = students.filter(
    (s) => tab === "All" || getEnrolment(s.ApplicationStatus) === tab
  );

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage enrolment requests and assign training plans to your students."
      />

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Class</th><th>Applied</th>
                <th>Enrolment</th><th>Training</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="muted">No students found.</td></tr>
              )}

              {filtered.map((sdata) => {
                const enrolment = getEnrolment(sdata.ApplicationStatus);
                return (
                  <tr key={sdata._id}>
                    <td>
                      <div className="student-cell">
                        <div className="avatar sm">{initials(sdata.User?.FullName)}</div>
                        <div>
                          <div className="strong">{sdata.User?.FullName}</div>
                          <div className="muted small">
                            {sdata.User?.Phone} · {sdata.User?.Email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="chip">{sdata.VehicleType}</span></td>
                    <td>{formatDate(sdata.DateOfApplication)}</td>
                    <td>
                      <span className={`badge ${BADGE[enrolment]}`}>{enrolment}</span>
                    </td>
                    <td>
                      <select className="select" defaultValue="">
                        <option value="">Assign training…</option>
                        <option>LMV Basic (20 days)</option>
                        <option>LMV Advanced (30 days)</option>
                        <option>Two-Wheeler (10 days)</option>
                        <option>LMV-Transport (45 days)</option>
                      </select>
                    </td>
                    <td><span className="muted">No action</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}