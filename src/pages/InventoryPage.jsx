import { useEffect, useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { useNavigate } from "react-router-dom";
export default function InventoriesPage() {
  const inventories = useInventoryStore((s) => s.inventories);
  const fetchInventories = useInventoryStore((s) => s.fetchInventories);
  const addInventory = useInventoryStore((s) => s.addInventory);
  const deleteInventory = useInventoryStore((s) => s.deleteInventory);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return alert("Title is required");
    addInventory(form);
    setForm({ title: "", description: "" });
    setIsOpen(false);
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Inventories</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          + Add Inventory
        </button>
      </div>

      {/* 🧱 Таблица */}
      <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((inv) => (
            <tr
              key={inv.id}
              className="hover:bg-gray-50 cursor-pointer border-t"
              onClick={() => navigate(`/inventory/${inv.id}`)}
            >
              <td className="px-4 py-2 font-semibold">{inv.title}</td>
              <td className="px-4 py-2 text-gray-600">{inv.description}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(inv.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => deleteInventory(inv.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Модалка добавления */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl w-96 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">Add Inventory</h2>

            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded-lg"
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
