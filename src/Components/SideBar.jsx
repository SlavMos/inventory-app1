import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col space-y-4">
      <h2 className="text-2xl font-bold mb-4">Меню</h2>
      <Link to="/" className="hover:text-blue-400">
        🏠 Главная
      </Link>
      <Link to="/inventory" className="hover:text-blue-400">
        📦 Склад
      </Link>
      <Link to="/profile" className="hover:text-blue-400">
        👤 Профиль
      </Link>
      <Link to="/admin" className="hover:text-blue-400">
        🛠️ Админ
      </Link>
    </aside>
  );
}
