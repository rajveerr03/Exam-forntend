
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const CoeDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<any>([]);
  const [facultyList, setFacultyList] = useState<any>([]);
  const [subjects, setSubjects] = useState<any>([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    majorMinor: "major",
    year: "",
    semester: "",
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/department");
      setDepartmentList(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSelectDepartment = async (school: string) => {
    setSelectedDepartment(school);

    let res = await axios.get(`http://localhost:3000/register`);
    let faculty = res.data.data.filter((user) => user.department === school && user.role === "faculty" && user.action === "Accepted");
    setFacultyList(faculty);
    // console.log(faculty)
  };

  const handleSelectFaculty = async (faculty: any) => {
    setSelectedFaculty(faculty);
    getSubjects(faculty._id);
  };

  let getSubjects = async (facultyId: string) => {
    let res = await axios.get(`http://localhost:3000/subject/${facultyId}`);
    setSubjects(res.data.data);

  }

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code || !newSubject.year || !newSubject.semester) {
      toast.error("Please fill in all fields");
      return;
    }
    if (selectedFaculty.length === 0) {
      toast.error("Please select a faculty member");
      return;
    }
    const subjectData = {
      name: newSubject.name,
      code: newSubject.code,
      type: newSubject.majorMinor,
      year: newSubject.year,
      semester: newSubject.semester,
      facultyId: selectedFaculty._id,
      department: selectedDepartment,
    };
    // console.log(subjectData)

    let res = await axios.post(`http://localhost:3000/subject`, subjectData);
    console.log(res.data)
    if (res.data.success === true) {
      getSubjects(selectedFaculty._id); 
      setDialogOpen(false);
      toast.success("Subject assigned successfully");
      setNewSubject({
        name: "",
        code: "",
        majorMinor: "major",
        year: "",
        semester: "",
      });
    };
  };

  const handleRemoveSubject = async(subjectId: string) => {
    let res = await axios.delete(`http://localhost:3000/subject/${subjectId}`);
    if (res.data.success === true) {
      getSubjects(selectedFaculty._id);
      toast.success("Subject removed successfully");
    }
  };

  const handleDownloadPaper = (subjectName: string, paperPath: string) => {
    const publicUrl = `http://localhost:3000/${paperPath.replace(/\\/g, '/')}`; // Replace backslashes for Windows paths
    window.open(publicUrl, '_blank'); // Open in new tab
  };
  
  
  
  

  return (
    <DashboardLayout title="Controller of Examination Dashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assign Subjects to Faculty</CardTitle>
            <CardDescription>
              Select a school and faculty to assign or remove subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* School Selection */}
              <div className="space-y-2">
                <Label htmlFor="school-select">Select Department</Label>
                <Select value={selectedDepartment} onValueChange={handleSelectDepartment}>
                  <SelectTrigger id="school-select">
                    <SelectValue placeholder="Select a Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((item) => (
                      <SelectItem key={item._id} value={item.departmentName}>{item.departmentName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faculty List */}
              {selectedDepartment && (
                <div className="space-y-2">
                  <Label>Faculty Members</Label>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facultyList.length > 0 ? (
                          facultyList.map((faculty) => (
                            <TableRow key={faculty} className={selectedFaculty?._id === faculty.id ? "bg-muted/50" : ""}>
                              <TableCell>{faculty.name}</TableCell>
                              <TableCell>{faculty.email}</TableCell>
                              <TableCell>
                                <Button
                                  variant={selectedFaculty?._id === faculty._id ? "secondary" : "outline"}
                                  size="sm"
                                  onClick={() => handleSelectFaculty(faculty)}
                                >
                                  {selectedFaculty?._id === faculty._id ? "Selected" : "Select"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">No faculty members found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Subject Management */}
              {selectedDepartment && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Subjects for {selectedFaculty.name}</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Assign New Subject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Subject to {selectedFaculty.name}</DialogTitle>
                          <DialogDescription>
                            Enter the details of the subject you want to assign
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject-name">Subject Name</Label>
                              <Input
                                id="subject-name"
                                value={newSubject.name}
                                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                placeholder="e.g. Advanced Calculus"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject-code">Subject Code</Label>
                              <Input
                                id="subject-code"
                                value={newSubject.code}
                                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                placeholder="e.g. MATH301"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="major-minor">Major/Minor</Label>
                              <Select
                                value={newSubject.majorMinor}
                                onValueChange={(value) => setNewSubject({ ...newSubject, majorMinor: value })}
                              >
                                <SelectTrigger id="major-minor">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="major">Major</SelectItem>
                                  <SelectItem value="minor">Minor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="year">Year</Label>
                              <Input
                                id="year"
                                type="number"
                                min="1"
                                max="5"
                                value={newSubject.year}
                                onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                                placeholder="e.g. 3"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="semester">Semester</Label>
                              <Input
                                id="semester"
                                type="number"
                                min="1"
                                max="2"
                                value={newSubject.semester}
                                onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                                placeholder="e.g. 1"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleAddSubject}>Assign Subject</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Year  </TableHead>
                          <TableHead>Sem</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        { selectedFaculty && subjects.length > 0 ? (
                          subjects.map((subject: any) => (
                            <TableRow key={subject.id}>
                              <TableCell>{subject.name}</TableCell>
                              <TableCell>{subject.code}</TableCell>
                              <TableCell className="capitalize">{subject.type}</TableCell>
                              <TableCell>{subject.year} </TableCell>
                              <TableCell>{subject.semester}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${subject.status === "Submitted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                  {subject.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveSubject(subject._id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                  {subject.status === "Submitted" && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleDownloadPaper(subject.name , subject.paper)}
                                    >
                                      <Download className="h-4 w-4 text-blue-500" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">No subjects assigned</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoeDashboard;
