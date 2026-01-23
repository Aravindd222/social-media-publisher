import { useState } from "react";
import { createPost } from "../api/posts";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  if (!content.trim()) {
    alert("Post content cannot be empty");
    return;
  }

  setLoading(true);

  try {
    await createPost({
      platform: "linkedin",
      content,
      scheduled_at: scheduledAt || null,
    });

    alert(scheduledAt ? "Post scheduled" : "Post published");
    setContent("");
    setScheduledAt("");
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}



  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
      <h3 className="font-medium">Create Post</h3>

      <textarea
        className="w-full border rounded p-2"
        placeholder="Write your post..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <input
        type="datetime-local"
        className="border rounded p-2"
        value={scheduledAt}
        onChange={e => setScheduledAt(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading
          ? "Submitting..."
          : scheduledAt
          ? "Schedule Post"
          : "Publish Now"}
      </button>
    </form>
  );
}
