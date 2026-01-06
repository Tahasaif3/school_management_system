"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { User, Shield } from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.getCurrentUser();
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading...</div>
      </DashboardLayout>
    );
  }

  const profileData = userData || user;

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-gray-500">
          No profile information found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-sm text-gray-500">View and manage your profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-semibold">{profileData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-lg">{profileData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <div className="mt-1">
                  <Badge variant="success" className="capitalize">
                    {profileData.role}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={profileData.status === "active" ? "success" : "danger"}>
                    {profileData.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Account Created</label>
                <p className="text-lg">
                  {profileData.created_at ? formatDate(profileData.created_at) : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-lg">
                  {profileData.updated_at ? formatDate(profileData.updated_at) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Admin Privileges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <User className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="font-medium">Student Management</p>
                  <p className="text-sm text-gray-500">Manage student records</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Shield className="w-6 h-6 text-purple-500 mb-2" />
                  <p className="font-medium">System Administration</p>
                  <p className="text-sm text-gray-500">Full system access</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <User className="w-6 h-6 text-green-500 mb-2" />
                  <p className="font-medium">Content Management</p>
                  <p className="text-sm text-gray-500">Manage events and announcements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

