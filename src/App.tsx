
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/context/AuthContext";
import HomePage from "./pages/HomePage";
import DashboardRouter from "./components/Layout/DashboardRouter";
import NotFound from "./pages/NotFound";
import FacultyProfilePage from "./pages/dashboards/FacultyProfilePage";
import CoeProfilePage from "./pages/dashboards/CoeProfilePage";
import AdminProfilePage from "./pages/dashboards/AdminProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDepartmentPage from "./pages/dashboards/AdminDepartmentPage";
import ExamSchedule from "./pages/dashboards/ExamSchedule";
import UserDetailPage from "./pages/dashboards/UserDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/faculty/profile" element={<FacultyProfilePage />} />
            <Route path="/coe/profile" element={<CoeProfilePage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/department" element={<AdminDepartmentPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/exam" element={<ExamSchedule />} />
            <Route path="/user" element={<UserDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
