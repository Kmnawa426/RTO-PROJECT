import { useEffect, useState } from "react";
import axios from "axios";
import { host } from "../Context/MyContext";

const BADGE = {
  Scheduled: "warn",
  Passed: "ok",
  Failed: "danger",
  Absent: "danger",
  Rescheduled: "warn",
  Cancelled: "danger",
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-IN");
};

export default function DrivingTestManagement() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedResult, setSelectedResult] = useState("Passed");
  const [resultRemarks, setResultRemarks] = useState("");

  const loadData = async () => {
    try {
      setError("");

      const token = localStorage.getItem("AdminToken");

      const response = await axios.get(
        `${host}/Admin/ViewAllDrivingTests`,
        {
          headers: { "auth-token": token },
        }
      );

      setTests(
        response.data.DrivingTests ||
        response.data.Tests ||
        []
      );
    } catch (err) {
      console.error("Load driving tests:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load driving tests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openResultEditor = (test) => {
    setSelectedTest(test);
    setSelectedResult(
      ["Passed", "Failed"].includes(test.TestStatus)
        ? test.TestStatus
        : "Passed"
    );
    setResultRemarks(test.TestRemarks || "");
  };

  const updateResult = async () => {
    if (!selectedTest || saving) return;

    if (!["Passed", "Failed"].includes(selectedResult)) {
      alert("Choose Passed or Failed.");
      return;
    }

    if (selectedResult === "Failed" && !resultRemarks.trim()) {
      alert("Please enter remarks for the failed test.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("AdminToken");

      await axios.put(
        `${host}/Admin/UpdateDrivingTestStatus/${selectedTest._id}`,
        {
          TestStatus: selectedResult,
          TestRemarks: resultRemarks.trim(),
        },
        {
          headers: { "auth-token": token },
        }
      );

      alert("Driving test result updated successfully.");

      setSelectedTest(null);
      await loadData();
    } catch (err) {
      console.error("Update test result:", err);
      alert(
        err.response?.data?.message ||
        "Failed to update driving test result."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredTests = tests.filter((test) => {
    const query = search.trim().toLowerCase();

    const name = (test.User?.FullName || "").toLowerCase();

    const applicationId = (
      test.Application?._id || test.Application || ""
    )
      .toString()
      .toLowerCase();

    return name.includes(query) || applicationId.includes(query);
  });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Driving Test Management</h1>
          <p>
            View scheduled practical tests and update applicants' results.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            type="search"
            className="form-control"
            placeholder="Search applicant or application ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-danger m-3">
            {error}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table rto-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Application ID</th>
                <th>Test Date</th>
                <th>Test Time</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading driving tests...
                  </td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No scheduled driving tests found.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test._id}>
                    <td>
                      {test.User?.FullName || "N/A"}
                    </td>

                    <td>
                      {test.Application?._id
                        ? test.Application._id
                            .slice(-8)
                            .toUpperCase()
                        : typeof test.Application === "string"
                          ? test.Application
                              .slice(-8)
                              .toUpperCase()
                          : "N/A"}
                    </td>

                    <td>{formatDate(test.TestDate)}</td>
                    <td>{test.TestTime || "N/A"}</td>

                    <td>
                      <span
                        className={`pill ${
                          BADGE[test.TestStatus] || "warn"
                        }`}
                      >
                        {test.TestStatus || "Scheduled"}
                      </span>
                    </td>

                    <td>
                      {["Passed", "Failed"].includes(test.TestStatus) ? (
                        <span className="text-muted">
                          Result recorded
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#testResultModal"
                          onClick={() => openResultEditor(test)}
                        >
                          Update Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          Showing {filteredTests.length} of {tests.length} tests
        </div>
      </section>

      <div
        className="modal fade"
        id="testResultModal"
        tabIndex="-1"
        aria-labelledby="testResultModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="testResultModalTitle">
                Update Driving Test Result
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              {selectedTest && (
                <>
                  <p>
                    <strong>Applicant:</strong>{" "}
                    {selectedTest.User?.FullName || "N/A"}
                  </p>

                  <p>
                    <strong>Application ID:</strong>{" "}
                    {selectedTest.Application?._id
                      ? selectedTest.Application._id
                          .slice(-8)
                          .toUpperCase()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Test Date:</strong>{" "}
                    {formatDate(selectedTest.TestDate)} ·{" "}
                    {selectedTest.TestTime || "N/A"}
                  </p>

                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="TestStatus"
                    >
                      Test Result
                    </label>

                    <select
                      id="TestStatus"
                      className="form-select"
                      value={selectedResult}
                      onChange={(e) =>
                        setSelectedResult(e.target.value)
                      }
                    >
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="form-label"
                      htmlFor="ResultRemarks"
                    >
                      Remarks {selectedResult === "Failed" ? "*" : ""}
                    </label>

                    <textarea
                      id="ResultRemarks"
                      className="form-control"
                      rows={3}
                      maxLength={1000}
                      required={selectedResult === "Failed"}
                      value={resultRemarks}
                      onChange={(e) =>
                        setResultRemarks(e.target.value)
                      }
                      placeholder={
                        selectedResult === "Failed"
                          ? "Enter the reason for failure"
                          : "Optional remarks"
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={updateResult}
                disabled={saving || !selectedTest}
              >
                {saving ? "Saving..." : "Save Result"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
