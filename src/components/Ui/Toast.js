import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { useToastStore } from "@/store/toast.store";
const Toast = ({ toast }) => {
    const removeToast = useToastStore((s) => s.removeToast);
    const isSuccess = toast.type === "success";
    return (_jsxs("div", { className: `
        toast-slide-in
        relative w-[360px] max-w-[90vw]
        overflow-hidden rounded-2xl
        bg-[#0b1020]/80 backdrop-blur-xl
        shadow-[0_0_30px_rgba(0,0,0,0.6)]
        border border-white/10
      `, children: [_jsx("div", { className: `
          absolute bottom-0 left-0 h-1
          ${isSuccess ? "bg-emerald-400" : "bg-red-400"}
          animate-toast-progress
        `, style: { animationDuration: `${toast.duration}ms` } }), _jsxs("div", { className: "flex gap-4 p-4", children: [_jsx("div", { className: `
            toast-icon-pop
            flex h-10 w-10 items-center justify-center rounded-full
            ${isSuccess
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"}
          `, children: isSuccess ? "✓" : "!" }), _jsxs("div", { className: "flex-1", children: [toast.title && (_jsx("p", { className: "text-sm font-semibold text-white", children: toast.title })), _jsx("p", { className: "text-sm text-gray-300", children: toast.message })] }), _jsx("button", { onClick: () => removeToast(toast.id), className: "toast-close text-gray-400 hover:text-white", children: _jsx(X, { size: 18 }) })] })] }));
};
export default Toast;
