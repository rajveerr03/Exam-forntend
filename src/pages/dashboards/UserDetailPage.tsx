import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import axios from "axios";

const UserDetailPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [ coe , setCoe] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  let getAllUser = async () => {
    try {
      let res = await axios.get("https://exam-backend-mocha.vercel.app/register");
      if (res.data.success === true) {
        const filteredFaculty = res.data.data.filter((user: any) => user.role === "faculty" && user.action === "Accepted");
        setFaculty(filteredFaculty);

        const filteredCoe = res.data.data.filter((user: any) => user.role === "coe" && user.action === "Accepted");
        setCoe(filteredCoe);

      }
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const handleRemoveSubject = async (id: string) => {
    try {
      let res = await axios.delete(`https://exam-backend-mocha.vercel.app/register/${id}`);
      if (res.data.success === true) {
        toast.success("User removed successfully");
        getAllUser();
      }
    } catch (error) {
      toast.error("Error removing User");
    }
  };

  return (
    <DashboardLayout title="Controller of Examination Dashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Faculty Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty && faculty.length > 0 ? (
                    faculty.map((user: any) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="icon" onClick={() => handleRemoveSubject(user._id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No Faculty Available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coe Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coe && coe.length > 0 ? (
                    coe.map((user: any) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="icon" onClick={() => handleRemoveSubject(user._id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No Faculty Available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDetailPage;
