"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Fee, Student, FeeType } from "@/types";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    fee_type: "tuition" as FeeType,
    due_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        api.getFees(),
        api.getStudents(),
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFee({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      fetchData();
      setIsModalOpen(false);
      setFormData({
        student_id: "",
        amount: "",
        fee_type: "tuition",
        due_date: "",
      });
    } catch (error) {
      console.error("Failed to create fee:", error);
    }
  };

  const handlePay = async (feeId: string) => {
    try {
      await api.payFee(feeId, {
        payment_date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    } catch (error) {
      console.error("Failed to pay fee:", error);
    }
  };

  const columns = [
    {
      key: "student",
      header: "Student",
      render: (fee: Fee) => {
        const student = students.find((s) => s.id === fee.student_id);
        return student?.full_name || fee.student_id;
      },
    },
    {
      key: "roll_number",
      header: "Roll No",
      render: (fee: Fee) => {
        const student = students.find((s) => s.id === fee.student_id);
        return student?.roll_number || "-";
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (fee: Fee) => formatCurrency(fee.amount),
    },
    { key: "fee_type", header: "Type" },
    {
      key: "due_date",
      header: "Due Date",
      render: (fee: Fee) => formatDate(fee.due_date),
    },
    {
      key: "status",
      header: "Status",
      render: (fee: Fee) => (
        <Badge variant={fee.status === "paid" ? "success" : "warning"}>
          {fee.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (fee: Fee) =>
        fee.status === "unpaid" && (
          <Button size="sm" onClick={() => handlePay(fee.id)}>
            Mark Paid
          </Button>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Fee
          </Button>
        </div>

        <Card>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table data={fees} columns={columns} />
            )}
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Fee"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.roll_number})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Type
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.fee_type}
                onChange={(e) =>
                  setFormData({ ...formData, fee_type: e.target.value as FeeType })
                }
              >
                <option value="tuition">Tuition</option>
                <option value="examination">Examination</option>
                <option value="library">Library</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
