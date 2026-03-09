// StatCard.jsx
export default function StatCard({ title, value, change, icon: Icon }) {
  // Map titles to specific colors matching your image
  const colorMap = {
    "Total Posts": { bg: "bg-indigo-600", text: "text-green-400" },
    "Scheduled": { bg: "bg-blue-500", text: "text-green-400" },
    "Published": { bg: "bg-emerald-500", text: "text-green-400" },
    "Failed": { bg: "bg-orange-500", text: "text-red-400" },
  };

  const colors = colorMap[title] || { bg: "bg-gray-500", text: "text-gray-400" };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        {/* Change text color: green for positive, red for negative */}
        <p className={`text-xs font-semibold mt-1 ${colors.text}`}>
          {change} <span className="text-gray-400 font-normal">than last week</span>
        </p>
      </div>

      {/* Icon Container with dynamic background color */}
      <div className={`${colors.bg} p-3 rounded-xl shadow-lg shadow-${colors.bg.split('-')[1]}-200`}>
        {Icon && <Icon className="h-6 w-6 text-white" />}
      </div>
    </div>
  );
}
