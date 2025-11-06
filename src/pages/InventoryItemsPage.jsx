import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { useItemStore } from "../store/itemStore";

export default function InventoryItemsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const inventories = useInventoryStore((s) => s.inventories);
  const fetchInventories = useInventoryStore((s) => s.fetchInventories);

  const addItem = useItemStore((s) => s.addItem);
  const deleteItem = useItemStore((s) => s.deleteItem);
  const fetchItems = useItemStore((s) => s.fetchItems);
  const allItems = useItemStore((s) => s.items);
  const customFormats = useInventoryStore((s) => s.customFormats);
  const nextCustomIdSeq = useInventoryStore((s) => s.nextCustomIdSeq);

  const inventoryId = Number(id);

  useEffect(() => {
    if (!inventories || inventories.length === 0) fetchInventories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Number.isFinite(inventoryId)) fetchItems(inventoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryId]);

  const items = useMemo(
    () => allItems.filter((i) => i.inventoryId === inventoryId),
    [allItems, inventoryId]
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", price: "", customFields: {} });
  const getFields = useInventoryStore((s) => s.getFields);
  const fields = getFields(inventoryId);

  const inventory = inventories.find((i) => i.id === inventoryId);
  if (!inventory) return <div className="p-6">Inventory not found</div>;

  const handleAdd = (e) => {
    e.preventDefault();
    const format = customFormats[inventoryId] || [];
    const builtId =
      Array.isArray(format) && format.length > 0
        ? format
            .map((p) => {
              switch (p.type) {
                case "text":
                  return p.value || "";
                case "date":
                  return new Date().toISOString().split("T")[0];
                case "guid":
                  return (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)).slice(0, 8);
                case "random6":
                  return Math.floor(100000 + Math.random() * 900000).toString();
                case "seq": {
                  const n = nextCustomIdSeq(inventoryId);
                  return String(n).padStart(3, "0");
                }
                default:
                  return "";
              }
            })
            .filter(Boolean)
            .join("-")
        : undefined;

    addItem(inventoryId, { ...form, ...(builtId ? { customId: builtId } : {}) });
    setForm({ name: "", quantity: "", price: "", customFields: {} });
    setIsAddOpen(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/inventory")}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{inventory.title}</h1>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/inventory/${inventoryId}/fields`)}
          className="text-blue-600 underline"
        >
          Manage custom fields
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => navigate(`/inventory/${inventoryId}/custom-id`)}
          className="text-blue-600 underline"
        >
          Custom ID Generator
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => navigate(`/inventory/${inventoryId}/discussion`)}
          className="text-blue-600 underline"
        >
          Discussion
        </button>
      </div>

      <div className="mb-4">
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">
          + Add Item
        </button>
      </div>

      <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Custom ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{item.customId || "-"}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[480px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Add Item</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              {fields.map((field) => {
                const type = field.type === "number" ? "number" : field.type === "checkbox" ? "checkbox" : "text";
                const value = form.customFields[field.title] ?? (type === "checkbox" ? false : "");
                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-1">{field.title}</label>
                    {type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            customFields: {
                              ...form.customFields,
                              [field.title]: e.target.checked,
                            },
                          })
                        }
                      />
                    ) : type === "text" && field.type === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            customFields: {
                              ...form.customFields,
                              [field.title]: e.target.value,
                            },
                          })
                        }
                        className="w-full border rounded p-2"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={type}
                        value={value}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            customFields: {
                              ...form.customFields,
                              [field.title]: e.target.value,
                            },
                          })
                        }
                        className="w-full border rounded p-2"
                      />
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
