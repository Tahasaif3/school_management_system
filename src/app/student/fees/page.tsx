"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { Fee } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const studentRes = await api.getMyStudentRecord();
      const studentId = studentRes.data.id;

      const response = await api.getStudentFees(studentId);
      setFees(response.data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: "fee_type",
      header: "Type",
      render: (fee: Fee) => (
        <span className="capitalize">{fee.fee_type}</span>
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
        <Badge variant={fee.status === "paid" ? "success" : "warning"}>
          {fee.status}
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

  const totalUnpaid = fees
    .filter((f) => f.status === "unpaid")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Fees</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Total Fees</div>
              <div className="text-2xl font-bold">
                {formatCurrency(fees.reduce((sum, f) => sum + f.amount, 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Outstanding</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalUnpaid)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fee History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : fees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No fee records found
              </div>
            ) : (
              <Table data={fees} columns={columns} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
