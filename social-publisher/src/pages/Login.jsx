import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const data = await login(email, password);
        console.log("LOGIN RESPONSE:", data);
        localStorage.setItem("token", data.access_token);
        onLogin();           // update app state
        navigate("/");       // go to dashboard
      } else {
        await register(email, password);

        alert("Account created. Please sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (mode === "login"
          ? "Login failed"
          : "Registration failed");

      alert(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white shadow-xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 text-center">
          <h2 className="text-xl font-semibold">Social Publisher</h2>
          <p className="text-sm opacity-90">
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <input
            type="email"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Register-only field */}
          {mode === "register" && (
            <input
              type="password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          {/* Switch Mode */}
          <button
            type="button"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
            className="w-full text-sm text-slate-600 hover:underline"
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
