import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { getDashboardSummary } from "../api/posts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setStats);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const columns = ["Content", "Platform", "Status", "Date"];

  const badge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      published: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-600",
    };

    return (
      <span className={`${map[status]} px-3 py-1 rounded-full text-xs`}>
        {status}
      </span>
    );
  };

  const data = stats.recent.map((p) => ({
    content: p.content,
    platform: p.platform,
    status: badge(p.status),
    date: new Date(p.created_at).toLocaleDateString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Posts" value={stats.total} />
        <StatCard title="Scheduled" value={stats.scheduled} />
        <StatCard title="Published" value={stats.published} />
        <StatCard title="Failed" value={stats.failed} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>

        {data.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <Table columns={columns} data={data} />
        )}
      </div>
    </div>
  );
}
