import { create } from "zustand";
import axios from "axios";

const API_URL = "/api/inventories";

export const useInventoryStore = create((set, get) => ({
  inventories: [],
  loading: false,
  // Client-side only storage for Custom ID formats and sequences
  customFormats: {}, // { [inventoryId:number]: Array<{id:number,type:string,value?:string}> }
  customSeq: {}, // { [inventoryId:number]: number }
  // Client-side only storage for Custom Fields definitions per inventory
  fieldsMap: {}, // { [inventoryId:number]: Array<{id:number,title:string,type:string,showInTable?:boolean}> }

  fetchInventories: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(API_URL);
      set({ inventories: res.data });
    } catch (err) {
      console.error("Error fetching inventories:", err);
    } finally {
      set({ loading: false });
    }
  },

  addInventory: async (payload) => {
    try {
      const title = typeof payload === "string" ? payload : payload?.title;
      if (!title) throw new Error("Title is required");
      await axios.post(API_URL, { title });
      // reload from server to stay consistent
      const res = await axios.get(API_URL);
      set({ inventories: res.data });
    } catch (err) {
      console.error("Error adding inventory:", err);
    }
  },

  deleteInventory: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const res = await axios.get(API_URL);
      set({
        inventories: res.data,
        customFormats: Object.fromEntries(
          Object.entries(get().customFormats).filter(([k]) => Number(k) !== id)
        ),
        customSeq: Object.fromEntries(
          Object.entries(get().customSeq).filter(([k]) => Number(k) !== id)
        ),
        fieldsMap: Object.fromEntries(
          Object.entries(get().fieldsMap).filter(([k]) => Number(k) !== id)
        ),
      });
    } catch (err) {
      console.error("Error deleting inventory:", err);
    }
  },

  // Option A: keep format only on client (not persisted to DB)
  updateCustomIdFormat: (inventoryId, format) => {
    const id = Number(inventoryId);
    set({ customFormats: { ...get().customFormats, [id]: format } });
  },
  nextCustomIdSeq: (inventoryId) => {
    const id = Number(inventoryId);
    const current = get().customSeq[id] ?? 1;
    set({ customSeq: { ...get().customSeq, [id]: current + 1 } });
    return current;
  },

  // Custom Fields (client-only)
  getFields: (inventoryId) => get().fieldsMap[Number(inventoryId)] || [],
  addField: (inventoryId, field) => {
    const id = Number(inventoryId);
    const current = get().fieldsMap[id] || [];
    const newField = { id: Date.now(), showInTable: true, ...field };
    set({ fieldsMap: { ...get().fieldsMap, [id]: [...current, newField] } });
  },
  removeField: (inventoryId, fieldId) => {
    const id = Number(inventoryId);
    const current = get().fieldsMap[id] || [];
    set({ fieldsMap: { ...get().fieldsMap, [id]: current.filter((f) => f.id !== fieldId) } });
  },
  updateField: (inventoryId, fieldId, updates) => {
    const id = Number(inventoryId);
    const current = get().fieldsMap[id] || [];
    set({
      fieldsMap: {
        ...get().fieldsMap,
        [id]: current.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
      },
    });
  },
}));
