"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Student, AttendanceStatus } from "@/types";

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const records = students.map((student) => ({
        student_id: student.id,
        status: attendance[student.id] || "absent",
      }));

      await api.markAttendance({
        date: selectedDate,
        attendance_records: records,
      });

      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      alert("Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "roll_number",
      header: "Roll No",
      render: (student: Student) => student.roll_number,
    },
    {
      key: "full_name",
      header: "Name",
      render: (student: Student) => student.full_name,
    },
    {
      key: "class",
      header: "Class",
      render: (student: Student) => `${student.class}-${student.section}`,
    },
    {
      key: "status",
      header: "Status",
      render: (student: Student) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusChange(student.id, "present")}
            className={`px-3 py-1 rounded ${
              attendance[student.id] === "present"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Present
          </button>
          <button
            onClick={() => handleStatusChange(student.id, "absent")}
            className={`px-3 py-1 rounded ${
              attendance[student.id] === "absent"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Absent
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <Table data={students} columns={columns} />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
