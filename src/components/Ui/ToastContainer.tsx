import { useToastStore } from "@/store/toast.store";
import Toast from "./Toast";

const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
