import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
  clearAvatar: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatarUrl: null,
      setAvatarUrl: (url: string) => set({ avatarUrl: url }),
      clearAvatar: () => set({ avatarUrl: null }),
    }),
    {
      name: "cortex-profile",
    }
  )
);
