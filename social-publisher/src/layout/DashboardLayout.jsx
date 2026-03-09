import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ loggedIn, setLoggedIn }) {

  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar loggedIn={loggedIn} onLogout={handleLogout} />

        <main
          key={location.pathname}
          className="flex-1 p-8 animate-pageEnter"
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}