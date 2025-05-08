import { useState , useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

type Department = {
  _id: string;
  departmentName: string;
};

const LoginRegisterBox = () => {
  const [isSlideRight, setIsSlideRight] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    otp: ""
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    employeeId: "",
    email: "",
    mobile: "",
    role: "faculty",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);

  // const { login, verifyOtp, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDepartmentList();
  }, []);

  const getDepartmentList = async () => {
    try {
      const res = await axios.get("http://localhost:3000/department");
      setDepartments(res.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!showOtp) {
      // const success = await login(loginData.username, loginData.password);
      let submitData = {
        email: loginData.email,
        password: loginData.password
      };

      let res = await axios.post("http://localhost:3000/login" , submitData)

      if (res.data.success === true) {
        setShowOtp(true);
      }
      else{
        toast.error(res.data.message);
      }
    } else {

      if (!loginData.otp) {
        toast.error("Please enter the OTP");
        return;
      }

      let res = await axios.post("http://localhost:3000/verifyotp" , loginData)
      if (res.data.success === true) {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.userId);
        navigate("/dashboard");
      }
      else{
        toast.error(res.data.message);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!registerData.name || !registerData.email || !registerData.password || 
        !registerData.employeeId || !registerData.role || !registerData.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const res = await axios.post("http://localhost:3000/register", registerData)
    if (res.data.success === true) {
      toast.success("Registration successful! Please log in.");
      setIsSlideRight(false);
      setRegisterData({
        name: "",
        employeeId: "",
        email: "",
        mobile: "",
        role: "faculty",
        password: "",
        confirmPassword: "",
        department: "",
      });
    }
  };

  return (
    <div className={`auth-box ${isSlideRight ? "slide-right" : ""}`}>
    <div className="auth-box-forms">
      <div className="form-container login-container">
        <form className="h-full flex flex-col justify-center items-center p-10" onSubmit={!showOtp ? handleLoginSubmit : handleLoginSubmit}>
          <h1 className="text-2xl font-bold mb-6 text-university-primary">Sign In</h1>

          {!showOtp ? (
            <>
              <div className="space-y-4 w-full max-w-sm">
                <div className="space-y-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="username"
                    type="email"
                    placeholder="Your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-university-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="mt-6 bg-university-primary hover:bg-university-primary/90 w-full max-w-sm">
                Sign In
              </Button>
            </>
          ) : (
            <div className="space-y-4 w-full max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={loginData.otp}
                  onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                  required
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">OTP sent to your email address</p>
              </div>

              <Button type="submit" className="mt-2 bg-university-primary hover:bg-university-primary/90 w-full">
                Verify OTP
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-university-primary hover:underline"
                  onClick={() => setShowOtp(false)}
                >
                  Back to login
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>

    {/* Register Form */}
    <div className="auth-box">
      <div className="form-container register-container">
        <form
          onSubmit={handleRegisterSubmit}
          className="max-h-[calc(100vh-100px)] overflow-y-auto thin-scrollbar flex flex-col items-center p-10"
        >
          <h1 className="text-2xl font-bold mb-6 text-university-primary">Create Account</h1>

          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Your employee ID"
                value={registerData.employeeId}
                onChange={(e) => setRegisterData({ ...registerData, employeeId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="Your mobile number"
                value={registerData.mobile}
                onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={registerData.role}
                onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="coe">COE (Controller of Examination)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          { registerData.role === "faculty" && 

            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={registerData.department}
                  onValueChange={(value) => setRegisterData({ ...registerData, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department._id} value={department.departmentName}>
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            }

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-6 bg-university-primary hover:bg-university-primary/90 w-full max-w-md">
            Register
          </Button>
        </form>
      </div>
    </div>

    {/* Overlay */}
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-6 text-white/90">
            Already have an account? Sign in to access your university exam portal
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSlideRight(false)}
            className="border-white text-university-primary hover:bg-white hover:text-university-primary"
          >
            Sign In
          </Button>
        </div>

        <div className="overlay-panel overlay-right">
          <h1 className="text-3xl font-bold mb-4">Hello, Colleague!</h1>
          <p className="mb-6 text-white/90">
            Register with your university credentials to join the exam paper submission portal
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSlideRight(true)}
            className="border-white text-university-secondary hover:bg-white hover:text-university-secondary"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LoginRegisterBox;
