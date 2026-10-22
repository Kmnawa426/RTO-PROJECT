import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { host } from "../../../Admin/src/Context/MyContext";
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const [user,setUser]=useState([])
  const nav=useNavigate()
  const handleSubmit=()=>{
    console.log(user)
    axios.post(`${host}/School/Login`,user)
    .then((res) => {
      console.log(res)
      alert(res.data.message)
      localStorage.setItem("SchoolToken",res.data.token)
      nav('/')
    }).catch((err) => {
      console.log(err?.response?.data?.message)
      alert(err?.response?.data?.message)
    });
  }
  const handlChange=(e)=>{
    console.log({...user,[e.target.name]:e.target.value})
    setUser({...user,[e.target.name]:e.target.value})
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand">
          <div className="brand-logo">R</div>
          <div><div className="brand-title">RTO Connect</div><div className="muted small">Driving School Portal</div></div>
        </div>
        <h1>Sign in</h1>
        <p className="muted">Use the email and password you registered your school with.</p>
        <label className="field">Email<input type="email" className="input" name="Email" onChange={handlChange}/></label>
        <label className="field">Password<input type="password" className="input" name="Password" onChange={handlChange}/></label>
        <button onClick={handleSubmit} className="btn btn-primary center-btn">Sign in</button>
        <p className="muted small center">New school? <Link to="/register" className="link">Register your school</Link></p>
      </div>
    </div>
  );
}
