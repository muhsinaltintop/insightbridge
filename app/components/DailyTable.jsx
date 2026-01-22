export default function DailyTable({ daily }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-semibold mb-3">Daily breakdown</h3>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-full">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Sessions</th>
              <th className="px-3 py-2">Users</th>
              <th className="px-3 py-2">Conversions</th>
              <th className="px-3 py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-3 py-2">{row.date?.slice(0, 10)}</td>
                <td className="px-3 py-2">{row.sessions}</td>
                <td className="px-3 py-2">{row.users}</td>
                <td className="px-3 py-2">{row.conversions}</td>
                <td className="px-3 py-2">
                  {row.revenue != null ? row.revenue : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
