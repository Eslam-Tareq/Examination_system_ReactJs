import StatCard from "../../components/StatCard";
import { OVERVIEW_STATS } from "./overview.config";
import { useEffect } from "react";

const OverviewSection = () => {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".stat-card");

    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.15}s`;
    });
  }, []);

  return (
    <section className="overview-section fade-in">
      <div className="overview-header">
        <h2 className="overview-title">Dashboard Overview</h2>
        <p className="overview-subtitle">
          Your teaching performance at a glance
        </p>
      </div>

      <div className="overview-grid">
        {OVERVIEW_STATS.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            trend={item.trend}
            footer={item.footer}
          />
        ))}
      </div>
    </section>
  );
};

export default OverviewSection;
