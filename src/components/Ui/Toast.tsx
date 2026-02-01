import { X } from "lucide-react";
import { ToastItem, useToastStore } from "@/store/toast.store";

const Toast = ({ toast }: { toast: ToastItem }) => {
  const removeToast = useToastStore((s) => s.removeToast);
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`
        toast-slide-in
        relative w-[360px] max-w-[90vw]
        overflow-hidden rounded-2xl
        bg-[#0b1020]/80 backdrop-blur-xl
        shadow-[0_0_30px_rgba(0,0,0,0.6)]
        border border-white/10
      `}
    >
      {/* Progress bar */}
      <div
        className={`
          absolute bottom-0 left-0 h-1
          ${isSuccess ? "bg-emerald-400" : "bg-red-400"}
          animate-toast-progress
        `}
        style={{ animationDuration: `${toast.duration}ms` }}
      />

      <div className="flex gap-4 p-4">
        {/* Icon */}
        <div
          className={`
            toast-icon-pop
            flex h-10 w-10 items-center justify-center rounded-full
            ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        {/* Content */}
        <div className="flex-1">
          {toast.title && (
            <p className="text-sm font-semibold text-white">{toast.title}</p>
          )}
          <p className="text-sm text-gray-300">{toast.message}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => removeToast(toast.id)}
          className="toast-close text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
