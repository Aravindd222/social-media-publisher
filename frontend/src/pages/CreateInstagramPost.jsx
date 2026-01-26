import { useState, useRef } from "react";
import { publishInstagram } from "../api/social";

export default function CreateInstagramPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    setLoading(true);
    try {
      await publishInstagram(formData);
      alert("Posted to Instagram");
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      alert("Instagram publish failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelect(file) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

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

      {/* Submit */}
      <button
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post to Instagram"}
      </button>
    </form>
  );
}
