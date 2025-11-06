import { create } from "zustand";
import axios from "axios";

const API_URL = "/api/items";

export const useItemStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async (inventoryId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}?inventoryId=${inventoryId}`);
      set({ items: res.data });
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (inventoryId, data) => {
    try {
      const res = await axios.post(API_URL, { inventoryId, ...data });
      set({ items: [...get().items, res.data] });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  },

  updateItem: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      set({
        items: get().items.map((item) => (item.id === id ? res.data : item)),
      });
    } catch (err) {
      console.error("Error updating item:", err);
    }
  },

  deleteItem: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set({ items: get().items.filter((i) => i.id !== id) });
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  },
}));
