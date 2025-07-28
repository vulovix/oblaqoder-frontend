import { create } from "zustand";
import type { ITopic, NewTopic } from "./types";
import type { TopicWithRelations } from "./types";
import { api } from "~/lib/axios";
import { createSlug } from "~/utils/string";

interface TopicState {
  topics: ITopic[];
  isLoading: boolean;
  currentTopicRelations: TopicWithRelations | null;

  resetState: () => void;
  fetchAllTopics: () => void;
  fetchPublicTopics: () => void;
  addTopic: (topic: NewTopic) => void;
  removeTopic: (id: number) => void;
  renameTopic: (id: number, newName: string) => void;
  toggleVisibility: (id: number) => void;

  clearTopicRelations: () => Promise<void>;
  fetchTopicRelations: (topicId: number) => Promise<void>;
  updateTopicRelations: (topicId: number, values: string[]) => Promise<void>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  isLoading: false,
  currentTopicRelations: null,

  resetState: () => {
    set({ topics: [], currentTopicRelations: null });
  },

  fetchAllTopics: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ITopic[]>("/topics/all");
      set({ topics: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      set({ topics: [], isLoading: false });
    }
  },

  fetchPublicTopics: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ITopic[]>("/topics");
      set({ topics: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      set({ topics: [], isLoading: false });
    }
  },

  addTopic: async (topic) => {
    try {
      const res = await api.post<ITopic>("/topics", topic);
      set((state) => ({
        topics: [...state.topics, res.data],
      }));
    } catch (error) {
      console.error("Failed to add topic:", error);
    }
  },

  removeTopic: async (id) => {
    try {
      await api.delete(`/topics/${id}`);
      set((state) => ({
        topics: state.topics.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Failed to remove topic:", error);
    }
  },

  renameTopic: async (id, newName) => {
    try {
      const res = await api.put<ITopic>(`/topics/${id}`, {
        name: newName,
        slug: createSlug(newName),
      });

      set((state) => ({
        topics: state.topics.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to rename topic:", error);
    }
  },

  toggleVisibility: async (id) => {
    try {
      const state = get();
      const current = state.topics.find((c) => c.id === id);
      if (!current) return;

      const res = await api.put<ITopic>(`/topics/${id}`, {
        isPublic: !current.isPublic,
      });

      set((state) => ({
        topics: state.topics.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  },

  fetchTopicRelations: async (topicId) => {
    try {
      const res = await api.get<TopicWithRelations>(`/topics/${topicId}/relations`);
      set({ currentTopicRelations: res.data });
    } catch (error) {
      console.error("Failed to fetch topic relations:", error);
      set({ currentTopicRelations: null });
    }
  },
  clearTopicRelations: async () => {
    set({ currentTopicRelations: undefined });
  },
  updateTopicRelations: async (topicId: number, values: string[]) => {
    try {
      const parsed = values.map((val) => {
        const [type, id] = val.split("-");
        return { type, id: Number(id) };
      });

      await api.patch(`/topics/${topicId}/relations`, { links: parsed });

      // optional refresh:
      await get().fetchTopicRelations(topicId);
    } catch (error) {
      console.error("Failed to update topic relations", error);
    }
  },
}));
