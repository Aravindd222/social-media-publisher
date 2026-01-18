import { useState } from "react";
import { login, register } from "../api/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); // 
    setLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      onLogin(); 
    } catch (err) {
      alert("Login failed. Check email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      await register(email, password);
      alert("Registered successfully. Please login.");
    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8"
      >
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Social Media Publisher
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Sign in to manage and publish content
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-900"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-900"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          onClick={handleRegister}
          className="w-full mt-3 border border-slate-300 py-2.5 rounded-md hover:bg-slate-50"
        >
          Create an account
        </button>
      </form>
    </div>
  );
}
