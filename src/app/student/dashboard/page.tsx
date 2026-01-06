"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { LayoutDashboard, ClipboardCheck, DollarSign, FileText } from "lucide-react";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentRes = await api.getMyStudentRecord();
      const studentId = studentRes.data.id;

      const [attendanceRes, feesRes, marksheetsRes] = await Promise.all([
        api.getAttendanceSummary(studentId),
        api.getStudentFees(studentId),
        api.getStudentMarksheets(studentId),
      ]);

      const unpaidFees = feesRes.data.filter((f: any) => f.status === "unpaid");
      const totalUnpaid = unpaidFees.reduce((sum: number, f: any) => sum + f.amount, 0);

      setStats({
        attendance: attendanceRes.data,
        fees: {
          total: feesRes.data.length,
          unpaid: unpaidFees.length,
          totalUnpaid,
        },
        marksheets: marksheetsRes.data.length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.attendance?.percentage || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats?.attendance?.present_days || 0} / {stats?.attendance?.total_days || 0} days
                  </p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Unpaid Fees</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${stats?.fees?.totalUnpaid || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats?.fees?.unpaid || 0} pending
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Fees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.fees?.total || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    All fee records
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Marksheets</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.marksheets || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Exam results
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/student/attendance"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ClipboardCheck className="w-5 h-5 text-blue-500 mb-2" />
                <p className="font-medium">View Attendance</p>
                <p className="text-sm text-gray-500">Check your attendance records</p>
              </a>
              <a
                href="/student/fees"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DollarSign className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium">View Fees</p>
                <p className="text-sm text-gray-500">Check fee payment status</p>
              </a>
              <a
                href="/student/marks"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-purple-500 mb-2" />
                <p className="font-medium">View Marks</p>
                <p className="text-sm text-gray-500">Check your exam results</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

