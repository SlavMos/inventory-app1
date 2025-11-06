import { useState } from "react";
import { useStore } from "../store/useStore";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(email, password);
    if (res === true) navigate("/");
    else setError(res?.error || "Unable to register. Try a different email.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-3 font-medium">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            autoComplete="new-password"
            required
          />
        </div>

        {/* Role selection removed; all registrations are users */}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600 mt-3">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
