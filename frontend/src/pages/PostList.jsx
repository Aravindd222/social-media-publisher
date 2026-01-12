import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getPosts(token).then(setPosts);
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map(p => (
        <div key={p.id}>
          <p>{p.content}</p>
          <small>Status: {p.status}</small>
        </div>
      ))}
    </div>
  );
}
