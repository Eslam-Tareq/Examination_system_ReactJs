import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "@/components/routing/RoleGuard";
import LandingRedirect from "@/components/routing/LandingRedirect";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ToastContainer from "@/components/Ui/ToastContainer";
import InstructorLayout from "@/features/instructor/layout/InstructorLayout";
import OverviewSection from "@/features/instructor/sections/overview/OverviewSection";
import ExaminationsSection from "@/features/instructor/sections/examinations/ExaminationsSection";
import CoursesSection from "@/features/instructor/sections/courses/CoursesSection";
import StudentsSection from "@/features/instructor/sections/students/StudentsSection";
import SubmissionsPage from "@/features/instructor/pages/SubmissionsPage";
import ExamPreviewPage from "@/features/instructor/pages/ExamPreviewPage";
import ExamEditPage from "@/features/instructor/pages/ExamEditPage";
import CreateExamPage from "@/features/instructor/pages/CreateExamPage";
import { UserRoles } from "@/types/userRoles";

const ExamStart = () => <div>Exam Start</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const StudentDashboard = () => (
  <div className="text-white text-2xl">Student Portal</div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Auth routes: login + landing redirect */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LandingRedirect />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRoles.INSTRUCTOR]}>
                <MainLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route
            path="/instructor"
            element={
              <ProtectedRoute>
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewSection />} />
            <Route path="examinations" element={<ExaminationsSection />} />
            <Route path="examinations/create" element={<CreateExamPage />} />
            <Route path="courses" element={<CoursesSection />} />
            <Route path="students" element={<StudentsSection />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route
              path="examinations/:examId/preview"
              element={<ExamPreviewPage />}
            />
            <Route
              path="examinations/:examId/edit"
              element={<ExamEditPage />}
            />
            <Route path="*" element={<Navigate to="/instructor" replace />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRoles.STUDENT]}>
                <MainLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/exam/:id" element={<ExamStart />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 - catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
