import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/features/auth/pages/LoginPage";

import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ToastContainer from "@/components/Ui/ToastContainer";
import InstructorLayout from "@/features/instructor/layout/InstructorLayout";

const Login = () => <div>Login Page</div>;
const ExamList = () => <div>Exam List</div>;
const ExamStart = () => <div>Exam Start</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const StudentDashboard = () => (
  <div className="text-white text-2xl">Student Portal</div>
);

const InstructorDashboard = () => (
  <div className="text-white text-2xl">Instructor Dashboard</div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute>
                <InstructorLayout />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Student / Exam */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<ExamList />} />
          <Route path="/exam/:id" element={<ExamStart />} />
        </Route>

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
