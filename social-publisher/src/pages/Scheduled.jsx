import { useEffect, useState } from "react";
import Table from "../components/Table";
import { getScheduledPosts } from "../api/posts";

export default function Scheduled() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getScheduledPosts().then(setPosts);
  }, []);

  const columns = ["Content", "Platform", "Scheduled At", "Status"];

  const data = posts.map((p) => ({
    content: p.content,
    platform: p.platform,
    time: new Date(p.scheduled_at).toLocaleString(),
    status: (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
        Pending
      </span>
    ),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Scheduled Posts</h1>
      <Table columns={columns} data={data} />
    </div>
  );
}
