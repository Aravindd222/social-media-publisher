import { useState, useEffect } from "react";
import {
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { connectInstagram } from "../api/social";
import { getSocialStatus } from "../api/posts";
import { deleteSocialAccount } from "../api/social";

export default function Settings() {

  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  const [linkedinUsername, setLinkedinUsername] = useState("john-doe");
  const [instagramUsername, setInstagramUsername] = useState("@johndoe");

  const [editingPlatform, setEditingPlatform] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showInstagramForm, setShowInstagramForm] = useState(false);

  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(false);


  /*
  LOAD STATUS
  */
  useEffect(() => {

    getSocialStatus()
      .then((data) => {

        setLinkedinConnected(data.linkedin_connected);
        setInstagramConnected(data.instagram_connected);

      })
      .catch(console.error);

  }, []);



  /*
  LINKEDIN CONNECT
  */
  function connectLinkedIn() {

    const token = localStorage.getItem("token") || "http://localhost:8000";
    const API_URL = import.meta.env.VITE_API_URL; 

    window.location.href =
      `${API_URL}/social/connect/linkedin?token=${token}`;

  }
  



  /*
  INSTAGRAM CONNECT
  */
  async function handleInstagramSubmit(e) {

    e.preventDefault();

    if (!accessToken || !userId) {
      alert("Instagram Access Token and User ID required");
      return;
    }

    setLoading(true);

    try {

      await connectInstagram({
        access_token: accessToken,
        ig_user_id: userId,
      });

      setInstagramConnected(true);
      setShowInstagramForm(false);

      alert("Instagram connected");

    } catch {

      alert("Invalid credentials");

    } finally {

      setLoading(false);

    }

  }



  /*
  START EDIT
  */
function startEdit(platform) {

  setEditingPlatform(platform);

  if (platform === "instagram") {
    setShowInstagramForm(true);
  }

  if (platform === "linkedin") {
    connectLinkedIn(); // OAuth reconnect
  }

}



  /*
  CANCEL EDIT
  */
  function cancelEdit() {

    setEditingPlatform(null);
    setEditValue("");

  }



  /*
  SAVE EDIT
  */
 async function saveEdit(platform) {

  if (platform === "linkedin") {

    // redirect to OAuth reconnect
    connectLinkedIn();
    return;

  }

  if (platform === "instagram") {

    try {

      await connectInstagram({
        access_token: accessToken,
        ig_user_id: userId,
      });

      setInstagramUsername(userId);
      setEditingPlatform(null);
      alert("Instagram updated");

    } catch {

      alert("Failed to update Instagram");

    }

  }

}



  /*
  DELETE ACCOUNT
  */
 

async function removeAccount(platform) {

  const confirmDelete = window.confirm(
    `Remove ${platform} account?`
  );

  if (!confirmDelete) return;
  

  try {

    await deleteSocialAccount(platform);

    if (platform === "linkedin") {
      setLinkedinConnected(false);
      setLinkedinUsername("");
    }

   if (platform === "instagram") {
  setInstagramConnected(false);
  setInstagramUsername("");
}

    alert(`${platform} account removed`);

  } catch (err) {

    alert("Failed to remove account");

  }

}



  /*
  PLATFORM CARD COMPONENT
  */
  function PlatformCard({
    platform,
    connected,
    username,
    connectHandler,
    subtitle
  }) {

    const editing = editingPlatform === platform;

    return (

      <div className="flex justify-between items-center border rounded-xl p-4 hover:shadow-sm transition  flex-justify-center">

        <div>

          <p className="font-semibold capitalize">
            {platform}
          </p>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>


          {connected && !editing && (
            <p className="text-xs text-gray-400 mt-1">
              Account: {username}
            </p>
          )}



        </div>



        <div className="flex gap-2">

          {connected ? (
            <>
              <button
                onClick={()=>startEdit(platform)}
                className="border p-2 rounded hover:bg-gray-100"
              >
                <PencilIcon className="h-4 w-4"/>
              </button>

              <button
                onClick={()=>removeAccount(platform)}
                className="border p-2 rounded text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4"/>
              </button>
            </>
          ) : (
            <button
              onClick={connectHandler}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Connect
            </button>
          )}

        </div>

      </div>

    );

  }



  return (

    <div className="max-w-2xl mx-auto space-y-6 ">


      {/* PLATFORM SETTINGS */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="bg-indigo-600 text-white px-6 py-4">

          <h2 className="font-semibold text-lg">
            Platform Settings
          </h2>
          <p className="text-sm opacity-80">
            Manage your social media connections
          </p>

        </div>


        <div className="p-6 space-y-4">

          <PlatformCard
            platform="linkedin"
            connected={linkedinConnected}
            username={linkedinUsername}
            connectHandler={connectLinkedIn}
            subtitle="Connect via OAuth 2.0"
          />

          <PlatformCard
            platform="instagram"
            connected={instagramConnected}
            username={instagramUsername}
            connectHandler={()=>setShowInstagramForm(true)}
            subtitle="Connect via Graph API"
          />


          {/* Instagram form */}

          {showInstagramForm && (

            <form
              onSubmit={handleInstagramSubmit}
              className="space-y-2"
            >

              <input
                placeholder="Instagram User ID"
                value={userId}
                onChange={(e)=>setUserId(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                placeholder="Instagram Access Token"
                value={accessToken}
                onChange={(e)=>setAccessToken(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <button
                className="bg-pink-600 text-white px-4 py-2 rounded"
              >
                {instagramConnected ? "Update Instagram" : "Connect Instagram"}
              </button>

            </form>

          )}

        </div>

      </div>



      {/* PROFILE */}

      <div className="bg-white rounded-xl shadow p-6 space-y-4">

        <h2 className="font-semibold text-lg">
          Profile
        </h2>

        <input
          className="border p-3 w-full rounded"
          defaultValue="user@example.com"
        />

        <input
          className="border p-3 w-full rounded"
          defaultValue="Marketing Team"
        />

        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>

      </div>


    </div>

  );

}