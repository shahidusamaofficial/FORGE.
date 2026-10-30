// FORGE — Auth store (Zustand) wrapping Supabase auth
// Falls back gracefully when Supabase isn't configured.

"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  initialize: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      set({ loading: false });
      return;
    }

    set({ loading: true });

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      set({ user: session.user, profile, loading: false });
    } else {
      set({ user: null, profile: null, loading: false });
    }

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ user: session.user, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  signUp: async (email, password, fullName) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment." };
    }

    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || email.split("@")[0] },
      },
    });

    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      set({ user: data.user, profile, loading: false });
    }
    return { error: null };
  },

  signIn: async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      set({ user: data.user, profile, loading: false });
    }
    return { error: null };
  },

  signOut: async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    set({ user: null, profile: null, loading: false });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await fetchProfile(user.id);
    set({ profile });
  },
}));

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}
