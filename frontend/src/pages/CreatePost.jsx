import { useState } from "react";
import { createPost } from "../api/posts";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await createPost(
      {
        platform: "linkedin",
        content,
        scheduled_at: scheduledAt || null
      },
      token
    );

    alert("Post submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <textarea
        placeholder="Post content"
        onChange={e => setContent(e.target.value)}
      />
      <input
        type="datetime-local"
        onChange={e => setScheduledAt(e.target.value)}
      />
      <button>Create</button>
    </form>
  );
}
