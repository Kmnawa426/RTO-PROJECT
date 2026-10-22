import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Applications from './pages/Applications.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Licences from './pages/Licences.jsx'
import DrivingSchools from './pages/DrivingSchools.jsx'
import Training from './pages/Training.jsx'
import Users from './pages/Users.jsx'
import Verification from './pages/Verification.jsx'
import Reports from './pages/Reports.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'
import DrivingTestManagement from './pages/DrivingTestManagement.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/vehicles" element={<Vehicles />} /> 
        <Route path="/driving-schools" element={<DrivingSchools />} />
        <Route path="/training" element={<Training />} />
        <Route path="/users" element={<Users />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/driving-test-management" element={<DrivingTestManagement />} />
        <Route path="/licences" element={<Licences />}
        />
      </Route>
    </Routes>
  )
}
