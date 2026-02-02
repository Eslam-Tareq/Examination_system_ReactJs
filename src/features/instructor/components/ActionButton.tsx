type Props = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

const ActionButton = ({ label, variant = "secondary", onClick }: Props) => {
  return (
    <button className={`action-btn ${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default ActionButton;
