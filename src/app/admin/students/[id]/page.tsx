"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/services/api";
import {
  Student,
  Fee,
  MarksheetWithExam,
  AttendanceSummary,
  Subject,
} from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [fees, setFees] = useState<Fee[]>([]);
  const [marksheets, setMarksheets] = useState<MarksheetWithExam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, feesRes, marksheetsRes, attendanceRes] = await Promise.all([
        api.getStudent(studentId),
        api.getStudentFees(studentId),
        api.getStudentMarksheets(studentId),
        api.getAttendanceSummary(studentId).catch(() => ({ data: null })),
      ]);

      setStudent(studentRes.data);
      setFees(feesRes.data);
      setMarksheets(marksheetsRes.data);
      setAttendance(attendanceRes.data);

      // Fetch subjects for the student's class
      if (studentRes.data?.class) {
        try {
          const subjectsRes = await api.getSubjectsByClass(studentRes.data.class);
          setSubjects(subjectsRes.data);
        } catch {
          // Subjects might not be available yet
        }
      }
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Student not found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const unpaidFees = totalFees - paidFees;
  const overdueFees = fees.filter((f) => f.is_overdue && f.status === "unpaid").length;

  const feeColumns = [
    {
      key: "fee_type",
      header: "Type",
      render: (fee: Fee) => (
        <span className="capitalize">{fee.fee_type.replace("_", " ")}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (fee: Fee) => formatCurrency(fee.amount),
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (fee: Fee) => formatDate(fee.due_date),
    },
    {
      key: "status",
      header: "Status",
      render: (fee: Fee) => (
        <Badge variant={fee.status === "paid" ? "success" : fee.is_overdue ? "danger" : "warning"}>
          {fee.status === "paid" ? "Paid" : fee.is_overdue ? "Overdue" : "Unpaid"}
        </Badge>
      ),
    },
    {
      key: "payment_date",
      header: "Paid On",
      render: (fee: Fee) =>
        fee.payment_date ? formatDate(fee.payment_date) : "-",
    },
  ];

  const marksheetColumns = [
    {
      key: "exam_name",
      header: "Exam",
      render: (ms: MarksheetWithExam) => ms.exam?.name || ms.exam_id,
    },
    {
      key: "subject_marks",
      header: "Subjects",
      render: (ms: MarksheetWithExam) => Object.keys(ms.subject_marks).length,
    },
    {
      key: "total_marks",
      header: "Total",
      render: (ms: MarksheetWithExam) => ms.total_marks,
    },
    {
      key: "percentage",
      header: "Percentage",
      render: (ms: MarksheetWithExam) => `${ms.percentage.toFixed(1)}%`,
    },
    {
      key: "grade",
      header: "Grade",
      render: (ms: MarksheetWithExam) => (
        <Badge
          variant={
            ms.grade === "A"
              ? "success"
              : ms.grade === "B"
              ? "info"
              : ms.grade === "C"
              ? "warning"
              : "danger"
          }
        >
          {ms.grade}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (ms: MarksheetWithExam) => (
        <Badge variant={ms.status === "published" ? "success" : "warning"}>
          {ms.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {student.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.full_name}</h1>
                <p className="text-gray-500">
                  Roll No: {student.roll_number} | Class {student.class}-{student.section}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant={student.status === "active" ? "success" : "danger"}>
                    {student.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    DOB: {formatDate(student.date_of_birth)}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Back to List
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-600 font-medium">Attendance</div>
              <div className="text-2xl font-bold text-blue-900">
                {attendance?.percentage?.toFixed(1) || 0}%
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {attendance?.present_days || 0}/{attendance?.total_days || 0} days
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="text-sm text-green-600 font-medium">Paid Fees</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(paidFees)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {fees.filter((f) => f.status === "paid").length} of {fees.length} paid
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="text-sm text-red-600 font-medium">Outstanding</div>
              <div className="text-2xl font-bold text-red-900">
                {formatCurrency(unpaidFees)}
              </div>
              <div className="text-xs text-red-600 mt-1">
                {overdueFees} overdue
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-600 font-medium">Exams Taken</div>
              <div className="text-2xl font-bold text-purple-900">
                {marksheets.length}
              </div>
              <div className="text-xs text-purple-600 mt-1">marksheets available</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b rounded-none bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="fees"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
              >
                Fees ({fees.length})
              </TabsTrigger>
              <TabsTrigger
                value="marksheets"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
              >
                Marksheets ({marksheets.length})
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
              >
                Subjects ({subjects.length})
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
              >
                Attendance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Full Name</dt>
                      <dd className="text-sm font-medium">{student.full_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Roll Number</dt>
                      <dd className="text-sm font-medium">{student.roll_number}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Class & Section</dt>
                      <dd className="text-sm font-medium">
                        Class {student.class} - Section {student.section}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Date of Birth</dt>
                      <dd className="text-sm font-medium">{formatDate(student.date_of_birth)}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Guardian Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Guardian Contact</dt>
                      <dd className="text-sm font-medium">{student.guardian_contact}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Status</dt>
                      <dd className="text-sm font-medium">
                        <Badge variant={student.status === "active" ? "success" : "danger"}>
                          {student.status}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Student ID</dt>
                      <dd className="text-sm font-medium font-mono">{student.id}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="p-0">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-500">Total Fees</div>
                      <div className="text-xl font-bold">{formatCurrency(totalFees)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-green-600">Paid</div>
                      <div className="text-xl font-bold text-green-700">
                        {formatCurrency(paidFees)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-red-600">Unpaid</div>
                      <div className="text-xl font-bold text-red-700">
                        {formatCurrency(unpaidFees)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Table data={fees} columns={feeColumns} emptyMessage="No fee records found" />
              </div>
            </TabsContent>

            <TabsContent value="marksheets" className="p-0">
              <div className="p-6">
                {marksheets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No marksheets available yet
                  </div>
                ) : (
                  <Table data={marksheets} columns={marksheetColumns} emptyMessage="No marksheets found" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="p-0">
              <div className="p-6">
                {subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No subjects assigned to Class {student.class} yet.
                    <br />
                    Contact admin to add subjects.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <Card key={subject.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{subject.name}</h4>
                              <p className="text-sm text-gray-500">{subject.code}</p>
                            </div>
                            <Badge variant="info">{subject.max_marks} marks</Badge>
                          </div>
                          {subject.description && (
                            <p className="text-sm text-gray-600 mt-2">{subject.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="p-0">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-blue-600">Total Days</div>
                      <div className="text-xl font-bold">{attendance?.total_days || 0}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-green-600">Present</div>
                      <div className="text-xl font-bold text-green-700">
                        {attendance?.present_days || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-red-600">Absent</div>
                      <div className="text-xl font-bold text-red-700">
                        {attendance?.absent_days || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-indigo-50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-indigo-600">Percentage</div>
                      <div className="text-xl font-bold text-indigo-700">
                        {attendance?.percentage?.toFixed(1) || 0}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {attendance && (
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all"
                      style={{ width: `${attendance.percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}
