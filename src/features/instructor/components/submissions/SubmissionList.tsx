import { Submission } from "@/services/submissions";
import { SubmissionCard } from "./SubmissionCard";
import Pagination from "@/components/pagination/Pagination";

interface SubmissionListProps {
  submissions: Submission[];
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onViewSubmission: (submission: Submission) => void;
}

export const SubmissionList = ({
  submissions,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewSubmission,
}: SubmissionListProps) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-muted text-lg">
        No submissions found matching your filters.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.Submission_ID}
            submission={submission}
            onView={onViewSubmission}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>
    </>
  );
};
