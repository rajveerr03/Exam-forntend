
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

import { toast } from "sonner";
import axios from "axios";

const ExamSchedule = () => {

    const [exam, setExam] = useState([]);
    const [subject, setSubject] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchExam();
        fetchSubject();
        fetchFaculty();

        let role = localStorage.getItem("role")
        setRole(role)

    }, []);


    let fetchExam = async () => {
        let res = await axios.get("http://localhost:3000/exam")
        // console.log(res.data.data)
        if (res.data.success === true) {
            setExam(res.data.data)
        }
    }

    let fetchSubject = async () => {
        let res = await axios.get("http://localhost:3000/subject")
        // console.log(res.data.data)
        if (res.data.success === true) {
            setSubject(res.data.data)
        }
    }

    let fetchFaculty = async () => {
        let res = await axios.get("http://localhost:3000/register")
        if (res.data.success === true) {
            setFaculty(res.data.data)
        }
    }

    const getFacultyName = (id: string) =>
        faculty.find((f: any) => f._id === id)?.name || "Unknown";

    const getSubjectName = (id: string) =>
        subject.find((s: any) => s._id === id)?.name || "Unknown";


    const handleRemoveSubject = async (id: string) => {
        let res = await axios.delete(`http://localhost:3000/exam/${id}`);
        if (res.data.success === true) {
            fetchExam();
            toast.success("Exam removed successfully");
        }
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Faculty Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        {role !== "faculty" && <TableHead>Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exam && exam.length > 0 ? (
                                        exam.map((exam: any) => (
                                            <TableRow key={exam._id}>
                                                <TableCell>{getFacultyName(exam.facultyId)}</TableCell>
                                                <TableCell>{getSubjectName(exam.subjectId)}</TableCell>
                                                <TableCell className="capitalize">{exam.type}</TableCell>
                                                <TableCell>
                                                    {typeof exam.date === 'string' ? exam.date.split("T")[0] : ""}
                                                </TableCell>

                                                {role !== "faculty" && (
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleRemoveSubject(exam._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>

                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">No Exam assigned</TableCell>
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

export default ExamSchedule;
