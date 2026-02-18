export default function Table({ columns, data, renderActions }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th key={col} className="p-4 text-sm font-semibold text-gray-600">
                {col}
              </th>
            ))}
            {renderActions && <th className="p-4">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {Object.values(row).map((value, i) => (
                <td key={i} className="p-4 text-sm">
                  {value}
                </td>
              ))}

              {renderActions && (
                <td className="p-4">{renderActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
