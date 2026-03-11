import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Scheduled from "./pages/Scheduled";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import EditScheduled from "./pages/EditScheduled";
// ❌ Register no longer needed (login screen already handles register)

export default function App() {
  // ✅ login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ check token when app loads (important for refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading){
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // ✅ called from Login.jsx after successful login
  function handleLogin() {
    setLoggedIn(true);
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* PROTECTED DASHBOARD ROUTES */}
        {loggedIn ? (
          <Route element={<DashboardLayout loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/scheduled" element={<Scheduled />} />
            <Route path="/scheduled/:id/edit" element={<EditScheduled />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        ) : (
          // If user not logged in → redirect everything to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

      </Routes>
    </BrowserRouter>
  );
}
