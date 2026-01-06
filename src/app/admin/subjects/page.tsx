"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api } from "@/services/api";
import { Subject } from "@/types";
import { formatDate } from "@/lib/utils";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [filterClass, setFilterClass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    class: "",
    max_marks: "100",
  });

  useEffect(() => {
    fetchSubjects();
  }, [filterClass]);

  const fetchSubjects = async () => {
    try {
      const params: any = {};
      if (filterClass) params.class = filterClass;
      const response = await api.getSubjects(params);
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingSubject) {
        await api.updateSubject(editingSubject.id, formData);
      } else {
        await api.createSubject(formData);
      }
      setShowModal(false);
      resetForm();
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save subject");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this subject?")) return;
    try {
      await api.deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || "",
      class: subject.class,
      max_marks: subject.max_marks,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      class: "",
      max_marks: "100",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (subject: Subject) => (
        <span className="font-mono font-medium">{subject.code}</span>
      ),
    },
    {
      key: "name",
      header: "Subject Name",
      render: (subject: Subject) => <span className="font-medium">{subject.name}</span>,
    },
    {
      key: "class",
      header: "Class",
      render: (subject: Subject) => (
        <Badge variant="info">Class {subject.class}</Badge>
      ),
    },
    {
      key: "max_marks",
      header: "Max Marks",
      render: (subject: Subject) => subject.max_marks,
    },
    {
      key: "status",
      header: "Status",
      render: (subject: Subject) => (
        <Badge variant={subject.is_active ? "success" : "danger"}>
          {subject.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (subject: Subject) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(subject)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(subject.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Get unique classes
  const classes = [...new Set(subjects.map((s) => s.class))].sort();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
          <Button onClick={openCreateModal}>Add New Subject</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Class
                </label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <div className="text-sm text-blue-600">Total Subjects</div>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-4">
              <div className="text-sm text-green-600">Active</div>
              <div className="text-2xl font-bold text-green-700">
                {subjects.filter((s) => s.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardContent className="pt-4">
              <div className="text-sm text-purple-600">Classes</div>
              <div className="text-2xl font-bold text-purple-700">{classes.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No subjects found. Click "Add New Subject" to create one.
              </div>
            ) : (
              <Table data={subjects} columns={columns} emptyMessage="No subjects found" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Code *
            </label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., MATH, SCI, ENG"
              disabled={!!editingSubject}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Class</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <option key={cls} value={cls.toString()}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Marks *
            </label>
            <Input
              type="number"
              value={formData.max_marks}
              onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
              placeholder="100"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.code || !formData.name || !formData.class}
            >
              {editingSubject ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
