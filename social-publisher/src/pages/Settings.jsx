import { useState, useEffect } from "react";
import { connectInstagram } from "../api/social";
import { getSocialStatus } from "../api/posts";

export default function Settings() {
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [showInstagramForm, setShowInstagramForm] = useState(false);

  // Instagram form states (moved here from ConnectInstagram.jsx)
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Load connection status
  useEffect(() => {
    getSocialStatus()
      .then((data) => {
        setLinkedinConnected(data.linkedin_connected);
        setInstagramConnected(data.instagram_connected);
      })
      .catch((err) => console.error("Failed to fetch social status", err));
  }, []);

  // LinkedIn OAuth redirect
  function connectLinkedIn() {
    const token = localStorage.getItem("token");

    window.location.href =
      `http://localhost:8000/social/connect/linkedin?token=${token}`;
  }

  // Instagram connect handler (same logic you already wrote)
  async function handleInstagramSubmit(e) {
    e.preventDefault();

    if (!accessToken.trim() || !userId.trim()) {
      alert("Instagram Access Token and User ID are required");
      return;
    }

    setLoading(true);
    try {
      await connectInstagram({
        access_token: accessToken,
        ig_user_id: userId,
      });

      setAccessToken("");
      setUserId("");
      setInstagramConnected(true);
      setShowInstagramForm(false);

      alert("Instagram connected successfully");
    } catch (err) {
      console.error(err);
      alert("Invalid Instagram credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Platform Connections */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Platform Settings</h2>

        {/* LinkedIn */}
        <div className="flex justify-between items-center border p-4 rounded-lg">
          <div>
            <p className="font-medium">LinkedIn</p>
            <p className="text-sm text-gray-500">Connect via OAuth</p>
          </div>

          {linkedinConnected ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
          <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
          </span>
          <span>Connected</span>
          </div>
            ) : (

            <button
              onClick={connectLinkedIn}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Connect
            </button>
          )}
        </div>

        {/* Instagram */}
        <div className="border p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-gray-500">
                Connect using Access Token
              </p>
            </div>

            {!instagramConnected && (
              <button
                onClick={() => setShowInstagramForm(!showInstagramForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                {showInstagramForm ? "Cancel" : "Connect"}
              </button>
            )}

            {instagramConnected && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
                </span>
                <span>Connected</span>
              </div>
            )}
          </div>

          {/* Instagram Inline Form */}
          {showInstagramForm && !instagramConnected && (
            <form onSubmit={handleInstagramSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Instagram User ID"
                className="w-full border p-2 rounded"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />

              <input
                type="text"
                placeholder="Instagram Access Token"
                className="w-full border p-2 rounded"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />

              <button
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Connecting..." : "Connect Instagram"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Profile</h2>

        <input
          className="w-full border p-3 rounded-lg"
          defaultValue="user@example.com"
        />
        <input
          className="w-full border p-3 rounded-lg"
          defaultValue="Marketing Team"
        />

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}
