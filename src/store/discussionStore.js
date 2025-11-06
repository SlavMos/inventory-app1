import { create } from "zustand";

export const useDiscussionStore = create((set, get) => ({
  discussions: {}, // { inventoryId: [ { id, author, text, createdAt } ] }

  addMessage: (inventoryId, message) => {
    set((state) => {
      const old = state.discussions[inventoryId] || [];
      const newMessage = {
        id: Date.now(),
        ...message,
        createdAt: new Date().toISOString(),
      };
      return {
        discussions: {
          ...state.discussions,
          [inventoryId]: [...old, newMessage],
        },
      };
    });
  },

  getMessages: (inventoryId) => get().discussions[inventoryId] || [],
}));
