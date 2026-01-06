export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  HomeWork,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  due_date: string;
  max_marks: string;
  status: "draft" | "published" | "closed";
}

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([
    {
      id: "1",
      title: "Mathematics Chapter 5 Exercises",
      description: "Solve all exercises from Chapter 5 (Quadratic Equations) including optional sums.",
      subject: "Mathematics",
      class: "10",
      section: "A",
      due_date: "2024-01-20",
      max_marks: "100",
      status: "published",
    },
    {
      id: "2",
      title: "Science Project Report",
      description: "Submit a 5-page report on any one environmental topic.",
      subject: "Science",
      class: "9",
      section: "B",
      due_date: "2024-01-25",
      max_marks: "50",
      status: "published",
    },
    {
      id: "3",
      title: "English Essay Writing",
      description: "Write an essay on 'The Impact of Technology on Education' (300-400 words).",
      subject: "English",
      class: "8",
      section: "A",
      due_date: "2024-01-22",
      max_marks: "30",
      status: "published",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    section: "A",
    due_date: "",
    max_marks: "100",
  });

  const handleCreate = () => {
    const homework: Homework = {
      id: Date.now().toString(),
      ...newHomework,
      status: "published" as const,
    };
    setHomeworkList([homework, ...homeworkList]);
    setShowModal(false);
    setNewHomework({
      title: "",
      description: "",
      subject: "",
      class: "",
      section: "A",
      due_date: "",
      max_marks: "100",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const isOverdue = (dueDate: string) => getDaysRemaining(dueDate) < 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homework</h1>
            <p className="text-gray-500">Manage assignments and homework</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <HomeWork className="w-4 h-4 mr-2" />
            Assign Homework
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <HomeWork className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600">Total</span>
              </div>
              <div className="text-2xl font-bold mt-1">{homeworkList.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {homeworkList.filter((h) => h.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-orange-600">Due This Week</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {homeworkList.filter(
                  (h) =>
                    !isOverdue(h.due_date) &&
                    getDaysRemaining(h.due_date) <= 7
                ).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Overdue</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {homeworkList.filter((h) => isOverdue(h.due_date)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Homework List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeworkList.map((homework) => {
            const daysRemaining = getDaysRemaining(homework.due_date);
            const overdue = isOverdue(homework.due_date);

            return (
              <Card
                key={homework.id}
                className={`hover:shadow-lg transition-shadow ${
                  overdue ? "border-red-200 bg-red-50/30" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{homework.subject}</h3>
                        <p className="text-xs text-gray-500">
                          Class {homework.class} - Section {homework.section}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        overdue
                          ? "danger"
                          : daysRemaining <= 2
                          ? "warning"
                          : "success"
                      }
                    >
                      {overdue
                        ? "Overdue"
                        : daysRemaining === 0
                        ? "Due Today"
                        : `${daysRemaining} days`}
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-lg mb-2">{homework.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {homework.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {formatDate(homework.due_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{homework.max_marks} marks</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Submissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {homeworkList.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <HomeWork className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No Homework Assigned</h3>
              <p className="text-gray-500 mt-1">
                Get started by assigning your first homework.
              </p>
              <Button onClick={() => setShowModal(true)} className="mt-4">
                <HomeWork className="w-4 h-4 mr-2" />
                Assign Homework
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Homework Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Assign Homework"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newHomework.title}
            onChange={(e) =>
              setNewHomework({ ...newHomework, title: e.target.value })
            }
            placeholder="Homework title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={newHomework.description}
              onChange={(e) =>
                setNewHomework({ ...newHomework, description: e.target.value })
              }
              placeholder="Detailed instructions..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={newHomework.subject}
                onChange={(e) =>
                  setNewHomework({ ...newHomework, subject: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
                <option value="Hindi">Hindi</option>
                <option value="Computer">Computer</option>
              </select>
            </div>
            <Input
              label="Max Marks"
              type="number"
              value={newHomework.max_marks}
              onChange={(e) =>
                setNewHomework({ ...newHomework, max_marks: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={newHomework.class}
                onChange={(e) =>
                  setNewHomework({ ...newHomework, class: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Class</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={newHomework.section}
                onChange={(e) =>
                  setNewHomework({ ...newHomework, section: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {["A", "B", "C", "D"].map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={newHomework.due_date}
              onChange={(e) =>
                setNewHomework({ ...newHomework, due_date: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newHomework.title || !newHomework.subject || !newHomework.class || !newHomework.due_date}
            >
              Assign Homework
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
