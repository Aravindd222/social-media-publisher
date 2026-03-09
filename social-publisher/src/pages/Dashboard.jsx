import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { getDashboardSummary } from "../api/posts";
import { 
  PencilSquareIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    // Fetches summary from your [API endpoint](https://developer.mozilla.org)
    getDashboardSummary().then(setStatsData);
  }, []);

  if (!statsData) return <p>Loading dashboard...</p>;

  // 1. Define the stats configuration with Heroicons components
  const statsConfig = [
    { title: "Total Posts", value: statsData.total, icon: PencilSquareIcon, gradient: "gradient-primary", change: "+12%" },
    { title: "Scheduled", value: statsData.scheduled, icon: ClockIcon, gradient: "gradient-info", change: "+3%" },
    { title: "Published", value: statsData.published, icon: CheckCircleIcon, gradient: "gradient-success", change: "+8%" },
    { title: "Failed", value: statsData.failed, icon: ExclamationCircleIcon, gradient: "gradient-warning", change: "-5%" },
  ];

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

  const tableData = statsData.recent.map((p) => ({
    content: p.content,
    platform: p.platform,
    status: badge(p.status),
    date: new Date(p.created_at).toLocaleDateString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* 2. Map over statsConfig to render StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsConfig.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            gradient={stat.gradient}
            change={stat.change}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        {tableData.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </div>
    </div>
  );
}
