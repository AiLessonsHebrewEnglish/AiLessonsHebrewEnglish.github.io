export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        Admin panel
        <a href="/admin/schedule" className="text-blue-600 underline">Schedule</a>
      </div>
    </div>
  );
}
