import { SubmissionStats } from "@/services/submissions";

interface StatsProps {
  stats: SubmissionStats;
}

export const SubmissionStatsDisplay = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="stat-card">
        <div className="stat-label">Total Submissions</div>
        <div className="stat-value text-white">{stats.total}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Graded</div>
        <div className="stat-value text-success">{stats.graded}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Pending</div>
        <div className="stat-value text-warning">{stats.pending}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Average Grade</div>
        <div className="stat-value text-accent-primary">{stats.avgGrade}%</div>
      </div>
    </div>
  );
};
