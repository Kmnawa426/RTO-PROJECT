import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader.jsx";
import { host } from "../../../Admin/src/Context/MyContext.jsx";

const STATUS_BADGE = {
  "Not Started": "badge-yellow",
  "In Progress": "badge-blue",
  "Completed": "badge-green",
  "Ready for Test": "badge-green",
};

export default function Progress() {
  const token = localStorage.getItem("SchoolToken");
  const headers = { "auth-token": token };

  const [rows, setRows] = useState([]);

  const getProgress = () =>
    axios.get(`${host}/School/ViewProgress`, { headers })
      .then((res) => setRows(res.data.Progress || []))
      .catch(console.log);

  useEffect(() => {
    getProgress();
  }, []);

  const markReady = (r) => {
    if (!window.confirm(`Mark ${r.Student} as ready for the test?`)) return;
    axios.put(`${host}/School/ReadyForTest/${r.Application}`, {}, { headers })
      .then(getProgress)
      .catch((err) => alert(err.response?.data?.message || "Failed"));
  };

  return (
    <>
      <PageHeader
        title="Training Progress"
        subtitle="Progress and status update automatically as you complete sessions."
      />
      <p className="muted count-line">
        {rows.length} {rows.length === 1 ? "student" : "students"} in training
      </p>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Sessions</th><th>Progress</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="muted">No students in training yet.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="strong">{r.Student}</div>
                    <div className="muted small">{r.Phone}</div>
                  </td>
                  <td>{r.Completed}/{r.Total}</td>
                  <td>
                    <div className="pbar-wrap">
                      <div className="pbar">
                        <div className="pbar-fill" style={{ width: `${r.ProgressPercentage}%` }} />
                      </div>
                      <span className="pbar-num">{r.ProgressPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.TrainingStatus] || ""}`}>
                      {r.TrainingStatus}
                    </span>
                  </td>
                  <td>
                    {r.ReadyForTest ? (
                      <span className="muted">Ready</span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={r.Total === 0 || r.Completed < r.Total}
                        onClick={() => markReady(r)}
                      >
                        Ready for test
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}