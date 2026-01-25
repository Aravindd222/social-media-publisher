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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage your connected accounts and publish posts
            </p>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition "
          >
            Logout
          </button>
        </header>

        {/* CONNECTED ACCOUNTS */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            🔗 Connected Accounts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LinkedIn */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-6 space-y-3">
              <h3 className="font-medium text-slate-900">LinkedIn</h3>

              {loading ? (
                <p className="text-sm text-slate-500">
                  Checking connection…
                </p>
              ) : linkedinConnected ? (
                <p className="text-green-600 font-medium">
                  ✅ Connected
                </p>
              ) : (
                <>
                  <p className="text-red-600 font-medium">
                    ❌ Not connected
                  </p>
                  <button
                    onClick={connectLinkedIn}
                    className="mt-2 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                  >
                    Connect LinkedIn
                  </button>
                </>
              )}
            </div>

            {/* Instagram */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-6 space-y-3">
              <h3 className="font-medium text-slate-900">Instagram</h3>

              <ConnectInstagram
                instagramConnected={instagramConnected}
                onConnected={() => setInstagramConnected(true)}
              />
            </div>
          </div>
        </section>

        {/* PUBLISH */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            📝 Create & Publish
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LinkedIn Publishing */}
            {linkedinConnected && (
              <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-6">
                <h3 className="font-medium text-slate-900 mb-3">
                  Post to LinkedIn
                </h3>
                <CreatePost />
              </div>
            )}

            {/* Instagram Publishing */}
            {instagramConnected && (
              <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-6">
                <h3 className="font-medium text-slate-900 mb-3">
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
