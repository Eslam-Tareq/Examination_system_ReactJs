import { jsx as _jsx } from "react/jsx-runtime";
import { useToastStore } from "@/store/toast.store";
import Toast from "./Toast";
const ToastContainer = () => {
    const toasts = useToastStore((s) => s.toasts);
    return (_jsx("div", { className: "fixed top-6 right-6 z-[9999] flex flex-col gap-4", children: toasts.map((toast) => (_jsx(Toast, { toast: toast }, toast.id))) }));
};
export default ToastContainer;
