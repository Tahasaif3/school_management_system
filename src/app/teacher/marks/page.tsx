"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Exam, Marksheet } from "@/types";
import { formatDate, getGradeColor } from "@/lib/utils";
import { FileText } from "lucide-react";

export default function TeacherMarksPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchMarksheets(selectedExam);
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const response = await api.getExams();
      setExams(response.data);
      if (response.data.length > 0) {
        setSelectedExam(response.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarksheets = async (examId: string) => {
    try {
      const response = await api.getMarksheets({ exam_id: examId });
      setMarksheets(response.data);
    } catch (error) {
      console.error("Failed to fetch marksheets:", error);
    }
  };

  const examColumns = [
    {
      key: "name",
      header: "Exam Name",
      render: (exam: Exam) => exam.name,
    },
    {
      key: "exam_type",
      header: "Type",
      render: (exam: Exam) => (
        <Badge variant="info">{exam.exam_type}</Badge>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      render: (exam: Exam) =>
        `${formatDate(exam.start_date)} - ${formatDate(exam.end_date)}`,
    },
  ];

  const marksheetColumns = [
    {
      key: "student_id",
      header: "Student ID",
      render: (marksheet: Marksheet) => marksheet.student_id,
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
        <h1 className="text-2xl font-bold text-gray-900">Marks Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Exams</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedExam(exam.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedExam === exam.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{exam.name}</div>
                      <div className="text-sm text-gray-500">
                        {exam.exam_type} - {formatDate(exam.start_date)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Marksheets</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExam ? (
                marksheets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No marksheets for this exam yet
                  </div>
                ) : (
                  <Table data={marksheets} columns={marksheetColumns} />
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select an exam to view marksheets
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
