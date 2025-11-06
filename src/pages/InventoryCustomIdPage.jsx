import { useParams, useNavigate } from "react-router-dom";
import { useInventoryStore } from "../store/inventoryStore";
import { useState } from "react";

// Drag & Drop (dnd-kit)
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function InventoryCustomIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventories, updateCustomIdFormat } = useInventoryStore();

  const inventoryId = Number(id);
  const inventory = inventories.find((inv) => inv.id === inventoryId);

  const [format, setFormat] = useState(inventory?.customIdFormat || []);

  if (!inventory) {
    return <div className="p-6 text-center">Inventory not found</div>;
  }

  //  Добавить часть ID
  const addPart = (type) => {
    const newPart = { id: Date.now(), type, value: "" };
    setFormat([...format, newPart]);
  };

  //  Удалить часть
  const removePart = (id) => {
    setFormat(format.filter((p) => p.id !== id));
  };

  //  Обновить значение
  const updateValue = (id, value) => {
    setFormat(format.map((p) => (p.id === id ? { ...p, value } : p)));
  };

  //  Сохранить шаблон
  const saveFormat = () => {
    updateCustomIdFormat(inventoryId, format);
    navigate(`/inventory/${inventoryId}`);
  };

  //  Предпросмотр
  const preview = format
    .map((p) => {
      switch (p.type) {
        case "text":
          return p.value;
        case "date":
          return new Date().toISOString().split("T")[0];
        case "guid":
          return crypto.randomUUID().slice(0, 8);
        case "random6":
          return Math.floor(100000 + Math.random() * 900000);
        case "seq":
          return "001";
        default:
          return "";
      }
    })
    .join("-");

  //  Перетаскивание окончено
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = format.findIndex((i) => i.id === active.id);
      const newIndex = format.findIndex((i) => i.id === over.id);
      setFormat(arrayMove(format, oldIndex, newIndex));
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/inventory/${inventoryId}`)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Custom ID Format � {inventory.title}
      </h1>

      <p className="text-gray-600 mb-4">
        Перетаскивай блоки, чтобы изменить порядок частей ID 👇
      </p>

      {/*  Контейнер DnD */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={format.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {format.map((part) => (
              <SortableItem
                key={part.id}
                part={part}
                removePart={removePart}
                updateValue={updateValue}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/*  Кнопки добавления */}
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => addPart("text")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Text
        </button>
        <button
          onClick={() => addPart("date")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Date
        </button>
        <button
          onClick={() => addPart("random6")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Random 6
        </button>
        <button
          onClick={() => addPart("guid")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + GUID
        </button>
        <button
          onClick={() => addPart("seq")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Sequence
        </button>
      </div>

      {/* 👁 Предпросмотр */}
      <div className="mt-6 p-3 bg-gray-100 rounded">
        <p className="font-semibold mb-1">Preview:</p>
        <div className="font-mono">{preview}</div>
      </div>

      {/*  Кнопка сохранения */}
      <button
        onClick={saveFormat}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Format
      </button>
    </div>
  );
}

//  Компонент отдельного блока (перетаскиваемый)
function SortableItem({ part, removePart, updateValue }) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id: part.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 border rounded p-2 bg-gray-50 hover:bg-gray-100 shadow-sm"
    >
      <button
        className="p-1 cursor-grab text-gray-500"
        title="Drag"
        aria-label="Drag"
        {...attributes}
        {...listeners}
      >
        ↕
      </button>
      <span className="font-medium text-gray-800 mr-1">{part.type}</span>
      {part.type === "text" && (
        <input
          value={part.value}
          onChange={(e) => updateValue(part.id, e.target.value)}
          className="border p-1 rounded flex-1 text-gray-800"
          placeholder="Fixed text..."
        />
      )}
      <button
        onClick={() => removePart(part.id)}
        className="text-red-600 ml-auto"
      >
        ✕
      </button>
    </div>
  );
}
