export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-96">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>

        <input className="w-full p-2 border mb-2" placeholder="Email" />
        <input className="w-full p-2 border mb-4" placeholder="Password" />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
