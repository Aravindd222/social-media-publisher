import { NavLink } from "react-router-dom";

const linkStyle =
  "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-500 transition";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-xl font-semibold">
        Social Publisher
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/" className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/create" className={linkStyle}>Create Post</NavLink>
        <NavLink to="/scheduled" className={linkStyle}>Scheduled Posts</NavLink>
        <NavLink to="/history" className={linkStyle}>History</NavLink>
        <NavLink to="/settings" className={linkStyle}>Settings</NavLink>
      </nav>

      <div className="p-4 text-sm text-gray-400">
        © 2026 Social Publisher
      </div>
    </div>
  );
}
