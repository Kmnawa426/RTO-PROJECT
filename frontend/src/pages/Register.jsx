import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import Field, { FormResult } from '../components/Field.jsx'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext.jsx'

export default function Register() {
  const [user,setUser]=useState([])
  const nav = useNavigate()
  const handleChange=(e)=>{
    console.log({...user,[e.target.name]:e.target.value})
    setUser({...user,[e.target.name]:e.target.value})
  }
  const handleSubmit=()=>{
    axios.post(`${host}/User/Register`,user)
    .then((res) => {
      console.log(res)
      alert(res.data.message)
      const Token=res.data.Token
      localStorage.setItem("UserToken",Token)
      nav('/')
    }).catch((err) => {
      console.log(err)
      alert(err.response?.data?.message)
    });
  }

  return (
    <AuthShell wide title="Create your account" subtitle="Register once to apply for licences and track everything in one place.">
      <div >
        <div className="row g-3">
          <Field label="Full name" name="FullName" onChange={handleChange}/>
          <Field label="Email" name="Email" type="email" autoComplete="email"onChange={handleChange} />
          <Field label="Phone" name="Phone" type="tel" pattern="[0-9]{10}" maxLength={10} help="10-digit mobile number" onChange={handleChange}/>
          <Field label="Date of birth" name="DateOfBirth" type="date"onChange={handleChange} />
          <Field col="col-12" label="Address" name="Address" as="textarea" onChange={handleChange}/>
          <Field label="Password" name="Password" type="password" minLength={6} autoComplete="new-password" onChange={handleChange}/>
            {/* <Field col="col-12" label="Driving school" name="DrivingSchool" as="select" required={false}
              help="Optional – you can choose one later."
              options={SCHOOLS.map(s => ({ value: s._id, label: `${s.SchoolName} (${s.City})` }))} /> */}
        </div>
        <button className="btn btn-primary w-100 mt-4 py-2" onClick={handleSubmit}>Create account</button>
        {/* <FormResult result={result} okText="Account created. You can sign in now." /> */}
      </div>
      <p className="text-center small text-muted mt-4 mb-0">
        Already registered? <Link to="/login" className="fw-semibold">Sign in</Link>
      </p>
    </AuthShell>
  )
}
