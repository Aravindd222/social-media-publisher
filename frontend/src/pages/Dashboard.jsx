import { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import ConnectInstagram from "./ConnectInstagram";
import CreateInstagramPost from "./CreateInstagramPost";
import { getSocialStatus } from "../api/posts";

export default function Dashboard({ onLogout }) {
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocialStatus()
      .then((data) => {
        setLinkedinConnected(data.linkedin_connected);
        setInstagramConnected(data.instagram_connected);
      })
      .finally(() => setLoading(false));
  }, []);

  function connectLinkedIn() {
    const token = localStorage.getItem("token");
    window.location.href =
      `http://localhost:8000/social/connect/linkedin?token=${token}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white">
      
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-indigo-300 text-sm mt-1">
              Manage your connected accounts and publish posts
            </p>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-medium shadow-lg transition"
          >
            Logout
          </button>
        </header>

        {/* CONNECTED ACCOUNTS */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-indigo-200">
            🔗 Connected Accounts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LinkedIn */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl space-y-3">
              <h3 className="font-semibold text-lg">LinkedIn</h3>

              {loading ? (
                <p className="text-gray-300 text-sm">
                  Checking connection…
                </p>
              ) : linkedinConnected ? (
                <p className="text-green-400 font-medium">
                  ✅ Connected
                </p>
              ) : (
                <>
                  <p className="text-red-400 font-medium">
                    ❌ Not connected
                  </p>
                  <button
                    onClick={connectLinkedIn}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Connect LinkedIn
                  </button>
                </>
              )}
            </div>

            {/* Instagram */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl space-y-3">
              <h3 className="font-semibold text-lg">Instagram</h3>

              <ConnectInstagram
                instagramConnected={instagramConnected}
                onConnected={() => setInstagramConnected(true)}
              />
            </div>

          </div>
        </section>

        {/* PUBLISH SECTION */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-indigo-200">
            📝 Create & Publish
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LinkedIn Publishing */}
            {linkedinConnected && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
                <h3 className="font-semibold text-lg mb-4">
                  Post to LinkedIn
                </h3>
                <CreatePost />
              </div>
            )}

            {/* Instagram Publishing */}
            {instagramConnected && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
                <h3 className="font-semibold text-lg mb-4">
                  Post to Instagram
                </h3>
                <CreateInstagramPost />
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}
