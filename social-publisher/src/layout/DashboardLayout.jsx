import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ loggedIn, setLoggedIn }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar loggedIn={loggedIn} onLogout={handleLogout} />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
