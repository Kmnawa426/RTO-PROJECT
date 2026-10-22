
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { host } from "../../../Admin/src/Context/MyContext";

const VEHICLE_TYPES = [
  "Two Wheeler With Gear",
  "Two Wheeler Without Gear",
  "Four Wheeler",
];

const DOCUMENT_NAMES = [
  "Aadhaar Card (Prefered)",
  "Voter ID",
  "Address Proof",
  "Passport",
  "PAN Card",
];

const d = new Date();
d.setFullYear(d.getFullYear() - 16);
const MAX_DOB = d.toISOString().slice(0, 10);

export default function ApplyLicence() {
  const token = localStorage.getItem("UserToken");

  const [application, setApplication] = useState({
    VehicleType: "",
    DateOfBirth: "",
    Address: "",
    DocumentName: "",
    DocumentImage: null,
  });

  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setApplication((prev) => ({
      ...prev,
      [name]: name === "DocumentImage" ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Please log in before applying.");
      return;
    }

    if (
      !application.VehicleType ||
      !application.DateOfBirth ||
      !application.Address.trim() ||
      !application.DocumentName ||
      !application.DocumentImage
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (application.DocumentImage.size > 5 * 1024 * 1024) {
      alert("The document must be 5 MB or smaller.");
      return;
    }

    setBusy(true);

    try {
      const data = new FormData();

      // The application begins with the Learner's Licence stage.
      data.append("ApplicationType", "Learner Licence");
      data.append("VehicleType", application.VehicleType);
      data.append("DateOfBirth", application.DateOfBirth);
      data.append("Address", application.Address.trim());
      data.append("DocumentName", application.DocumentName);
      data.append("DocumentImage", application.DocumentImage);

      const response = await axios.post(`${host}/User/Application`, data, {
        headers: {
          "auth-token": token,
        },
      });

      console.log("Application response:", response.data);
      alert(response.data.message || "Application submitted successfully.");

      setApplication({
        VehicleType: "",
        DateOfBirth: "",
        Address: "",
        DocumentName: "",
        DocumentImage: null,
      });
    } catch (error) {
      console.error(
        "Application error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to submit the application."
      );
    } finally {
      setBusy(false);
    }
  };

  const labelClass = "mb-1 block text-xs font-medium text-slate-700";

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5">
      <div className="mx-auto max-w-xl">
      
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Application form
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              All fields are required.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelClass}>Application service</label>
              <div className={`${inputClass} bg-slate-50`}>
                Driving Licence
              </div>
            </div>

            <div>
              <label htmlFor="VehicleType" className={labelClass}>
                Vehicle category *
              </label>
              <select
                id="VehicleType"
                name="VehicleType"
                value={application.VehicleType}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select vehicle category</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="DateOfBirth" className={labelClass}>
                Date of birth *
              </label>
              <input
                id="DateOfBirth"
                name="DateOfBirth"
                type="date"
                max={MAX_DOB}
                value={application.DateOfBirth}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="Address" className={labelClass}>
                Residential address *
              </label>
              <textarea
                id="Address"
                name="Address"
                rows={2}
                value={application.Address}
                onChange={handleChange}
                placeholder="House, street, city, PIN code"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="DocumentName" className={labelClass}>
                Identity document *
              </label>
              <select
                id="DocumentName"
                name="DocumentName"
                value={application.DocumentName}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select document type</option>
                {DOCUMENT_NAMES.map((document) => (
                  <option key={document} value={document}>
                    {document}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="DocumentImage" className={labelClass}>
                Upload document *
              </label>
              <input
                id="DocumentImage"
                name="DocumentImage"
                type="file"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 text-xs text-slate-600 file:mr-3 file:border-0 file:bg-slate-100 file:px-3 file:py-2.5 file:font-medium file:text-slate-700"
                required
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Image or PDF, maximum 5 MB.
              </p>
              {application.DocumentImage && (
                <p className="mt-1 truncate text-xs text-emerald-700">
                  Selected: {application.DocumentImage.name}
                </p>
              )}
            </div>

            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/services"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy}
                className="flex-1 rounded-lg bg-blue-700 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
