import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { api } from "~/lib/axios";
import { supabase } from "~/lib/supabase";

interface Account {
  id: number;
  email: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  account: Account | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAppReady: boolean;
  signOut: () => Promise<void>;
  getUserByEmail: (email: string) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<void>;
}

interface RegisterPayload {
  email: string;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  user: null,
  account: null,
  loading: true,
  isLoggedIn: false,
  isAppReady: false,
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, account: null, isLoggedIn: false });
  },
  registerUser: async (payload: RegisterPayload) => {
    await api.post<Account>("/users", payload);
  },
  getUserByEmail: async (email: string) => {
    const response = await api.post<Account>("/users/email", { email });
    if (response.data) {
      set({ account: response.data, isLoggedIn: true, isAppReady: true });
    }
  },
}));

const loadSession = (session: Session | null) => {
  useAuth.setState({
    session,
    user: session?.user,
    loading: false,
    isAppReady: false,
  });
  const email = session?.user?.email;
  if (email) {
    useAuth.getState().getUserByEmail(email);
  } else {
    // setTimeout(() => {
    useAuth.setState({
      isAppReady: true,
    });
    // }, 1000);
  }
  // setTimeout(() => {
  //   console.log("acc", useAuth.getState().account);
  // }, 3000);
};

// On init (refresh or hard reload)
supabase.auth.getSession().then(({ data: { session } }) => {
  loadSession(session);
});

// On login / logout
supabase.auth.onAuthStateChange((_event, session) => {
  // console.log("onAuthStateChange");
  loadSession(session);
});
