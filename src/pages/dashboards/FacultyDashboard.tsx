
import React, { useState , useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import axios from "axios";

// Mock data for faculty subjects
const assignedSubjects = [
  {
    id: "s1",
    name: "Digital Signal Processing",
    code: "ECE301",
    school: "School of Engineering",
    majorMinor: "Major",
    status: "Not Submitted",
  },
  {
    id: "s2",
    name: "Control Systems",
    code: "ECE405",
    school: "School of Engineering",
    majorMinor: "Major",
    status: "Not Submitted",
  },
  {
    id: "s3",
    name: "Embedded Systems",
    code: "ECE420",
    school: "School of Engineering",
    majorMinor: "Minor",
    status: "Submitted",
    submissionDate: "2023-04-15",
  },
];

const FacultyDashboard = () => {
  const [subject, setSubject] = useState<any>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [examDate, setExamDate] = useState<Date | undefined>();
  const [examType, setExamType] = useState<string>("mid");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ submissionDate , setSubmissionDate] = useState("")

  const [user , setUser] = useState({ name: "" , _id:"" });

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    getAllSubjects(userId);
    getUser(userId);
  }, []);

  let getAllSubjects = async (id : any) => {
    let res = await axios.get(`https://exam-backend-mocha.vercel.app/subject/${id}`);
    // console.log(res.data.data);
    setSubject(res.data.data);
  }

  let getUser = async (userId: any) => {
    // console.log(userId)
    let res = await axios.get(`https://exam-backend-mocha.vercel.app/register/${userId}`);
    // console.log(res.data.data);
    setUser(res.data.data);
  }
  
  const handleSubjectSelect = (subject: any) => {
    if (subject.status === "Submitted") {
      toast.info("This paper has already been submitted.");
      return;
    }
    setSelectedSubject(subject);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!examDate) {
      toast.error("Please select an exam date");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please upload a question paper");
      return;
    }

    // let submitData = {
    //   facultyId : user._id,
    //   subjectId : selectedSubject._id,
    //   date: examDate,
    //   type : examType
    // }

    // console.log(submitData)

    let formdata = new FormData();

    formdata.append("facultyId" , user._id)
    formdata.append("subjectId" , selectedSubject._id)
    formdata.append("date" , examDate.toISOString())
    formdata.append("type", examType)
    formdata.append("paper", selectedFile)

    let res = await axios.post("https://exam-backend-mocha.vercel.app/exam" , formdata)

    if(res.data.success === true){
      getAllSubjects(user._id)
      toast.success(`Paper for ${selectedSubject.name} submitted successfully!`);
      setSelectedSubject(null);
      setExamDate(undefined);
      setExamType("mid");
      setSelectedFile(null);
    };
    }
    

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Subjects</CardTitle>
            <CardDescription>
              View and manage question paper submissions for your subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subject.map((subject) => (
                    <TableRow key={subject._id}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.department}</TableCell>
                      <TableCell>{subject.type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          subject.status === "Submitted" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {subject.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {subject.status === "Submitted" ? (
                          <span className="text-sm text-muted-foreground">
                            Submitted on { subject.updatedAt.split("T")[0] }
                          </span>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSubjectSelect(subject)}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Paper
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Upload Question Paper</DialogTitle>
                                <DialogDescription>
                                  Submit your question paper for {subject.name} ({subject.code})
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="faculty-name" className="text-right">
                                    Faculty
                                  </Label>
                                  <Input id="faculty-name" value={user.name} readOnly className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="subject-name" className="text-right">
                                    Subject
                                  </Label>
                                  <Input id="subject-name" value={subject.name} readOnly className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="subject-code" className="text-right">
                                    Code
                                  </Label>
                                  <Input id="subject-code" value={subject.code} readOnly className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="school" className="text-right">
                                    School
                                  </Label>
                                  <Input id="school" value={subject.department} readOnly className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="type" className="text-right">
                                    Type
                                  </Label>
                                  <Input id="type" value={subject.type} readOnly className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="exam-date" className="text-right">
                                    Exam Date
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start text-left font-normal col-span-3",
                                          !examDate && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {examDate ? format(examDate, "PPP") : <span>Select date</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={examDate}
                                        onSelect={setExamDate}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="exam-type" className="text-right">
                                    Exam Type
                                  </Label>
                                  <Select value={examType} onValueChange={setExamType}>
                                    <SelectTrigger className="col-span-3" id="exam-type">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="mid">Mid Semester</SelectItem>
                                      <SelectItem value="end">End Semester</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="paper-upload" className="text-right">
                                    Upload PDF
                                  </Label>
                                  <div className="col-span-3">
                                    <Input 
                                      id="paper-upload" 
                                      type="file" 
                                      accept=".pdf"
                                      onChange={handleFileChange}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Only PDF files are accepted. Max size: 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSubmit}>Submit Paper</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              History of your recent question paper submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignedSubjects.filter(subject => subject.status === "Submitted").length > 0 ? (
              <div className="space-y-4">
                {assignedSubjects.filter(subject => subject.status === "Submitted").map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">{subject.name} ({subject.code})</h4>
                      <p className="text-sm text-muted-foreground">Submitted on {subject.submissionDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Successfully Encrypted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No submissions yet. Upload your first question paper to see it here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
