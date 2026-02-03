import { useState, useRef } from "react";
import { publishInstagram } from "../api/social";

export default function CreateInstagramPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  function handleImageSelect(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    if (scheduledAt) {
      const selected = new Date(scheduledAt);
      const now = new Date();

      if (isNaN(selected.getTime())) {
        alert("Invalid date");
        return;
      }

      if (selected <= now) {
        alert("Please choose a future time");
        return;
      }

      // 🔥 Backend expects UTC ISO
      formData.append("scheduled_at", selected.toISOString());
    }

    setLoading(true);
    try {
      await publishInstagram(formData);
      alert(scheduledAt ? "Instagram post scheduled" : "Posted to Instagram");

      setCaption("");
      setImage(null);
      setPreview(null);
      setScheduledAt("");
    } catch (err) {
      console.error(err);
      alert("Instagram publish failed");
    } finally {
      setLoading(false);
    }
  }

  // Correct local-time min for datetime-local
  const nowLocal = new Date();
  nowLocal.setMinutes(nowLocal.getMinutes() - nowLocal.getTimezoneOffset());
  const minDateTime = nowLocal.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Picker */}
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 text-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="mx-auto max-h-48 rounded"
          />
        ) : (
          <p className="text-gray-500">📷 Click to upload image</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        hidden
        onChange={(e) => handleImageSelect(e.target.files[0])}
      />

      {/* Caption */}
      <textarea
        placeholder="Write a caption…"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border rounded p-2"
      />

      {/* Scheduling */}
      <input
        type="datetime-local"
        min={minDateTime}
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="w-full border rounded p-2"
      />

      <button
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : scheduledAt
          ? "Schedule Instagram Post"
          : "Post to Instagram"}
      </button>
    </form>
  );
}
