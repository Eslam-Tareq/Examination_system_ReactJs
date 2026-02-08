import { Search } from "lucide-react";
import { SubmissionFilters } from "@/services/submissions";

interface SubmissionsFiltersProps {
  filters: SubmissionFilters;
  onFilterChange: (filters: SubmissionFilters) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  courses: { id: number; name: string }[];
  exams: { id: number; title: string }[];
  students: { id: number; name: string }[];
}

export const SubmissionsFiltersBar = ({
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  courses,
  exams,
  students,
}: SubmissionsFiltersProps) => {
  const handleFilterChange = (key: keyof SubmissionFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-bg-secondary p-4 rounded-xl border border-border-color mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Filter */}
        <select
          value={filters.courseId}
          onChange={(e) => handleFilterChange("courseId", e.target.value)}
          className="courses-search-input w-full"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Exam Filter */}
        <select
          value={filters.examId}
          onChange={(e) => handleFilterChange("examId", e.target.value)}
          className="courses-search-input w-full"
        >
          <option value="all">All Exams</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        {/* Student Filter */}
        <select
          value={filters.studentId}
          onChange={(e) => handleFilterChange("studentId", e.target.value)}
          className="courses-search-input w-full"
        >
          <option value="all">All Students</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="courses-search-input w-full"
        >
          <option value="all">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started">Not Started</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by student name, exam title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="courses-search-input w-full"
        />
      </div>
    </div>
  );
};
