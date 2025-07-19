import { create } from "zustand";
import type { ICategory, NewCategory } from "./types";
import { api } from "~/lib/axios";
import { createSlug } from "~/utils/string";

interface CategoryState {
  categories: ICategory[];
  isLoading: boolean;
  resetState: () => void;
  fetchAllCategories: () => void;
  fetchPublicCategories: () => void;
  addCategory: (category: NewCategory) => void;
  removeCategory: (id: number) => void;
  renameCategory: (id: number, newName: string) => void;
  toggleVisibility: (id: number) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  resetState: () => {
    set({ categories: [] });
  },
  fetchAllCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICategory[]>("/categories/all");
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ categories: [], isLoading: false });
    }
  },

  fetchPublicCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICategory[]>("/categories");
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ categories: [], isLoading: false });
    }
  },

  addCategory: async (category: NewCategory) => {
    try {
      const res = await api.post<ICategory>("/categories", category);
      set((state) => ({
        categories: [...state.categories, res.data],
      }));
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  },

  removeCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Failed to remove category:", error);
    }
  },

  renameCategory: async (id, newName) => {
    try {
      const res = await api.put<ICategory>(`/categories/${id}`, { name: newName, slug: createSlug(newName) });
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to rename category:", error);
    }
  },

  toggleVisibility: async (id) => {
    try {
      const state = get();
      const current = state.categories.find((c) => c.id === id);
      if (!current) return;

      const res = await api.put<ICategory>(`/categories/${id}`, {
        isPublic: !current.isPublic,
      });

      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  },
}));
