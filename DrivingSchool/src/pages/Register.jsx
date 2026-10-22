import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { host } from "../../../Admin/src/Context/MyContext";
export default function Register() {
  const [user,setUser]=useState([])
  
  const handleChange=(e)=>{
    console.log({[e.target.name]:e.target.value})
    setUser({...user,[e.target.name]:e.target.value})

  }
  const handleSubmit=()=>{
    console.log(user)
    axios.post(`${host}/School/AddSchool`,user)
    .then((res) => {
      console.log(res)
      alert(res.data.message)
    }).catch((err) => {
      console.log(err)
      alert(err?.response?.data?.message)
    });
  }
  useEffect(()=>{

  },[])

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <h1>Register your driving school</h1>
        <p className="muted">Your school can sign in after the RTO admin approves this application.</p>
        <div className="form-grid two">
          <label className="field">School name<input className="input"  name="SchoolName"   onChange={handleChange}/></label>
          <label className="field">Contact person Name<input className="input" name="ContactPerson"  onChange={handleChange} /></label>
          <label className="field">Email<input type="email" className="input" name="Email"   onChange={handleChange}/></label>
          <label className="field">Phone<input className="input" name="Phone"  onChange={handleChange} /></label>
          <label className="field">Password<input type="password" className="input" name="Password"  onChange={handleChange} /></label>
          <label className="field">City<input className="input" name="City"  onChange={handleChange} /></label>
          <label className="field span-2">Address<input className="input" name="Address"  onChange={handleChange}/></label>
          <label className="field span-2">School image (optional)<input type="file" accept="image/*" className="input" name=""   onChange={handleChange}/></label>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit for approval</button>
        <p className="muted small center">Already approved? <Link to="/login" className="link">Sign in</Link></p>
      </div>
    </div>
  );
}
