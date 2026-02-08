import { useState, useEffect, useMemo } from "react";
import {
  Submission,
  SubmissionFilters,
  SubmissionStats,
  submissionService,
} from "@/services/submissions";
import { SubmissionStatsDisplay } from "../components/submissions/SubmissionStats";
import { SubmissionsFiltersBar } from "../components/submissions/SubmissionsFilters";
import { SubmissionList } from "../components/submissions/SubmissionList";
import { useAuthStore } from "@/store";

export const SubmissionsPage = () => {
  // State
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    graded: 0,
    pending: 0,
    avgGrade: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filters, setFilters] = useState<SubmissionFilters>({
    courseId: "all",
    examId: "all",
    studentId: "all",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, we might fetch specific page/filters from API
        // For now, we fetch all and filter client-side as per mock implementation pattern
        const data = await submissionService.getInstructorSubmissions(user?.id || 1);
        setSubmissions(data);
        
        const statsData = await submissionService.getSubmissionStats(user?.id || 1);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Derived Data (Filters & Search)
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchesCourse =
        filters.courseId === "all" || s.Course_ID.toString() === filters.courseId;
      const matchesExam =
        filters.examId === "all" || s.Exam_ID.toString() === filters.examId;
      const matchesStudent =
        filters.studentId === "all" || s.Stud_ID.toString() === filters.studentId;
      const matchesStatus =
        filters.status === "all" || s.Status === filters.status;
      
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        s.Student_Name.toLowerCase().includes(search) ||
        s.Exam_Title.toLowerCase().includes(search) ||
        s.Course_Name.toLowerCase().includes(search);

      return (
        matchesCourse &&
        matchesExam &&
        matchesStudent &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [submissions, filters, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Extract unique options for filters
  const courseOptions = useMemo(() => {
    const unique = new Map();
    submissions.forEach(s => unique.set(s.Course_ID, s.Course_Name));
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [submissions]);

  const examOptions = useMemo(() => {
    // Filter exams based on selected course
    const relevantSubmissions = filters.courseId === "all"
      ? submissions
      : submissions.filter(s => s.Course_ID.toString() === filters.courseId);

    const unique = new Map();
    relevantSubmissions.forEach(s => unique.set(s.Exam_ID, s.Exam_Title));
    return Array.from(unique.entries()).map(([id, title]) => ({ id, title }));
  }, [submissions, filters.courseId]);

  const studentOptions = useMemo(() => {
    // Filter students based on selected course
    const relevantSubmissions = filters.courseId === "all"
      ? submissions
      : submissions.filter(s => s.Course_ID.toString() === filters.courseId);

    const unique = new Map();
    relevantSubmissions.forEach(s => unique.set(s.Stud_ID, s.Student_Name));
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [submissions, filters.courseId]);

  const handleViewSubmission = (submission: Submission) => {
    // Navigate to details or open modal
    console.log("View submission:", submission);
    // TODO: Implement view modal or navigation
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading submissions...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Submissions</h1>
        <p className="text-secondary">
          Review and manage student exam submissions
        </p>
      </div>

      <SubmissionStatsDisplay stats={stats} />

      <SubmissionsFiltersBar
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1); // Reset page on filter change
        }}
        searchTerm={searchTerm}
        onSearchChange={(s) => {
          setSearchTerm(s);
          setCurrentPage(1);
        }}
        courses={courseOptions}
        exams={examOptions}
        students={studentOptions}
      />

      <SubmissionList
        submissions={paginatedSubmissions}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        total={filteredSubmissions.length}
        onPageChange={setCurrentPage}
        onViewSubmission={handleViewSubmission}
      />
    </div>
  );
};

export default SubmissionsPage;
