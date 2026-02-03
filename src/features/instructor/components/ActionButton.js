import { jsx as _jsx } from "react/jsx-runtime";
const ActionButton = ({ label, variant = "secondary", onClick }) => {
    return (_jsx("button", { className: `action-btn ${variant}`, onClick: onClick, children: label }));
};
export default ActionButton;
