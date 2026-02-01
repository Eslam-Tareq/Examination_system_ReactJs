import { create } from "zustand";
import { storage } from "@/utils/storage";
import { UserRoles } from "@/types/userRoles";

type User = {
  id: number;
  username: string;
  role: UserRoles;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),

  login: (user, token) => {
    storage.setToken(token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.removeToken();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
