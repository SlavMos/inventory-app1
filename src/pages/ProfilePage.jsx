export default function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">User Profile</h1>
      <p>
        <strong>Email:</strong> admin@test.com
      </p>
      <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
