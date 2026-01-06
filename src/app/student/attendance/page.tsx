"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { AttendanceRecord } from "@/types";
import { formatDate, getAttendanceColor } from "@/lib/utils";

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const studentRes = await api.getMyStudentRecord();
      const studentId = studentRes.data.id;

      const [attendanceRes, summaryRes] = await Promise.all([
        api.getStudentAttendance(studentId),
        api.getAttendanceSummary(studentId),
      ]);

      setAttendance(attendanceRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
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
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Total Days</div>
                <div className="text-2xl font-bold">{summary.total_days}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Present Days</div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.present_days}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Attendance %</div>
                <div className="text-2xl font-bold text-blue-600">
                  {summary.percentage}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
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
