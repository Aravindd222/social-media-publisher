import { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";
import { getSocialStatus } from "../api/posts";


export default function Dashboard({ onLogout }) {
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocialStatus()
      .then(data => {
        setLinkedinConnected(data.linkedin_connected);
      })
      .finally(() => setLoading(false));
  }, []);

function connectLinkedIn() {
  const token = localStorage.getItem("token");
  window.location.href =
    `http://localhost:8000/social/connect/linkedin?token=${token}`;
}


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* LinkedIn Status */}
      <div className="border p-4 rounded">
        {loading ? (
          <p>Checking LinkedIn connection...</p>
        ) : linkedinConnected ? (
          <p className="text-green-600 font-medium">
            ✅ LinkedIn Connected
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-red-600 font-medium">
              ❌ LinkedIn Not Connected
            </p>
            <button
              onClick={connectLinkedIn}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Connect LinkedIn
            </button>
          </div>
        )}
      </div>

      {/* Only allow post creation if connected */}
      {linkedinConnected && <CreatePost />}

      <PostList />
    </div>
  );
}
