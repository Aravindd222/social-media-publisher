import { useState,useEffect } from "react";
import { getPosts } from "../api/posts";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-medium">Posts</h3>

      {posts.length === 0 && (
        <p className="text-sm text-gray-500">No posts yet</p>
      )}

      {posts.map(p => (
        <div key={p.id} className="border-b pb-2">
          <p>{p.content}</p>
          <small className="text-gray-500">Status: {p.status}</small>
        </div>
      ))}
    </div>
  );
}
