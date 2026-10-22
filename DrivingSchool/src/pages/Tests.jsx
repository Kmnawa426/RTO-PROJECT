import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";

const HOST = "http://localhost:7002";

export default function Tests() {
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    try {
      const token = localStorage.getItem("SchoolToken");

      const response = await axios.get(`${HOST}/School/ViewProgress`, {
        headers: { "auth-token": token },
      });

      setStudents(
        response.data.Progress.filter(
          (student) => student.ReadyForTest === true
        )
      );

      const testResponse = await axios.get(
        `${HOST}/School/ViewDrivingTests`,
        { headers: { "auth-token": token } }
      );

      setTests(testResponse.data.DrivingTests || []);
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load driving test details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading driving tests...</p>;

  return (
    <>
      <PageHeader
        title="Driving Tests"
        subtitle="View students marked ready for their RTO test and their appointments."
      />

      <div className="callout">
        The driving school can mark students ready for testing and view
        appointments. Only the RTO can manage test results and issue licences.
      </div>

      {message && <p className="text-danger">{message}</p>}

      <div className="stats two">
        <StatCard
          label="Ready Students"
          value={students.length}
          hint="Marked ready by the driving school"
          tone="green"
        />

        <StatCard
          label="Scheduled Tests"
          value={
            tests.filter(
              (test) =>
                test.TestStatus === "Scheduled" ||
                test.TestStatus === "Rescheduled"
            ).length
          }
          hint="Upcoming practical tests"
          tone="blue"
        />
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Students Ready for Test</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Training Progress</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td className="strong">
                      {student.Student || "Student"}
                    </td>

                    <td>
                      <div className="pbar-wrap">
                        <div className="pbar">
                          <div
                            className="pbar-fill"
                            style={{
                              width: `${student.ProgressPercentage || 0}%`,
                            }}
                          />
                        </div>

                        <span className="pbar-num">
                          {student.ProgressPercentage || 0}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-green">Ready for Test</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No students are ready for testing yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Test Appointments</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test._id}>
                    <td className="strong">
                      {test.User?.FullName || "Student"}
                    </td>

                    <td>
                      {new Date(test.TestDate).toLocaleDateString("en-IN")}
                    </td>

                    <td>{test.TestTime}</td>

                    <td>
                      <span className="badge badge-blue">
                        {test.TestStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No driving test appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
