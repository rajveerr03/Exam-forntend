
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import UserProfileCard from "@/components/Profile/UserProfileCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Shield, Clock, Activity, Users } from "lucide-react";
import axios from "axios";

const AdminProfilePage = () => {

  const [user, setUser] = useState()

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getUser(userId);
  }, []);

  let getUser = async (userId: any) => {
    let res = await axios.get(`http://localhost:3000/register/${userId}`);
    setUser(res.data.data);
  }

  return (
    <DashboardLayout title="Admin Profile">
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          {user ? <UserProfileCard user={user} /> : <p>Loading profile...</p>}
        </div>
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Recent user management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-university-primary pl-4 py-1">
                  <p className="font-medium">New User Approved</p>
                  <p className="text-sm text-muted-foreground">Dr. Rahul Sharma (Faculty, Engineering)</p>
                  <p className="text-xs text-muted-foreground">18 Apr 2023, 02:30 PM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">Password Reset Approved</p>
                  <p className="text-sm text-muted-foreground">Anjali Patel (COE, Examination Office)</p>
                  <p className="text-xs text-muted-foreground">17 Apr 2023, 11:20 AM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">User Role Updated</p>
                  <p className="text-sm text-muted-foreground">Dr. Vikram Singh (Faculty → COE)</p>
                  <p className="text-xs text-muted-foreground">15 Apr 2023, 04:15 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="font-medium">System Settings Updated</p>
                  <p className="text-sm text-muted-foreground">Changed exam submission deadline</p>
                  <p className="text-xs text-muted-foreground">18 Apr 2023, 03:45 PM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">Login</p>
                  <p className="text-sm text-muted-foreground">From New Delhi, India</p>
                  <p className="text-xs text-muted-foreground">18 Apr 2023, 09:10 AM</p>
                </div>
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="font-medium">Announcement Posted</p>
                  <p className="text-sm text-muted-foreground">Summer Exam Schedule</p>
                  <p className="text-xs text-muted-foreground">17 Apr 2023, 01:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                System Security
              </CardTitle>
              <CardDescription>
                System security status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Required for all users</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Enforced
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Backup</p>
                    <p className="text-sm text-muted-foreground">Last backup: 6 hours ago</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Up to date
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Audit</p>
                    <p className="text-sm text-muted-foreground">Last completed: 3 days ago</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Passed
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

export default AdminProfilePage;
