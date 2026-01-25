import { useState } from "react";
import { publishInstagram } from "../api/social";

export default function CreateInstagramPost() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imageUrl || !caption) {
      alert("Image URL and caption required");
      return;
    }

    setLoading(true);
    try {
      await publishInstagram({
        image_url: imageUrl,
        caption,
      });
      alert("Posted to Instagram");
      setImageUrl("");
      setCaption("");
    } catch (e) {
      alert("Instagram publish failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
      <h3 className="font-medium">Post to Instagram</h3>

      <input
        placeholder="Public Image URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        className="w-full border p-2"
      />

      <textarea
        placeholder="Caption"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        className="w-full border p-2"
      />

      <button className="bg-pink-600 text-white px-4 py-2 rounded hover:scale-110 hover:bg-pink-700 transition duration-300 ease-in-out">
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
