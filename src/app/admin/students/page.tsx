"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Student } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap, 
  MoreVertical, 
  Filter,
  Download
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    roll_number: "",
    full_name: "",
    class: "",
    section: "",
    date_of_birth: "",
    guardian_contact: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, formData);
      } else {
        await api.createStudent(formData);
      }
      fetchStudents();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      full_name: student.full_name,
      class: student.class,
      section: student.section,
      date_of_birth: student.date_of_birth.split("T")[0],
      guardian_contact: student.guardian_contact,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to deactivate this student?")) {
      try {
        await api.deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      roll_number: "",
      full_name: "",
      class: "",
      section: "",
      date_of_birth: "",
      guardian_contact: "",
    });
  };

  const columns = [
    { 
      key: "roll_number", 
      header: "Roll No",
      render: (student: Student) => (
        <span className="font-mono text-xs font-medium bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
          {student.roll_number}
        </span>
      )
    },
    { 
      key: "full_name", 
      header: "Student Name",
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">{student.full_name}</span>
        </div>
      )
    },
    {
      key: "class",
      header: "Class",
      render: (student: Student) => (
        <Badge variant="outline" className="font-medium">
          {student.class} - {student.section}
        </Badge>
      ),
    },
    {
      key: "date_of_birth",
      header: "DOB",
      render: (student: Student) => <span className="text-gray-500">{formatDate(student.date_of_birth)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (student: Student) => (
        <div className={`flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
          student.status === "active" 
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
            : "bg-gray-100 text-gray-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${student.status === "active" ? "bg-emerald-500" : "bg-gray-500"}`} />
          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (student: Student) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(student)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(student.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Students
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage student records and admissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats/Filters Section - Simplified for now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{students.length}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-2xl font-bold mt-1 text-emerald-600">
              {students.filter(s => s.status === 'active').length}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 dark:bg-zinc-800/50"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table data={filteredStudents} columns={columns} />
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingStudent ? "Edit Student" : "New Admission"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Roll Number"
                value={formData.roll_number}
                onChange={(e) =>
                  setFormData({ ...formData, roll_number: e.target.value })
                }
                required
                className="focus:ring-primary"
              />
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                className="focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Class"
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                required
              />
              <Input
                label="Section"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guardian Contact
              </label>
              <textarea
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all"
                rows={3}
                value={formData.guardian_contact}
                onChange={(e) =>
                  setFormData({ ...formData, guardian_contact: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                {editingStudent ? "Update Student" : "Admit Student"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

