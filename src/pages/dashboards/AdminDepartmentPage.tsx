import React, { useState , useEffect } from 'react';
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from "sonner";
import { get } from 'http';

const AdminDepartmentPage = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  let fetchDepartments = async () => {
    const res = await axios.get("http://localhost:3000/department");  
    setDepartments(res.data.data);
  }

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(departmentName)
    let res = await axios.post("http://localhost:3000/department", {departmentName:departmentName});
    if(res.data.success === true) {
      fetchDepartments();
      toast.success("Department added successfully");
      setDepartmentName("");
    }
  };

  return (
    <DashboardLayout title="Manage Departments">
      <div className="flex flex-col md:flex-row gap-6 mt-10 px-4">
        {/* Left: Add Form */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-md p-6">
          <h1 className="text-2xl font-bold text-university-primary mb-4 text-center">Add New Department</h1>
          <form onSubmit={handleAddDepartment} className="space-y-5">
            <div>
              <Label htmlFor="subjectName">Department Name</Label>
              <Input
                id="departmentName"
                type="text"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-university-primary hover:bg-university-primary/90">
              Add Department
            </Button>
          </form>
        </div>

        {/* Right: Subject List */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Subjects List</h2>
          {departments.length === 0 ? (
            <p className="text-muted-foreground">No subjects added yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {departments.map((department, index) => (
                <li key={index} className="text-base">{department.departmentName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDepartmentPage;
