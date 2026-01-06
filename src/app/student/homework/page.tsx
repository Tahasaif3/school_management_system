"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { Book } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  due_date: string;
  max_marks: string;
  status: string;
  created_at: string;
}

export default function StudentHomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      // TODO: Replace with actual API call when backend endpoint is available
      // const response = await api.getStudentHomework();
      // setHomework(response.data);
      
      // Placeholder data
      setHomework([]);
    } catch (error) {
      console.error("Failed to fetch homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-blue-100 text-blue-800",
      closed: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.draft;
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (hw: Homework) => (
        <div>
          <p className="font-medium">{hw.title}</p>
          <p className="text-sm text-gray-500">{hw.subject}</p>
        </div>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (hw: Homework) => (
        <div>
          <p className="font-medium">{formatDate(hw.due_date)}</p>
          {new Date(hw.due_date) < new Date() && (
            <p className="text-xs text-red-500">Overdue</p>
          )}
        </div>
      ),
    },
    {
      key: "max_marks",
      header: "Marks",
      render: (hw: Homework) => <span>{hw.max_marks}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (hw: Homework) => (
        <Badge className={getStatusColor(hw.status)}>
          {hw.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homework</h1>
            <p className="text-sm text-gray-500">View and manage your homework assignments</p>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">Loading...</div>
            </CardContent>
          </Card>
        ) : homework.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                No homework assignments found. Homework will appear here once assigned.
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Homework Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table data={homework} columns={columns} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

