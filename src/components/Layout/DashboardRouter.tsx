import { Navigate } from "react-router-dom";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import FacultyDashboard from "@/pages/dashboards/FacultyDashboard";
import CoeDashboard from "@/pages/dashboards/CoeDashboard";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // to wait for useEffect to complete

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setLoading(false); // done loading after role is read
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  if (role !== "admin" && role !== "faculty" && role !== "coe") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "faculty" && <FacultyDashboard />}
      {role === "coe" && <CoeDashboard />}
    </>
  );
};

export default DashboardPage;
