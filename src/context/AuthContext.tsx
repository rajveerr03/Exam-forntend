
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "faculty" | "coe";
  employeeId?: string;
  school?: string;
};

// Define the context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (to be replaced with API calls)
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@university.edu",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Faculty User",
    email: "faculty@university.edu",
    password: "faculty123",
    role: "faculty",
    employeeId: "FAC001",
    school: "Engineering",
  },
  {
    id: "3",
    name: "COE User",
    email: "coe@university.edu",
    password: "coe123",
    role: "coe",
    employeeId: "COE001",
    school: "Examination Office",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<{username: string, password: string} | null>(null);
  
  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function (to be replaced with actual API call)
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user
      const foundUser = mockUsers.find(u => u.email === username && u.password === password);
      
      if (foundUser) {
        // Store pending login for OTP verification
        setPendingUser({username, password});
        toast.success("OTP sent to your email");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mock OTP verification
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate OTP with API
      if (otp === "123456" && pendingUser) {
        const foundUser = mockUsers.find(u => u.email === pendingUser.username && u.password === pendingUser.password);
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword as User);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          toast.success("Login successful");
          return true;
        }
      }
      
      toast.error("Invalid OTP");
      return false;
    } catch (error) {
      toast.error("OTP verification failed");
      return false;
    } finally {
      setLoading(false);
      setPendingUser(null);
    }
  };

  // Mock register function (to be replaced with actual API call)
  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("Register function called with:", userData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        toast.error("Email already registered");
        return false;
      }
      
      // In a real app, this would send data to your API
      // For demo purposes, we'll simulate successful registration and auto-login
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        employeeId: userData.employeeId,
        school: userData.school,
      };
      
      // Add to mock users (in a real app, this would be done by the server)
      mockUsers.push({...newUser, password: userData.password});
      console.log("Mock users after registration:", mockUsers);
      
      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast.success("Registration successful! You are now logged in.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyOtp,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
