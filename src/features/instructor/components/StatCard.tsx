type Props = {
  title: string;
  value: number;
  trend: string;
  footer: string;
};

const StatCard = ({ title, value, trend, footer }: Props) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <span className="stat-trend">{trend}</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-footer">{footer}</div>
    </div>
  );
};

export default StatCard;
