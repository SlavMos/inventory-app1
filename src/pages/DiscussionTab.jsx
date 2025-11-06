import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DiscussionTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inventoryId = Number(id);

  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const listRef = useRef(null);

  const API = "/api/discussions";

  async function fetchDiscussions() {
    if (!Number.isFinite(inventoryId)) return;
    try {
      const res = await fetch(`${API}?inventoryId=${inventoryId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchDiscussions();
    const t = setInterval(fetchDiscussions, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryId]);

  useEffect(() => {
    // auto scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!author.trim() || !message.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryId, author, message }),
    });
    setMessage("");
    await fetchDiscussions();
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <button onClick={() => navigate(`/inventory/${inventoryId}`)} className="text-blue-600 hover:underline mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Discussion</h1>

      <div ref={listRef} className="flex-1 overflow-y-auto border rounded-xl p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">No messages yet...</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="mb-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-600">{m.author}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="bg-white border rounded-lg p-2 mt-1 shadow-sm">{m.message}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 border-t pt-3 bg-white">
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-56 border rounded-lg p-2"
        />
        <input
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
