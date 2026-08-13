import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NGODashboard from "./pages/NGODashboard";
import UserSignup from "./pages/UserSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import NGOSignup from "./pages/NGOSignup";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/signup" element={<Signup />} />
        <Route
  path="/signup/user"
  element={<UserSignup />}
/>
        <Route
          path="/signup/ngo"
          element={<NGOSignup />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute role="ngo">
              <NGODashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;