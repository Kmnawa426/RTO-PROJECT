import axios from "axios"
import { useEffect } from "react";
import { host } from "../Context/MyContext";
import { useState } from "react";

export default function DrivingSchools() {
  const token = localStorage.getItem("UserToken")
  const [schools, setSchools] = useState([])
  const [selected, setSelected] = useState([])
  const [searchText, setSearchText] = useState("");
  const [selectedVerification, setSelectedVerification] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const getDrivingSchool = () => {
    axios.get(`${host}/Admin/ViewDrivingSchools`, { headers: { "auth-token": token } })
      .then((res) => {
        console.log(res)
        setSchools(res.data.Schools)
      }).catch((err) => {
        console.log(err)
      });
  }
  const VerifySchool = () => {
    const id = selected?._id
    axios.put(`${host}/Admin/ApproveSchool`, { id: id })
      .then((res) => {
        console.log(res)
        setSelected(res.data.School)
        alert(res.data.message)
      }).catch((err) => {
        console.log(err)
        alert(err?.response?.data?.message)
      });
  }
  // Need to work here
  const rejectPermission = () => {
    console.log("first")
    const id = selected?._id
    axios.put(`${host}/Admin/RejectSchool`, { id: id })
      .then((res) => {
        console.log(res)
        alert(res.data.message)
        setSelected(res.data.School)
      }).catch((err) => {
        console.log(err)
        alert(err?.response?.data?.message)
      });

  }
  useEffect(() => {
    getDrivingSchool()
  }, [])
  return (
    <>
      <div className="page-head"><div><h1>Driving Schools</h1><p>Verify registrations and manage school accounts.</p></div></div>
      <div className="row g-3 mb-3">
        <div className="col-md-4"><div className="stat"><div className="stat-icon ic-blue"><i className="bi bi-building"></i></div><div><small>Total schools</small><div><b>12</b></div></div></div></div>
        <div className="col-md-4"><div className="stat"><div className="stat-icon ic-green"><i className="bi bi-check2-circle"></i></div><div><small>Verified</small><div><b>8</b></div></div></div></div>
        <div className="col-md-4"><div className="stat"><div className="stat-icon ic-amber"><i className="bi bi-hourglass-split"></i></div><div><small>Awaiting verification</small><div><b>3</b></div></div></div></div>
      </div>
      <div className="panel">
        <div className="toolbar">
          <div className="search"><i className="bi bi-search"></i>
            <input
              className="form-control"
              type="search"
              placeholder="Search school or contact"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
          >
            <option value="">All verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <select
            className="form-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">All accounts</option>
            <option value="Active">Active</option>
          </select>

          <select
            className="form-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All locations</option>
            {[...new Set(schools.map((school) => school.City).filter(Boolean))].map(
              (city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              )
            )}
          </select>
          {/* <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1"></i>Export CSV</button> */}
        </div>
        <div className="table-responsive">
          <table className="table rto-table">
            <thead><tr><th>School</th><th>Contact person</th><th>Phone</th><th>Location</th><th>Verification</th><th>Account</th><th className="text-end">Action</th></tr></thead>
            <tbody>
              {/* One <tr> per record. Repeat this row from your database. */}
              {schools
                .filter((school) => {
                  const matchesSearch =
                    `${school.SchoolName || ""} ${school.ContactPerson || ""} ${school.Phone || ""}`
                      .toLowerCase()
                      .includes(searchText.toLowerCase());

                  const matchesVerification =
                    selectedVerification === "" ||
                    String(school.Permission) === selectedVerification;

                  const matchesLocation =
                    selectedLocation === "" ||
                    school.City === selectedLocation;

                  const matchesAccount =
                    selectedAccount === "" ||
                    selectedAccount === "Active";

                  return (
                    matchesSearch &&
                    matchesVerification &&
                    matchesLocation &&
                    matchesAccount
                  );
                })
                .map((sdata) => (
    // Keep your existing <tr>...</tr> here

              <tr><td><span className="ref">{sdata.SchoolName}</span></td><td>{sdata.ContactPerson}</td><td>{sdata.Phone}</td><td>{sdata.City}</td><td><span className={sdata.Permission ? "pill ok" : "pill warn"}>{sdata.Permission ? "Verified" : "Unverified"}</span></td><td><span className="pill ok">Active</span></td><td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(sdata)} data-bs-toggle="modal" data-bs-target="#viewModal">View</button></td></tr>

              ))

              }
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>Showing 1–8 of 12</span>
          <div className="pager"><button disabled><i className="bi bi-chevron-left"></i></button><button className="on">1</button><button>2</button><span className="px-1">…</span><button>2</button><button><i className="bi bi-chevron-right"></i></button></div>
        </div>
      </div>

      {/* ============ MODAL ============ */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">{selected?.SchoolName}</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div className="modal-body">
              <div className="kv"><div><small>Registration no.</small><div>
                {selected?._id?.slice(0, 4).toUpperCase()}-
                {selected?._id?.slice(4, 8).toUpperCase()}
              </div></div><div><small>Contact person</small><div>{selected?.ContactPerson}</div></div><div><small>Phone</small><div>{selected?.Phone}</div></div><div><small>Location</small><div>{selected?.City}</div></div><div><small>Verification</small><div><span className={selected?.Permission ? "pill ok" : "pill warn"}>{selected?.Permission ? "Verified" : "Unverified"}</span></div></div><div><small>Account</small><div><span className="pill ok">Active</span></div></div></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button>
              {selected?.Permission ?
                <button className="btn btn-outline-danger btn-sm" onClick={rejectPermission}>Reject</button> :
                <button onClick={VerifySchool} className="btn btn-success btn-sm">Verify school</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
