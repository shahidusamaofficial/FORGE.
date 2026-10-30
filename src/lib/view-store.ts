// FORGE — View state router
// Manages which "page" is shown in the single-page app shell.

"use client";

import { create } from "zustand";

export type View = "home" | "account";

interface ViewState {
  currentView: View;
  setView: (view: View) => void;
  goHome: () => void;
  goAccount: () => void;
}

export const useView = create<ViewState>((set) => ({
  currentView: "home",
  setView: (view) => set({ currentView: view }),
  goHome: () => {
    set({ currentView: "home" });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goAccount: () => {
    set({ currentView: "account" });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));
