
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-university-primary to-university-secondary">
      <header className="w-full bg-white bg-opacity-10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">University Exam Portal</h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-white text-opacity-80">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} University Exam Paper Submission Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
