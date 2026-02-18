export default function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-green-500 text-sm">{change}</p>
    </div>
  );
}
