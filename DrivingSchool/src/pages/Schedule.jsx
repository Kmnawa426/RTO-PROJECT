import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import PageHeader from "../components/PageHeader.jsx";
import { host } from "../../../Admin/src/Context/MyContext.jsx";

const empty = { Topic: "", Application: "", Date: "", StartTime: "", EndTime: "" };

const STATUS_BADGE = {
  Scheduled: "badge-yellow",
  Completed: "badge-green",
  Cancelled: "badge-red",
};

const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

// Inline styles so the modal works even without extra CSS
const modalStyles = {
  backdrop: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  },
  box: {
    background: "#fff", color: "#111827", borderRadius: 12, padding: 20,
    width: "min(460px, 100%)", maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  details: { display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px 12px", margin: "16px 0" },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
};

export default function Schedule() {
  const token = localStorage.getItem("SchoolToken");
  const headers = { "auth-token": token };

  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState(empty);
  const [selected, setSelected] = useState(null); // session shown in the modal

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getStudents = () =>
    axios.get(`${host}/School/ViewStudents`, { headers })
      .then((res) => setStudents(res.data.Students || []))
      .catch(console.log);

  const getSessions = () =>
    axios.get(`${host}/School/ViewSessions`, { headers })
      .then((res) => setSessions(res.data.Sessions || []))
      .catch(console.log);

  useEffect(() => {
    getStudents();
    getSessions();
  }, []);

  // Close the modal with Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const AddSession = () => {
    if (!form.Application || !form.Date || !form.StartTime || !form.EndTime) {
      return alert("Select a student, date, start and end time");
    }
    axios.post(`${host}/School/AddSession`, form, { headers })
      .then(() => { setForm(empty); getSessions(); })
      .catch((err) => alert(err.response?.data?.message || "Failed"));
  };

  const UpdateStatus = (s, Status) => {
    if (Status === "Cancelled" && !window.confirm("Cancel this session? The student will see it as cancelled.")) {
      return;
    }
    axios.put(
      `${host}/School/UpdateSessionStatus/${s.TrainingId}/${s._id}`,
      { Status },
      { headers }
    )
      .then(() => { setSelected(null); getSessions(); })
      .catch((err) => alert(err.response?.data?.message || "Failed"));
  };

  return (
    <>
      <PageHeader title="Training Schedule" subtitle="Plan sessions for your enrolled students." />

      <section className="card">
        <div className="card-head"><h2>Create Session</h2></div>
        <div className="form-grid">
          <label className="field span-2">Lesson title
            <input className="input" name="Topic" value={form.Topic} onChange={onChange}
              placeholder="e.g. Reverse parking" />
          </label>
          <label className="field">Student *
            <select className="select" name="Application" value={form.Application} onChange={onChange}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.User?.FullName}</option>
              ))}
            </select>
          </label>
          <label className="field">Date
            <input type="date" className="input" name="Date" value={form.Date} onChange={onChange} />
          </label>
          <label className="field">Start time
            <input type="time" className="input" name="StartTime" value={form.StartTime} onChange={onChange} />
          </label>
          <label className="field">End time
            <input type="time" className="input" name="EndTime" value={form.EndTime} onChange={onChange} />
          </label>
          <div className="field end">
            <button className="btn btn-primary" onClick={AddSession}>Add Session</button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Scheduled Sessions</h2></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lesson</th><th>Student</th><th>When</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 && (
                <tr><td colSpan={5} className="muted">No sessions scheduled.</td></tr>
              )}
              {sessions.map((s) => (
                <tr key={s._id}>
                  <td className="strong">{s.Topic || "—"}</td>
                  <td>{s.Student}</td>
                  <td>{formatDate(s.Date)} · {s.StartTime}–{s.EndTime}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[s.Status] || ""}`}>{s.Status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => setSelected(s)}>View</button>{" "}
                    {s.Status === "Scheduled" && (
                      <button className="btn btn-danger btn-sm" onClick={() => UpdateStatus(s, "Cancelled")}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selected &&
        createPortal(
          <div style={modalStyles.backdrop} onClick={() => setSelected(null)}>
            <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>
              <div style={modalStyles.head}>
                <h2 style={{ margin: 0 }}>Session Details</h2>
                <button className="btn btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>

              <dl style={modalStyles.details}>
                <dt style={{ color: "#6b7280" }}>Lesson</dt>
                <dd style={{ margin: 0 }}>{selected.Topic || "—"}</dd>
                <dt style={{ color: "#6b7280" }}>Student</dt>
                <dd style={{ margin: 0 }}>{selected.Student}</dd>
                <dt style={{ color: "#6b7280" }}>Date</dt>
                <dd style={{ margin: 0 }}>{formatDate(selected.Date)}</dd>
                <dt style={{ color: "#6b7280" }}>Time</dt>
                <dd style={{ margin: 0 }}>{selected.StartTime} – {selected.EndTime}</dd>
                <dt style={{ color: "#6b7280" }}>Status</dt>
                <dd style={{ margin: 0 }}>
                  <span className={`badge ${STATUS_BADGE[selected.Status] || ""}`}>
                    {selected.Status}
                  </span>
                </dd>
              </dl>

              {selected.Status === "Scheduled" ? (
                <div style={modalStyles.actions}>
                  <button className="btn btn-primary" onClick={() => UpdateStatus(selected, "Completed")}>
                    Mark Completed
                  </button>
                  <button className="btn btn-danger" onClick={() => UpdateStatus(selected, "Cancelled")}>
                    Cancel Session
                  </button>
                </div>
              ) : (
                <p className="muted">
                  This session is {selected.Status.toLowerCase()} and can no longer be changed.
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}