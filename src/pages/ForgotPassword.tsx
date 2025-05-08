
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/Layout/AuthLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

enum ResetStage {
  REQUEST = 'request',
  VERIFY = 'verify',
  NEW_PASSWORD = 'new_password',
  SUCCESS = 'success'
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ResetStage>(ResetStage.REQUEST);
  const [formData, setFormData] = useState({
    email: '',
    employeeId: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.employeeId) {
      toast.error('Please fill in all fields');
      return;
    }

    let submitData = {
      email : formData.email,
      employeeId : formData.employeeId
    }
    
    let res = await axios.post("http://localhost:3000/forgotpassword" , submitData )

    if (res.data.success === true){
      setStage(ResetStage.VERIFY)
    }
    
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    let submitData = {
      email : formData.email,
      otp : formData.otp
    }

    let res = await axios.post("http://localhost:3000/verifyopt" , submitData)
    if (res.data.success === true){
      setStage(ResetStage.NEW_PASSWORD)
    }

  };

  const handleResetPassword = async(e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    let submitData = {
      email : formData.email,
      newPassword : formData.newPassword
    }
    
    let res = await axios.patch("http://localhost:3000/newpassword" , submitData)
    if (res.data.success === true){
      setStage(ResetStage.SUCCESS)
    }

  
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const renderStageContent = () => {
    switch (stage) {
      case ResetStage.REQUEST:
        return (
          <>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your account details to receive a password reset OTP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestReset} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input 
                    id="employeeId"
                    name="employeeId"
                    placeholder="Enter your employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send OTP</Button>
              </form>
            </CardContent>
          </>
        );
      
      case ResetStage.VERIFY:
        return (
          <>
            <CardHeader>
              <CardTitle>Verify OTP</CardTitle>
              <CardDescription>
                Enter the OTP sent to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input 
                    id="otp"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    The OTP will expire in 5 minutes
                  </p>
                </div>
                <Button type="submit" className="w-full">Verify OTP</Button>
              </form>
            </CardContent>
          </>
        );
      
      case ResetStage.NEW_PASSWORD:
        return (
          <>
            <CardHeader>
              <CardTitle>Create New Password</CardTitle>
              <CardDescription>
                Enter a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Reset Password</Button>
              </form>
            </CardContent>
          </>
        );
      
      case ResetStage.SUCCESS:
        return (
          <>
            <CardHeader>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been reset successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mb-4">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button onClick={handleBackToLogin} className="w-full">
                Return to Login
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        {renderStageContent()}
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={handleBackToLogin}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;
