import React, { useState, useRef } from "react";
import { createPost } from "../api/posts";
import { publishInstagram } from "../api/social";

export default function CreatePost() {
  const [platform, setPlatform] = useState("linkedin");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  // Handle image selection (Instagram only)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Main submit handler (switches by platform)
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // LINKEDIN FLOW
      if (platform === "linkedin") {
        await createPost({
          platform: "linkedin",
          content,
          scheduled_at: scheduledAt || null,
        });

        alert(scheduledAt ? "LinkedIn post scheduled" : "Posted to LinkedIn");
      }

      // INSTAGRAM FLOW
      if (platform === "instagram") {
        if (!image) {
          alert("Instagram requires an image");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("caption", content);
        formData.append("image", image);

        if (scheduledAt) {
          formData.append("scheduled_at", new Date(scheduledAt).toISOString());
        }

        await publishInstagram(formData);

        alert(scheduledAt ? "Instagram post scheduled" : "Posted to Instagram");
      }

      // Reset form
      setContent("");
      setScheduledAt("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold">Create New Post</h2>
        <p className="text-sm opacity-90">
          Publish or schedule a post to your connected platforms
        </p>
      </div>

      <div className="bg-white p-6 rounded-b-xl shadow space-y-6">
        {/* PLATFORM */}
        <div>
          <label className="block mb-2 font-medium">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border rounded-lg p-3 outline-indigo-500"
          >
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        {/* CONTENT */}
        <div>
          <label className="block mb-2 font-medium">Content</label>
          <textarea
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-3 outline-indigo-500"
            placeholder="Write your post content here..."
          />
        </div>

        {/* IMAGE UPLOAD (used only for Instagram) */}
        <div>
          <label className="block mb-2 font-medium">Media</label>
          <div className="relative group border-2 border-dashed rounded-lg overflow-hidden transition-colors hover:border-indigo-400">
            {imagePreview ? (
              <div className="relative h-64 bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-10 cursor-pointer text-gray-400 hover:bg-gray-50 transition-colors">
                <span className="text-sm">
                  Click to upload or drag & drop images
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* SCHEDULING */}
        <div>
          <label className="block mb-2 font-medium">Schedule (Optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border rounded-lg p-3 outline-indigo-500"
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow active:scale-[0.98]"
        >
          {loading
            ? "Processing..."
            : scheduledAt
            ? "Schedule Post"
            : "Publish Now"}
        </button>
      </div>
    </div>
  );
}
