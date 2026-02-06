import { useState } from "react";
import { login, register } from "../api/auth";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const data = await login(email, password);
        localStorage.setItem("token", data.access_token);
        onLogin();
      } else {
        await register(email, password);
        alert("Account created. Please sign in.");
        setMode("login");
        setPassword("");
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (mode === "login"
          ? "Login failed"
          : "Registration failed");
      alert(msg);
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border rounded-lg shadow-sm p-8 space-y-6"
      >
        <div  className="bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl w-96">
          <h1 className="text-2xl font-semibold">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === "login"
              ? "Login to manage your social posts"
              : "Register to start publishing"}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign in"
            : "Create account"}
        </button>

        {/* Switch mode */}
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
      </form>
    </div>
  );
}
