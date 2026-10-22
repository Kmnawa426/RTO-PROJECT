import axios from "axios"
import { useEffect, useState } from "react"
import { host } from "../Context/MyContext"

export default function Users() {
  const [user, setUser] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  const getUsers = () => {
    axios.get(`${host}/Admin/AllUser`)
      .then((res) => {
        console.log(res)
        setUser(res.data.Users)
      }).catch((err) => {
        console.log(err)
      })
  }


  useEffect(() => {
    getUsers()
    console.log(user)
  }, [])

  return (
    <>
      <div className="page-head"><div><h1>Users</h1><p>36 registered accounts</p></div></div>
      <div className="panel">
        {/* <div className="toolbar">
          <div className="search"><i className="bi bi-search"></i><input className="form-control" type="search" placeholder="Search name, email or phone" /></div>
          <select className="form-select"><option>All statuses</option></select>
          <select className="form-select"><option>All cities</option></select>
          <input type="date" className="form-control" aria-label="From" /><span className="text-muted small">to</span><input type="date" className="form-control" aria-label="To" />
          <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1"></i>Export CSV</button>
        </div> */}
        <div className="table-responsive">
          <table className="table rto-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th className="text-end">Action</th></tr>


            </thead>
            <tbody>
              {/* One <tr> per record. Repeat this row from your database. */}
              {user.map((udata) => (
                <tr><td><div className="cell-user"><span className="avatar">AS</span><div>{udata.FullName}</div></div></td><td>{udata.Email}</td><td>{udata.Phone}</td><td>{udata.createdAt.split('T')[0]}</td><td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={()=>setSelectedUser(udata)} data-bs-toggle="modal" data-bs-target="#viewModal">Profile</button></td></tr>

              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>Showing 1–8 of 36</span>
          <div className="pager"><button disabled><i className="bi bi-chevron-left"></i></button><button className="on">1</button><button>2</button><span className="px-1">…</span><button>5</button><button><i className="bi bi-chevron-right"></i></button></div>
        </div>
      </div>

      {/* ============ MODAL ============ */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">User Information</h5><button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div className="modal-body">
              <div className="kv"><div><small>User Name</small><div>{selectedUser?.FullName}</div></div><div><small>Email</small><div>{selectedUser?.Email}</div></div><div><small>Phone</small><div>{selectedUser?.Phone}</div></div><div><small>City</small><div>{selectedUser?.Address}</div></div><div><small>Registered</small><div>{selectedUser?.createdAt.split("T")[0]}</div></div></div>
            </div>
            <div className="modal-footer"><button className="btn btn-light btn-sm" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>
    </>
  )
}
