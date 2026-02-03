import { create } from "zustand";

export type ToastType = "success" | "error" | "warning";

export type ToastItem = {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration: number;
};

type ToastState = {
  toasts: ToastItem[];
  showToast: (
    message: string,
    type: ToastType,
    title?: string,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message, type, title, duration = 5000) => {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [...state.toasts, { id, message, type, title, duration }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
