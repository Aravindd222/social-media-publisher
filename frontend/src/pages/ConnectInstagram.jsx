import { useState } from "react";
import { connectInstagram } from "../api/social";

export default function ConnectInstagram() {
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

      setConnected(true);
      setAccessToken("");
      setUserId("");
      alert("Instagram connected successfully");
    } catch (err) {
      alert("Invalid Instagram credentials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (connected) {
    return <p className="text-green-600 font-medium">✅ Instagram Connected</p>;
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
