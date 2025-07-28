import { create } from "zustand";
import { api } from "~/lib/axios";
import type { ITopic } from "./types";

interface TopicPickerState {
  loading: boolean;
  topics: ITopic[];
  resetState: () => void;
  fetchTopics: () => void;
  fetchAllTopics: () => void;
}

export const useTopicPickerStore = create<TopicPickerState>((set) => ({
  loading: false,
  topics: [],
  resetState: () => {
    set({ topics: [] });
  },
  fetchTopics: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ITopic[]>("/topics");
      set({ topics: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch collections", err);
      set({ loading: false });
    }
  },
  fetchAllTopics: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ITopic[]>("/topics/all");
      set({ topics: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch collections", err);
      set({ loading: false });
    }
  },
}));
