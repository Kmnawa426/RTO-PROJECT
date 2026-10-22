import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Apply from './pages/Apply.jsx'
import Applications from './pages/Applications.jsx'
import Training from './pages/Training.jsx'
import DrivingTest from './pages/DrivingTest.jsx'
import Fines from './pages/Fines.jsx'
import Notifications from './pages/Notifications.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SchoolRegister from './pages/SchoolRegister.jsx'
import ApplyLicence from './pages/ApplyLicence.jsx'

export default function App() {
  return (
    <Routes>
      {/* Pages without the navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/school-register" element={<SchoolRegister />} />

      {/* Pages with navbar + footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/ApplyLicence" element={<ApplyLicence />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/training" element={<Training />} />
        <Route path="/driving-test" element={<DrivingTest />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  )
}
