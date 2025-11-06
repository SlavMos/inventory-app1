import { useParams, useNavigate } from "react-router-dom";
import { useInventoryStore } from "../store/inventoryStore";
import { useState } from "react";

export default function InventoryFieldsPage() {
  const { id } = useParams();
  const inventoryId = Number(id);
  const navigate = useNavigate();
  const inventories = useInventoryStore((s) => s.inventories);
  const addField = useInventoryStore((s) => s.addField);
  const removeField = useInventoryStore((s) => s.removeField);
  const getFields = useInventoryStore((s) => s.getFields);
  const inventory = inventories.find((inv) => inv.id === inventoryId);
  const fields = getFields(inventoryId);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("text");

  if (!inventory) return <div>Not found</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/inventory/${inventoryId}`)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>

      <h1 className="text-xl font-bold mb-4">
        Custom Fields for: {inventory.title}
      </h1>

      <div className="mb-6 flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          placeholder="Field name..."
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="text">Text</option>
          <option value="textarea">Multiline</option>
          <option value="number">Number</option>
          <option value="checkbox">Yes/No</option>
          <option value="link">Link</option>
        </select>

        <button
          onClick={() => {
            addField(inventoryId, { title, type, showInTable: true });
            setTitle("");
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {fields.map((field) => (
          <li
            key={field.id}
            className="flex justify-between border p-3 rounded"
          >
            <div>
              <strong>{field.title}</strong>{" "}
              <span className="text-gray-500">({field.type})</span>
            </div>
            <button
              onClick={() => removeField(inventoryId, field.id)}
              className="text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
