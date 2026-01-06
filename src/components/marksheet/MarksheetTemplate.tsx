"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarksheetWithExam, Exam } from "@/types";
import { formatDate } from "@/lib/utils";

interface MarksheetTemplateProps {
  marksheet: MarksheetWithExam;
  exam?: Exam;
  studentName: string;
  rollNumber: string;
  studentClass: string;
  section: string;
  onClose?: () => void;
}

export function MarksheetTemplate({
  marksheet,
  exam,
  studentName,
  rollNumber,
  studentClass,
  section,
  onClose,
}: MarksheetTemplateProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setIsPrinting(false);
  };

  const subjectMarks = Object.entries(marksheet.subject_marks);
  const maxMarks = 100; // This should come from subject configuration
  const totalMaxMarks = subjectMarks.length * maxMarks;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint} disabled={isPrinting}>
          {isPrinting ? "Printing..." : "Print Marksheet"}
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose} className="ml-2">
            Close
          </Button>
        )}
      </div>

      {/* Marksheet Document */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg print:shadow-none print:border-2">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">
            School Management System
          </h1>
          <p className="text-lg text-gray-600 mt-1">Academic Performance Report</p>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded">
              Session: {new Date().getFullYear()}
            </span>
            <Badge variant={marksheet.status === "published" ? "success" : "warning"}>
              {marksheet.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Student Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500 block">Name</span>
              <span className="font-medium">{studentName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Roll Number</span>
              <span className="font-medium">{rollNumber}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Class</span>
              <span className="font-medium">{studentClass}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Section</span>
              <span className="font-medium">{section}</span>
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Examination Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500 block">Exam Name</span>
              <span className="font-medium">{exam?.name || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Exam Type</span>
              <span className="font-medium capitalize">{exam?.exam_type || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Start Date</span>
              <span className="font-medium">
                {exam ? formatDate(exam.start_date) : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">End Date</span>
              <span className="font-medium">
                {exam ? formatDate(exam.end_date) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Subject-wise Performance
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Subject
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Marks Obtained
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Max Marks
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Percentage
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {subjectMarks.map(([subject, marks]) => {
                const percentage = (marks / maxMarks) * 100;
                let grade = "F";
                if (percentage >= 90) grade = "A";
                else if (percentage >= 80) grade = "B";
                else if (percentage >= 70) grade = "C";
                else if (percentage >= 60) grade = "D";

                return (
                  <tr key={subject} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      {subject}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">
                      {marks}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {maxMarks}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-bold border ${getGradeColor(
                          grade
                        )}`}
                      >
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 px-4 py-3">Total</td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {marksheet.total_marks}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {totalMaxMarks}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {marksheet.percentage.toFixed(1)}%
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-sm font-bold border ${getGradeColor(
                      marksheet.grade
                    )}`}
                  >
                    {marksheet.grade}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Overall Percentage</div>
            <div className="text-2xl font-bold text-gray-900">
              {marksheet.percentage.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Final Grade</div>
            <div className="text-2xl font-bold">
              <span
                className={`px-3 py-1 rounded-lg border-2 ${getGradeColor(
                  marksheet.grade
                )}`}
              >
                {marksheet.grade}
              </span>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Result</div>
            <div className="text-2xl font-bold text-gray-900">
              {marksheet.percentage >= 40 ? "PASS" : "FAIL"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-6 mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="border-b border-gray-400 h-8 mb-2"></div>
              <p className="text-sm text-gray-600">Class Teacher Signature</p>
            </div>
            <div>
              <div className="border-b border-gray-400 h-8 mb-2"></div>
              <p className="text-sm text-gray-600">Principal Signature</p>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Report generated on {formatDate(new Date().toISOString())}</p>
            <p className="mt-1">This is a computer-generated document and does not require a signature.</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .print\\:shadow-none {
            shadow: none !important;
          }
          .print\\:border-2 {
            border-width: 2px !important;
          }
        }
      `}</style>
    </div>
  );
}
