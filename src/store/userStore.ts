import { User } from "@/types/user";
import { create } from "zustand";

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => {
  return {
    user: null,
    setUser: (user) => {
      set(() => ({ user }));
    },
  };
});
