import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Schedule from "./pages/Schedule.jsx";
import Progress from "./pages/Progress.jsx";
import Tests from "./pages/Tests.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="progress" element={<Progress />} />
        <Route path="tests" element={<Tests />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
