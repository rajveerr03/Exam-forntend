
import { ReactNode, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Home, User, FileText, Settings, Calendar , Users} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  // const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    setRole(storedRole);
    getUser(userId);
    // console.log(storedRole)
  }, []);
  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  let getUser = async (userId: any) => {
    // console.log(userId)
    let res = await axios.get(`https://exam-backend-eight.vercel.app/register/${userId}`);
    // console.log(res.data.data);
    setUser(res.data.data);
  }

  const getProfilePath = () => {
    if (role === "faculty") return "/faculty/profile";
    if (role === "coe") return "/coe/profile";
    if (role === "admin") return "/admin/profile";
    return "/dashboard";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  let logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setRole(null);
    setUser({ name: "" });
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-university-primary text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 sm:w-16"
          } overflow-hidden`}
      >
        <div className="px-4 py-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-semibold ${sidebarOpen ? "" : "hidden sm:hidden"}`}>
              Exam Portal
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-university-primary/90"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className={`mb-8 ${sidebarOpen ? "block" : "hidden sm:hidden"}`}>
            <div className="w-20 h-20 rounded-full bg-university-secondary mx-auto mb-4 grid place-items-center">
              <span className="text-2xl font-bold">{user?.name.charAt(0) || "U"}</span>
            </div>
            <div className="text-center">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-white/70 capitalize">{role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 mt-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                    isActive("/dashboard") && "bg-university-primary/90",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <Home className="h-5 w-5 min-w-5" />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to={getProfilePath()}
                  className={cn(
                    "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                    isActive(getProfilePath()) && "bg-university-primary/90",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <User className="h-5 w-5 min-w-5" />
                  {sidebarOpen && <span className="ml-3">Profile</span>}
                </Link>
              </li>

              {role === "faculty" && (
                <>
                  <li>
                    <Link
                      to="#"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <FileText className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Papers</span>}
                    </Link>
                  </li>
                </>
              )}

              {role === "coe" && (
                <>
                  <li>
                    <Link
                      to="#"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <FileText className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Papers</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <Settings className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Settings</span>}
                    </Link>
                  </li>
                </>
              )}

              {role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/admin/department"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        isActive("/admin/department") && "bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <FileText className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Departments</span>}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/user"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <Users className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Users</span>}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="#"
                      className={cn(
                        "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      <Settings className="h-5 w-5 min-w-5" />
                      {sidebarOpen && <span className="ml-3">Settings</span>}
                    </Link>
                  </li>


                </>

              )
              }
              <li>
                <Link
                  to="/exam"
                  className={cn(
                    "flex items-center py-2 px-4 rounded hover:bg-university-primary/90",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <Calendar className="h-5 w-5 min-w-5" />
                  {sidebarOpen && <span className="ml-3">Exam Schedule</span>}
                </Link>
              </li>

            </ul>
          </nav>
          {/* Logout */}
          <Button
            variant="outline"
            onClick={logout}
            className={cn(
              "mt-auto border-white text-university-primary",
              sidebarOpen ? "w-full justify-start" : "mx-auto p-2"
            )}
          >
            {sidebarOpen ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-university-primary">
              { }
            </h1>
            <div>
              <span className="font-medium mr-2">{user?.name}</span>
              <span className="bg-university-accent text-university-primary text-xs px-2 py-1 rounded-full capitalize">
                {role}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        <footer className="bg-white py-4 px-6 text-center text-sm text-gray-500">
          University Exam Paper Submission Portal © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
