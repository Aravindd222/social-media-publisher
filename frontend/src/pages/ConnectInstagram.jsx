import { useState } from "react";
import { connectInstagram } from "../api/social";

export default function ConnectInstagram({instagramConnected, onConnected}) {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  async function handleSubmit(e) {
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
      onConnected?.();
      alert("Instagram connected successfully");
    } catch (err) {
      console.error(err);
      alert("Invalid Instagram credentials");
    } finally {
      setLoading(false);
    }
  }

 if (instagramConnected) {
  return (
    <div className="flex items-center gap-2 text-green-600 font-medium">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-600"></span>
      </span>
      <span>Instagram Connected</span>
    </div>
  );
}


  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
      <h3 className="font-medium">Connect Instagram</h3>

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
  );
}
