import { useNavigate } from "react-router-dom";

export default function Topbar({ loggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (loggedIn) {
      onLogout();          // clear token (handled in App.jsx)
      navigate("/login");  // go back to login
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={handleClick}
        className="text-gray-500 hover:text-black font-medium"
      >
        {loggedIn ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}
