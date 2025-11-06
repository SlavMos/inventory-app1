import { useAuth } from "../hooks/useAuth";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">
        Inventory App {user && `(${user.email})`}
      </h1>

      {user && (
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Выйти
        </button>
      )}
    </nav>
  );
}
