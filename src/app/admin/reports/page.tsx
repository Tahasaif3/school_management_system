"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";
import { FeeSummaryResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [feeSummary, setFeeSummary] = useState<FeeSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.getFeeSummary();
      setFeeSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Total Collected</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(feeSummary?.total_collected || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Outstanding</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(feeSummary?.total_outstanding || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {feeSummary?.completion_rate || 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Total Fees</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    (feeSummary?.total_collected || 0) +
                      (feeSummary?.total_outstanding || 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Fee Collection by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {feeSummary?.by_type && Object.keys(feeSummary.by_type).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(feeSummary.by_type).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">
                      {formatCurrency(amount as number)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No fee data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
