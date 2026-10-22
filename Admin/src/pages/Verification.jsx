
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { host } from "../Context/MyContext";

const DOCUMENT_STATUS = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

const STATUS_BADGE = {
  Submitted: "warn",
  "Under Verification": "warn",
  Approved: "ok",
  Completed: "ok",
  Rejected: "danger",
  "Documents Rejected": "danger",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "N/A"
    : parsed.toLocaleDateString("en-IN");
};

export default function Verification() {
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDocumentStatus, setSelectedDocumentStatus] =
    useState("Unverified");

  const [verificationMode, setVerificationMode] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = async () => {
    try {
      setError("");

      const res = await axios.get(`${host}/Admin/ViewApplication`);
      const list = res.data.Application || [];

      setApplicants(list);

      // Keep the selected application synchronized with fresh server data.
      setSelected((current) => {
        if (!current) return null;
        return list.find((app) => app._id === current._id) || current;
      });
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError(
        err.response?.data?.message || "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const filteredApplicants = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return applicants.filter((app) => {
      const documentStatus =
        app.DocumentVerification || DOCUMENT_STATUS.PENDING;

      const matchesSearch =
        !query ||
        (app.User?.FullName || "").toLowerCase().includes(query) ||
        (app._id || "").toLowerCase().includes(query) ||
        (app.User?.Email || "").toLowerCase().includes(query) ||
        (app.User?.Phone || "").toLowerCase().includes(query);

      const matchesType =
        !selectedType || app.ApplicationType === selectedType;

      const matchesApplicationStatus =
        !selectedStatus || app.ApplicationStatus === selectedStatus;

      let matchesDocumentStatus = true;

      if (selectedDocumentStatus === "Unverified") {
        // Default queue: pending and rejected documents only.
        matchesDocumentStatus =
          documentStatus !== DOCUMENT_STATUS.VERIFIED;
      } else if (selectedDocumentStatus) {
        matchesDocumentStatus =
          documentStatus === selectedDocumentStatus;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesApplicationStatus &&
        matchesDocumentStatus
      );
    });
  }, [
    applicants,
    searchText,
    selectedType,
    selectedStatus,
    selectedDocumentStatus,
  ]);

  const openReview = (application) => {
    setSelected(application);
    setVerificationMode(false);
    setRejectMode(false);
    setAdminRemarks("");
    setVerifying(false);
    setUpdatingStatus(false);
  };

  const closeReview = () => {
    if (verifying || updatingStatus) return;

    setSelected(null);
    setVerificationMode(false);
    setRejectMode(false);
    setAdminRemarks("");
  };

  const updateStatus = async (id, Status) => {
    if (!selected) return;

    if (
      (Status === "Approved" || Status === "Rejected") &&
      selected.DocumentVerification !== DOCUMENT_STATUS.VERIFIED
    ) {
      alert("Verify the document before updating the application status.");
      return;
    }

    if (
      Status === "Rejected" &&
      !adminRemarks.trim()
    ) {
      alert("Please enter remarks before rejecting the application.");
      return;
    }

    try {
      setUpdatingStatus(true);

      const res = await axios.put(`${host}/Admin/UpdateAppStatus`, {
        id,
        Status,
        AdminRemarks: adminRemarks.trim(),
      });

      const updatedApplication = res.data.Application;

      if (updatedApplication) {
        setApplicants((previous) =>
          previous.map((app) =>
            app._id === updatedApplication._id
              ? updatedApplication
              : app
          )
        );
        setSelected(updatedApplication);
      }

      alert(res.data.message || "Application status updated.");

      // Close the Bootstrap modal after a successful status update.
      const closeButton = document.querySelector(
        "#reviewModal [data-bs-dismiss='modal']"
      );

      closeButton?.click();
    } catch (err) {
      console.error("Update application status error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const verifyDocument = async (DocumentStatus) => {
    if (!selected || verifying) return;

    if (
      DocumentStatus === DOCUMENT_STATUS.REJECTED &&
      !adminRemarks.trim()
    ) {
      alert("Please enter remarks before rejecting the document.");
      return;
    }

    try {
      setVerifying(true);

      const res = await axios.put(`${host}/Admin/VerifyDocument`, {
        DocumentStatus,
        id: selected._id,
        AdminRemarks: adminRemarks.trim(),
      });

      const updatedApplication = res.data.Application;

      if (updatedApplication) {
        setApplicants((previous) =>
          previous.map((app) =>
            app._id === updatedApplication._id
              ? updatedApplication
              : app
          )
        );

        setSelected(updatedApplication);
      }

      alert(res.data.message || "Document verification updated.");

      setVerificationMode(false);
      setRejectMode(false);
      setAdminRemarks("");
    } catch (err) {
      console.error("Verify document error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update document verification."
      );
    } finally {
      setVerifying(false);
    }
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedDocumentStatus("Unverified");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Document Verification</h1>
          <p>
            Review submitted documents and manage application verification.
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
              placeholder="Search applicant, reference, email or phone"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search applications"
            />
          </div>

          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by application type"
          >
            <option value="">All application types</option>
            <option value="Learner Licence">Learner Licence</option>
            <option value="Driving Licence">Driving Licence</option>
          </select>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by application status"
          >
            <option value="">All application statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Verification">Under Verification</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Documents Rejected">Documents Rejected</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="form-select"
            value={selectedDocumentStatus}
            onChange={(e) => setSelectedDocumentStatus(e.target.value)}
            aria-label="Filter by document verification status"
          >
            <option value="Unverified">
              Not yet verified
            </option>
            <option value="">All document statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchApplicants}
            >
              Retry
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table rto-table">
            <thead>
              <tr>
                <th>Application type</th>
                <th>Reference</th>
                <th>Applicant</th>
                <th>Submitted</th>
                <th>Document status</th>
                <th>Application status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="fw-semibold">
                      No matching applications found.
                    </div>
                    <small className="text-muted">
                      Try changing the filters or search terms.
                    </small>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const documentStatus =
                    app.DocumentVerification || "Pending";

                  return (
                    <tr key={app._id}>
                      <td>
                        <span className="text-muted">
                          <i
                            className="bi bi-person-vcard me-1"
                            aria-hidden="true"
                          ></i>
                          {app.ApplicationType || "N/A"}
                        </span>
                      </td>

                      <td>
                        <b>
                          {app._id.slice(0, 4).toUpperCase()}-
                          {app._id.slice(4, 8).toUpperCase()}
                        </b>
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {app.User?.FullName || "N/A"}
                        </div>
                        <small className="text-muted">
                          {app.User?.Email || ""}
                        </small>
                      </td>

                      <td>{formatDate(app.createdAt)}</td>

                      <td>
                        <span
                          className={`pill ${
                            documentStatus === "Verified"
                              ? "ok"
                              : documentStatus === "Rejected"
                                ? "danger"
                                : "warn"
                          }`}
                        >
                          {documentStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`pill ${
                            STATUS_BADGE[app.ApplicationStatus] || "warn"
                          }`}
                        >
                          {app.ApplicationStatus || "Pending"}
                        </span>
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#reviewModal"
                          onClick={() => openReview(app)}
                        >
                          <i
                            className="bi bi-eye me-1"
                            aria-hidden="true"
                          ></i>
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
            Showing {filteredApplicants.length} of {applicants.length}{" "}
            applications
          </span>
          <span className="text-muted">
            {applicants.filter(
              (app) => app.DocumentVerification !== "Verified"
            ).length}{" "}
            not yet verified
          </span>
        </div>
      </section>

      {/* Application and document review modal */}
      <div
        className="modal fade"
        id="reviewModal"
        tabIndex="-1"
        aria-labelledby="reviewModalTitle"
        aria-hidden="true"
        onHidden={undefined}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reviewModalTitle">
                {verificationMode
                  ? "Document Verification"
                  : "Application Review"}
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeReview}
                disabled={verifying || updatingStatus}
              ></button>
            </div>

            <div className="modal-body">
              {!selected ? (
                <p className="text-muted">
                  No application selected.
                </p>
              ) : verificationMode ? (
                <>
                  <p className="text-muted">
                    Inspect the uploaded document before verifying or
                    rejecting it.
                  </p>

                  <div className="card border-0 bg-light mb-3">
                    <div className="card-body">
                      <div className="mb-3">
                        <small className="text-muted">Applicant</small>
                        <div className="fw-semibold">
                          {selected.User?.FullName || "N/A"}
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">Document type</small>
                        <div className="fw-semibold">
                          {selected.DocumentName || "N/A"}
                        </div>
                      </div>

                      <div>
                        <small className="text-muted">
                          Current document status
                        </small>
                        <div className="fw-semibold">
                          {selected.DocumentVerification || "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selected.DocumentImage ? (
                    <div className="text-center mb-4">
                      <a
                        href={selected.DocumentImage}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={selected.DocumentImage}
                          alt="Applicant's uploaded document"
                          className="img-fluid rounded border"
                          style={{
                            maxHeight: "350px",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                      <div className="form-text">
                        Select the image to open it in a new tab.
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      No document image is available for this application.
                    </div>
                  )}

                  {rejectMode && (
                    <div className="mb-3">
                      <label
                        htmlFor="adminRemarks"
                        className="form-label fw-semibold"
                      >
                        Rejection remarks{" "}
                        <span className="text-danger">*</span>
                      </label>

                      <textarea
                        id="adminRemarks"
                        className="form-control"
                        rows={4}
                        maxLength={1000}
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="Explain why the document is being rejected..."
                        disabled={verifying}
                        required
                      />

                      <div className="form-text">
                        {adminRemarks.length}/1000 characters
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="kv">
                    <div>
                      <small>Applicant</small>
                      <div>{selected.User?.FullName || "N/A"}</div>
                    </div>

                    <div>
                      <small>Application type</small>
                      <div>{selected.ApplicationType || "N/A"}</div>
                    </div>

                    <div>
                      <small>Reference</small>
                      <div>{selected._id}</div>
                    </div>

                    <div>
                      <small>Submitted on</small>
                      <div>{formatDate(selected.createdAt)}</div>
                    </div>

                    <div>
                      <small>Application status</small>
                      <div>
                        <span
                          className={`pill ${
                            STATUS_BADGE[selected.ApplicationStatus] || "warn"
                          }`}
                        >
                          {selected.ApplicationStatus || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <small>Document verification</small>
                      <div>
                        <span
                          className={`pill ${
                            selected.DocumentVerification === "Verified"
                              ? "ok"
                              : selected.DocumentVerification === "Rejected"
                                ? "danger"
                                : "warn"
                          }`}
                        >
                          {selected.DocumentVerification || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <small>Email</small>
                      <div>{selected.User?.Email || "N/A"}</div>
                    </div>

                    <div>
                      <small>Phone</small>
                      <div>{selected.User?.Phone || "N/A"}</div>
                    </div>
                  </div>

                  <div className="sec-label mt-4">
                    Submitted Documents
                  </div>

                  <div className="doc-list">
                    <div className="doc-row d-flex align-items-center gap-2 flex-wrap">
                      <i
                        className="bi bi-file-earmark-text"
                        aria-hidden="true"
                      ></i>

                      <span>{selected.DocumentName || "Document"}</span>

                      <span
                        className={`pill ${
                          selected.DocumentVerification === "Verified"
                            ? "ok"
                            : selected.DocumentVerification === "Rejected"
                              ? "danger"
                              : "warn"
                        }`}
                      >
                        {selected.DocumentVerification || "Pending"}
                      </span>

                      {selected.DocumentVerification !== "Verified" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success ms-auto"
                          onClick={() => {
                            setVerificationMode(true);
                            setRejectMode(false);
                            setAdminRemarks("");
                          }}
                        >
                          {selected.DocumentVerification === "Rejected"
                            ? "Re-verify document"
                            : "Verify document"}
                        </button>
                      )}
                    </div>
                  </div>

                  {selected.AdminRemarks && (
                    <div className="alert alert-warning mt-3">
                      <strong>Admin remarks:</strong>{" "}
                      {selected.AdminRemarks}
                    </div>
                  )}

                  <div className="sec-label mt-4">
                    Application history
                  </div>

                  <div className="timeline">
                    <div className="tl-item">
                      <div>
                        <b>Submitted</b>
                        <small>Application received</small>
                      </div>
                      <span className="when">
                        {formatDate(selected.createdAt)}
                      </span>
                    </div>

                    {selected.DocumentVerification && (
                      <div className="tl-item">
                        <div>
                          <b>Document status</b>
                          <small>
                            {selected.DocumentVerification}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              {verificationMode ? (
                <>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => {
                      setVerificationMode(false);
                      setRejectMode(false);
                      setAdminRemarks("");
                    }}
                    disabled={verifying}
                  >
                    Back
                  </button>

                  {!rejectMode ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setRejectMode(true)}
                        disabled={verifying}
                      >
                        Reject document
                      </button>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          verifyDocument(DOCUMENT_STATUS.VERIFIED)
                        }
                        disabled={verifying || !selected.DocumentImage}
                        title={
                          !selected.DocumentImage
                            ? "An uploaded document is required"
                            : "Verify document"
                        }
                      >
                        {verifying ? "Saving..." : "Verify document"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setRejectMode(false);
                          setAdminRemarks("");
                        }}
                        disabled={verifying}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          verifyDocument(DOCUMENT_STATUS.REJECTED)
                        }
                        disabled={verifying || !adminRemarks.trim()}
                      >
                        {verifying ? "Saving..." : "Confirm rejection"}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    data-bs-dismiss="modal"
                    onClick={closeReview}
                    disabled={updatingStatus}
                  >
                    Close
                  </button>

                  {selected?.ApplicationStatus === "Submitted" && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        updateStatus(selected._id, "Under Verification")
                      }
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? "Updating..." : "Start review"}
                    </button>
                  )}

                  {selected?.ApplicationStatus === "Under Verification" &&
                    selected?.DocumentVerification === "Verified" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            updateStatus(selected._id, "Rejected")
                          }
                          disabled={updatingStatus}
                        >
                          Reject application
                        </button>

                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            updateStatus(selected._id, "Approved")
                          }
                          disabled={updatingStatus}
                        >
                          Approve application
                        </button>
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
