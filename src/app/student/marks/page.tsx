"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { Marksheet } from "@/types";
import { getGradeColor } from "@/lib/utils";

export default function StudentMarksPage() {
  const { user } = useAuth();
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarksheets();
  }, []);

  const fetchMarksheets = async () => {
    try {
      const studentRes = await api.getMyStudentRecord();
      const studentId = studentRes.data.id;

      const response = await api.getStudentMarksheets(studentId);
      setMarksheets(response.data);
    } catch (error) {
      console.error("Failed to fetch marksheets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: "exam_id",
      header: "Exam ID",
      render: (marksheet: Marksheet) => marksheet.exam_id,
    },
    {
      key: "subjects",
      header: "Subjects",
      render: (marksheet: Marksheet) =>
        Object.entries(marksheet.subject_marks).length,
    },
    {
      key: "total_marks",
      header: "Total",
      render: (marksheet: Marksheet) => marksheet.total_marks,
    },
    {
      key: "percentage",
      header: "Percentage",
      render: (marksheet: Marksheet) => `${marksheet.percentage}%`,
    },
    {
      key: "grade",
      header: "Grade",
      render: (marksheet: Marksheet) => (
        <Badge className={getGradeColor(marksheet.grade)}>
          {marksheet.grade}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (marksheet: Marksheet) => (
        <Badge
          variant={marksheet.status === "published" ? "success" : "warning"}
        >
          {marksheet.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Marksheets</h1>

        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : marksheets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No marksheets found
              </div>
            ) : (
              <Table data={marksheets} columns={columns} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
