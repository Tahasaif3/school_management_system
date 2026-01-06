"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { AttendanceRecord, Student } from "@/types";
import { formatDate, getAttendanceColor } from "@/lib/utils";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [attendanceRes, studentsRes] = await Promise.all([
        api.getAttendance({ start_date: selectedDate, end_date: selectedDate }),
        api.getStudents(),
      ]);
      setAttendance(attendanceRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (record: AttendanceRecord) => formatDate(record.date),
    },
    {
      key: "student",
      header: "Student",
      render: (record: AttendanceRecord) => {
        const student = students.find((s) => s.id === record.student_id);
        return student?.full_name || record.student_id;
      },
    },
    {
      key: "roll_number",
      header: "Roll No",
      render: (record: AttendanceRecord) => {
        const student = students.find((s) => s.id === record.student_id);
        return student?.roll_number || "-";
      },
    },
    {
      key: "status",
      header: "Status",
      render: (record: AttendanceRecord) => (
        <Badge
          variant={
            record.status === "present"
              ? "success"
              : "danger"
          }
        >
          {record.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance History</CardTitle>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No attendance records for this date
              </div>
            ) : (
              <Table data={attendance} columns={columns} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
