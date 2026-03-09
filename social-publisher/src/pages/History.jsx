import { useEffect, useState } from "react";
import Table from "../components/Table";
import { getHistoryPosts } from "../api/posts";

export default function History() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getHistoryPosts().then(setPosts);
  }, []);

  const columns = ["Content", "Platform", "Status", "Date"];

  const badge = (status) => {
    const map = {
      published: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-600",
    };

    return (
      <span className={`${map[status]} px-3 py-1 rounded-full text-xs`}>
        {status}
      </span>
    );
  };

  const data = posts.map((p) => ({
    content: p.content,
    platform: p.platform,
    status: badge(p.status),
    date: new Date(p.published_at || p.created_at).toLocaleDateString(),
  }));

  return (
    <div>
      <div className="rounded-t-xl gradient-info px-6 py-4 bg-indigo-600">
        <h1 className="text-lg font-semibold text-white">Publishing History</h1>
        <p className="text-sm text-white/70">
          Record of all published and attempted posts
        </p>
      </div>
      
      <Table columns={columns} data={data} />
    </div>
  );
}
