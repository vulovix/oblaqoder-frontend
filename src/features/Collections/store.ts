import { create } from "zustand";
import type { ICollection, NewCollection } from "./types";
import { api } from "~/lib/axios";
import { createSlug } from "~/utils/string";

interface CollectionState {
  collections: ICollection[];
  isLoading: boolean;
  resetState: () => void;
  fetchCollections: () => void;
  fetchAllCollections: () => void;
  addCollection: (collection: NewCollection) => void;
  removeCollection: (id: number) => void;
  renameCollection: (id: number, newName: string) => void;
  toggleVisibility: (id: number) => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  isLoading: false,
  resetState: () => {
    set({ collections: [] });
  },
  fetchCollections: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICollection[]>("/collections");
      set({ collections: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      set({ collections: [], isLoading: false });
    }
  },

  fetchAllCollections: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICollection[]>("/collections/all");
      set({ collections: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      set({ collections: [], isLoading: false });
    }
  },

  addCollection: async (collection: NewCollection) => {
    try {
      const res = await api.post<ICollection>("/collections", collection);
      set((state) => ({
        collections: [...state.collections, res.data],
      }));
    } catch (error) {
      console.error("Failed to add collection:", error);
    }
  },

  removeCollection: async (id) => {
    try {
      await api.delete(`/collections/${id}`);
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Failed to remove collection:", error);
    }
  },

  renameCollection: async (id, newName) => {
    try {
      const res = await api.put<ICollection>(`/collections/${id}`, { name: newName, slug: createSlug(newName) });
      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to rename collection:", error);
    }
  },

  toggleVisibility: async (id) => {
    try {
      const state = get();
      const current = state.collections.find((c) => c.id === id);
      if (!current) return;

      const res = await api.put<ICollection>(`/collections/${id}`, {
        isPublic: !current.isPublic,
      });

      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  },
}));
