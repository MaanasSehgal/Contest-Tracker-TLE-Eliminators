import { create } from "zustand";

interface store {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

const useStore = create<store>()((set) => ({
  currentTheme: "dark",
  setCurrentTheme: (theme: string) => set({ currentTheme: theme }),
}));

export default useStore;
