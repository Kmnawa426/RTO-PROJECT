
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { host } from "../Context/MyContext";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-IN");
};

export default function Licences() {
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [issueFilter, setIssueFilter] = useState("Unissued");
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");

  const getApplications = async () => {
    try {
      setError("");
      const res = await axios.get(
        `${host}/Admin/ViewLicenceEligibleApplications`
      );

      setApplicants(res.data.Applications || []);
    } catch (err) {
      console.error("Fetch licence applications:", err);
      setError(
        err.response?.data?.message ||
          "Could not load licence applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  const filteredApplicants = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return applicants.filter((app) => {
      const issued = Boolean(app.LicenceIssuedAt);

      const matchesSearch =
        !query ||
        (app._id || "").toLowerCase().includes(query) ||
        (app.User?.FullName || "").toLowerCase().includes(query) ||
        (app.LicenceNumber || "").toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory ||
        app.ApplicationType === selectedCategory;

      const matchesIssue =
        !issueFilter ||
        (issueFilter === "Issued" && issued) ||
        (issueFilter === "Unissued" && !issued);

      return matchesSearch && matchesCategory && matchesIssue;
    });
  }, [applicants, searchText, selectedCategory, issueFilter]);

  const openDetails = (app) => {
    setSelected(app);
    setLicenceNumber(app.LicenceNumber || "");
  };

  const issueLicence = async () => {
    if (!selected || issuing) return;

    if (selected.LicenceIssuedAt) {
      alert("This licence has already been issued.");
      return;
    }

    if (!licenceNumber.trim()) {
      alert("Enter the driving licence number.");
      return;
    }

    if (
      !window.confirm(
        `Issue driving licence ${licenceNumber.trim()} to ${
          selected.User?.FullName || "this applicant"
        }?`
      )
    ) {
      return;
    }

    try {
      setIssuing(true);

      const res = await axios.post(
        `${host}/Admin/IssueDrivingLicence/${selected._id}`,
        { LicenceNumber: licenceNumber.trim() }
      );

      alert(res.data.message || "Driving licence issued successfully.");

      await getApplications();

      // Refresh selected application and close the modal.
      setSelected(null);
      document.getElementById("licenceModalClose")?.click();
    } catch (err) {
      console.error("Issue licence:", err);
      alert(
        err.response?.data?.message ||
          "Failed to issue the driving licence."
      );
    } finally {
      setIssuing(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Driving Licences</h1>
          <p>
            Issue licences to eligible applicants and view previously
            issued licences.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              className="form-control"
              type="search"
              placeholder="Search applicant, application or licence number"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Learner Licence">Learner Licence</option>
            <option value="Driving Licence">Driving Licence</option>
          </select>

          <select
            className="form-select"
            value={issueFilter}
            onChange={(e) => setIssueFilter(e.target.value)}
          >
            <option value="">All licences</option>
            <option value="Unissued">Not issued</option>
            <option value="Issued">Already issued</option>
          </select>
        </div>

        {error && (
          <div className="alert alert-danger m-3">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={getApplications}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table rto-table">
            <thead>
              <tr>
                <th>Application No.</th>
                <th>Applicant</th>
                <th>Category</th>
                <th>Test Result</th>
                <th>Licence Status</th>
                <th>Issue Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading licence applications...
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No matching licence applications found.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const issued = Boolean(app.LicenceIssuedAt);

                  return (
                    <tr key={app._id}>
                      <td>
                        <span className="ref">
                          {app._id.slice(0, 4).toUpperCase()}-
                          {app._id.slice(4, 8).toUpperCase()}
                        </span>
                      </td>

                      <td>{app.User?.FullName || "N/A"}</td>

                      <td>
                        <span className="tag">
                          {app.ApplicationType || "N/A"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`pill ${
                            app.PracticalTestStatus === "PASSED" ||
                            app.PracticalTestStatus === "Passed"
                              ? "ok"
                              : "warn"
                          }`}
                        >
                          {app.PracticalTestStatus || "Not available"}
                        </span>
                      </td>

                      <td>
                        <span className={`pill ${issued ? "ok" : "warn"}`}>
                          {issued ? "Issued" : "Not issued"}
                        </span>
                      </td>

                      <td>{formatDate(app.LicenceIssuedAt)}</td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#licenceModal"
                          onClick={() => openDetails(app)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-foot">
          <span>
            Showing {filteredApplicants.length} of {applicants.length} records
          </span>
        </div>
      </section>

      <div
        className="modal fade"
        id="licenceModal"
        tabIndex="-1"
        aria-labelledby="licenceModalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="licenceModalTitle">
                Driving Licence Details
              </h5>
              <button
                type="button"
                className="btn-close"
                id="licenceModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              {selected && (
                <>
                  <div className="kv">
                    <div>
                      <small>Applicant</small>
                      <div>{selected.User?.FullName || "N/A"}</div>
                    </div>

                    <div>
                      <small>Application reference</small>
                      <div>{selected._id}</div>
                    </div>

                    <div>
                      <small>Application type</small>
                      <div>{selected.ApplicationType || "N/A"}</div>
                    </div>

                    <div>
                      <small>Vehicle category</small>
                      <div>{selected.VehicleType || "N/A"}</div>
                    </div>

                    <div>
                      <small>Driving test</small>
                      <div>
                        {selected.PracticalTestStatus || "Not available"}
                      </div>
                    </div>

                    <div>
                      <small>Licence issue date</small>
                      <div>{formatDate(selected.LicenceIssuedAt)}</div>
                    </div>
                  </div>

                  {selected.LicenceIssuedAt ? (
                    <div className="alert alert-success mt-3">
                      <strong>Licence issued</strong>
                      <div>
                        Licence number: {selected.LicenceNumber || "N/A"}
                      </div>

                      {selected.LicencePdfUrl && (
                        <a
                          className="btn btn-sm btn-outline-success mt-2"
                          href={selected.LicencePdfUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View licence document
                        </a>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="alert alert-info mt-3">
                        A licence may only be issued after the driving test
                        is passed and all required checks are complete.
                      </div>

                      <label
                        htmlFor="licenceNumber"
                        className="form-label fw-semibold"
                      >
                        Driving licence number
                      </label>

                      <input
                        id="licenceNumber"
                        className="form-control"
                        value={licenceNumber}
                        onChange={(e) => setLicenceNumber(e.target.value)}
                        placeholder="Enter authorised licence number"
                        maxLength={30}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              {selected &&
                !selected.LicenceIssuedAt && (
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={issueLicence}
                    disabled={
                      issuing ||
                      !licenceNumber.trim() ||
                      !(
                        selected.PracticalTestStatus === "PASSED" ||
                        selected.PracticalTestStatus === "Passed"
                      )
                    }
                  >
                    {issuing ? "Issuing..." : "Issue Driving Licence"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
