import { create } from "zustand";
import type { User } from "./types";

interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
