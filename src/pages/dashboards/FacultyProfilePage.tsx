
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import UserProfileCard from "@/components/Profile/UserProfileCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Shield, Clock, Activity } from "lucide-react";
import axios from "axios";

const FacultyProfilePage = () => {
 
  const [ user, setUser ] = useState()

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getUser(userId);
  }, []);

let getUser = async (userId: any) => {
  let res = await axios.get(`https://exam-backend-eight.vercel.app/register/${userId}`);
  setUser(res.data.data);
}

  return (
    <DashboardLayout title="My Profile">
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
        {user ? <UserProfileCard user={user} /> : <p>Loading profile...</p>}
        </div>
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent actions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-university-primary pl-4 py-1">
                  <p className="font-medium">Question Paper Submitted</p>
                  <p className="text-sm text-muted-foreground">Embedded Systems (ECE420)</p>
                  <p className="text-xs text-muted-foreground">15 Apr 2023, 10:30 AM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">Login</p>
                  <p className="text-sm text-muted-foreground">From New Delhi, India</p>
                  <p className="text-xs text-muted-foreground">14 Apr 2023, 09:15 AM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">Profile Updated</p>
                  <p className="text-sm text-muted-foreground">Changed profile picture</p>
                  <p className="text-xs text-muted-foreground">10 Apr 2023, 02:45 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Enabled via Email OTP</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Active
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password Last Changed</p>
                    <p className="text-sm text-muted-foreground">30 days ago</p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    Good
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Login History
              </CardTitle>
              <CardDescription>
                Recent login activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New Delhi, India</p>
                    <p className="text-sm text-muted-foreground">14 Apr 2023, 09:15 AM</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Current
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Mumbai, India</p>
                    <p className="text-sm text-muted-foreground">10 Apr 2023, 08:30 AM</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">New Delhi, India</p>
                    <p className="text-sm text-muted-foreground">05 Apr 2023, 10:45 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfilePage;
