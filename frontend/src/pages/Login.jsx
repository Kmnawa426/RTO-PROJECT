import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import Field, { FormResult } from '../components/Field.jsx'
import axios from 'axios'
import { host } from '../../../Admin/src/Context/MyContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    Email: '',
    Password: ''
  })
  const handleChange = (e) => {

    console.log({ ...user, [e.target.name]: e.target.value })
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const handleSubmit = () => {
    console.log(user)
    axios.post(`${host}/User/Login`, user)
      .then((res) => {
        console.log(res)
        alert(res.data.message)
        const Token = res.data.Token
        localStorage.setItem("UserToken", Token)
        navigate('/')
      }).catch((err) => {
        console.log(err)
        alert(err.response?.data?.message)
      });
  }
  return (
    <AuthShell title="Sign in" subtitle="Welcome back. Sign in to track your applications.">
      <div >
        <div className="row g-3">
          <Field col="col-12" onChange={handleChange} label="Email" name="Email" type="email" autoComplete="email" />
          <Field col="col-12" onChange={handleChange} label="Password" name="Password" type="password" autoComplete="current-password" />
        </div>
        <button className="btn btn-primary w-100 mt-4 py-2" onClick={handleSubmit}>Sign in</button>
        {/* <FormResult  okText="Signed in." /> */}
      </div>
      <p className="text-center small text-muted mt-4 mb-0">
        New here? <Link to="/register" className="fw-semibold">Create an account</Link>
      </p>
    </AuthShell>
  )
}
