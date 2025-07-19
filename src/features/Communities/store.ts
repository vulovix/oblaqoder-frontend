import { create } from "zustand";
import type { ICommunity, NewCommunity } from "./types";
import { api } from "~/lib/axios";
import { createSlug } from "~/utils/string";

interface CommunityState {
  communities: ICommunity[];
  isLoading: boolean;
  resetState: () => void;
  fetchCommunities: () => void;
  fetchAllCommunities: () => void;
  addCommunity: (community: NewCommunity) => void;
  removeCommunity: (id: number) => void;
  renameCommunity: (id: number, newName: string) => void;
  toggleVisibility: (id: number) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [],
  isLoading: false,
  resetState: () => {
    set({ communities: [] });
  },
  fetchCommunities: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICommunity[]>("/communities");
      set({ communities: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      set({ communities: [], isLoading: false });
    }
  },

  fetchAllCommunities: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<ICommunity[]>("/communities/all");
      set({ communities: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      set({ communities: [], isLoading: false });
    }
  },

  addCommunity: async (community: NewCommunity) => {
    try {
      const res = await api.post<ICommunity>("/communities", community);
      set((state) => ({
        communities: [...state.communities, res.data],
      }));
    } catch (error) {
      console.error("Failed to add community:", error);
    }
  },

  removeCommunity: async (id) => {
    try {
      await api.delete(`/communities/${id}`);
      set((state) => ({
        communities: state.communities.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Failed to remove community:", error);
    }
  },

  renameCommunity: async (id, newName) => {
    try {
      const res = await api.put<ICommunity>(`/communities/${id}`, { name: newName, slug: createSlug(newName) });
      set((state) => ({
        communities: state.communities.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to rename community:", error);
    }
  },

  toggleVisibility: async (id) => {
    try {
      const state = get();
      const current = state.communities.find((c) => c.id === id);
      if (!current) return;

      const res = await api.put<ICommunity>(`/communities/${id}`, {
        isPublic: !current.isPublic,
      });

      set((state) => ({
        communities: state.communities.map((c) => (c.id === id ? res.data : c)),
      }));
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  },
}));
