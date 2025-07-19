import { create } from "zustand";
import { api } from "~/lib/axios";
import type { ICollection } from "./types";

interface CollectionPickerState {
  loading: boolean;
  collections: ICollection[];
  resetState: () => void;
  fetchCollections: () => void;
  fetchAllCollections: () => void;
}

export const useCollectionPickerStore = create<CollectionPickerState>((set) => ({
  loading: false,
  collections: [],
  resetState: () => {
    set({ collections: [] });
  },
  fetchCollections: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICollection[]>("/collections");
      set({ collections: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch collections", err);
      set({ loading: false });
    }
  },
  fetchAllCollections: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICollection[]>("/collections/all");
      set({ collections: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch collections", err);
      set({ loading: false });
    }
  },
}));
