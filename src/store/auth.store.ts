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
  hydrate: () => void;
};

const hydrateUser = (): User | null => {
  const stored = storage.getUser();
  if (!stored) return null;
  return {
    id: stored.id,
    username: stored.username,
    role: stored.role as UserRoles,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: hydrateUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),

  login: (user, token) => {
    storage.setToken(token);
    storage.setUser({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.removeToken();
    storage.removeUser();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const token = storage.getToken();
    const user = token ? hydrateUser() : null;
    set({
      user,
      token,
      isAuthenticated: !!token,
    });
  },
}));
