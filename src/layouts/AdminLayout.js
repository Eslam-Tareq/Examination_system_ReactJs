import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
    return (_jsxs("div", { className: "flex", children: [_jsx("aside", { className: "w-64 bg-slate-800 text-white p-4", children: "Admin Menu" }), _jsx("main", { className: "flex-1 p-4", children: _jsx(Outlet, {}) })] }));
};
export default AdminLayout;
