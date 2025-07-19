import { create } from "zustand";
import { api } from "~/lib/axios";
import type { ICommunity } from "./types";

interface CommunityPickerState {
  loading: boolean;
  communities: ICommunity[];
  resetState: () => void;
  fetchCommunities: () => void;
  fetchAllCommunities: () => void;
}

export const useCommunityPickerStore = create<CommunityPickerState>((set) => ({
  loading: false,
  communities: [],
  resetState: () => {
    set({ communities: [] });
  },
  fetchCommunities: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICommunity[]>("/communities");
      set({ communities: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch communities", err);
      set({ loading: false });
    }
  },
  fetchAllCommunities: async () => {
    set({ loading: true });
    try {
      const res = await api.get<ICommunity[]>("/communities/all");
      set({ communities: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch communities", err);
      set({ loading: false });
    }
  },
}));
