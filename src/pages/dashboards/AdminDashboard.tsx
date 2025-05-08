
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  let getAllUsers = async () => {
    const res = await axios.get("https://exam-backend-eight.vercel.app/register");
    setPendingUsers(res.data.data.filter((user) => user.action === null && user.role !== "admin"));
    setUsers(res.data.data.filter((user) => user.action === "Accepted"));
  }

  const handleApprove = async (userId: string) => {
    
    let res = await axios.patch(`https://exam-backend-eight.vercel.app/register/${userId}`, {
      action: "Accepeted" })
      if(res.data.success === true){
        getAllUsers();
        toast.success("User approved successfully");
      }
  };

  const handleReject = async (userId: string) => {
    let res = await axios.patch(`https://exam-backend-eight.vercel.app/register/${userId}`, {
      action: "Rejected" })
      if(res.data.success === true){
        getAllUsers();
        toast.success("User rejected successfully");
      }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Users awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingUsers?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Approved users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Status</CardTitle>
              <CardDescription>Server and service status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-green-600">All Systems Operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users */}
        <Card>
          <CardHeader>
            <CardTitle>Pending User Approvals</CardTitle>
            <CardDescription>
              Review and approve or reject user registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border rounded-md">
      <thead className="bg-muted/50 font-medium text-left">
        <tr>
          <th className="p-4">Name</th>
          <th className="p-4">Email</th>
          <th className="p-4">Role</th>
          <th className="p-4">School</th>
          <th >Employee ID</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {pendingUsers.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-muted-foreground">
              No pending approval requests
            </td>
          </tr>
        ) : (
          pendingUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-4 font-medium">{user.name}</td>
              <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
              <td className="p-4 capitalize">{user.role}</td>
              <td className="p-4 text-sm">{user.school}</td>
              <td className="p-4 text-sm">{user.employeeId}</td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(user._id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(user._id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</CardContent>


        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest logins and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Administrator Login</p>
                  <p className="text-sm text-muted-foreground">IP: 192.168.1.100, Location: New Delhi, India</p>
                </div>
                <p className="text-sm text-muted-foreground">5 minutes ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">User Registration Approved</p>
                  <p className="text-sm text-muted-foreground">Prof. Williams approved as Faculty</p>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">System Backup</p>
                  <p className="text-sm text-muted-foreground">Automated database backup completed</p>
                </div>
                <p className="text-sm text-muted-foreground">12 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
