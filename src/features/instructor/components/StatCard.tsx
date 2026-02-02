import { useEffect, useRef } from "react";

type Props = {
  title: string;
  value: number;
  trend: string;
  footer: string;
};

const StatCard = ({ title, value, trend, footer }: Props) => {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!valueRef.current) return;

    const target = value;
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      valueRef.current!.innerText = Math.floor(progress * target).toString();

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <span className="stat-trend">{trend}</span>
      </div>

      <div ref={valueRef} className="stat-value">
        0
      </div>

      <div className="stat-footer">{footer}</div>
    </div>
  );
};

export default StatCard;
