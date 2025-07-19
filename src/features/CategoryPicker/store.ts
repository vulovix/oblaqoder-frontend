import { create } from "zustand";
import { api } from "~/lib/axios";
import type { ICategory } from "./types";

interface CategoryPickerState {
  loading: boolean;
  categories: ICategory[];
  resetState: () => void;
  fetchCategories: () => void;
  fetchPublicCategories: () => void;
}

export const useCategoryPickerStore = create<CategoryPickerState>((set) => ({
  loading: false,
  categories: [],
  resetState: () => {
    set({ categories: [] });
  },
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICategory[]>("/categories/all");
      set({ categories: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch categories", err);
      set({ loading: false });
    }
  },
  fetchPublicCategories: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICategory[]>("/categories");
      set({ categories: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch categories", err);
      set({ loading: false });
    }
  },
}));
