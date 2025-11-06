import { create } from "zustand";
import axios from "axios";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const savedToken = localStorage.getItem(TOKEN_KEY);
if (savedToken) axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

export const useStore = create((set) => ({
  user: (() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  login: async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data || {};
      if (!token || !user) return false;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ user });
      return true;
    } catch {
      return false;
    }
  },
  register: async (email, password) => {
    try {
      const res = await axios.post("/api/auth/register", { email, password });
      const { token, user } = res.data || {};
      if (!token || !user) return false;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ user });
      return true;
    } catch (err) {
      return { ok: false, error: err?.response?.data?.error || "Registration failed" };
    }
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null });
  },
}));
