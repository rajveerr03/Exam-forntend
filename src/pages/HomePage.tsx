
import AuthLayout from "@/components/Layout/AuthLayout";
import LoginRegisterBox from "@/components/Auth/LoginRegisterBox";
// import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  // const { isAuthenticated } = useAuth();
  
  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" />;
  // }

  return (
    <AuthLayout>
      <div className="w-full max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          University Exam Paper Submission Portal
        </h1>
        <p className="text-xl text-white/90">
          A secure platform for faculty and examination controllers
        </p>
      </div>
      <LoginRegisterBox />
    </AuthLayout>
  );
};

export default HomePage;
