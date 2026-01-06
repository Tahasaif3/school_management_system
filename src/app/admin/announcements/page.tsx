"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Megaphone, Calendar, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  target_role: "all" | "admin" | "teacher" | "student";
  created_at: string;
  expires_at?: string;
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-700", icon: Info },
  normal: { color: "bg-blue-100 text-blue-700", icon: Megaphone },
  high: { color: "bg-orange-100 text-orange-700", icon: AlertCircle },
  urgent: { color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Mid-Term Examinations Schedule",
      content: "The mid-term examinations will commence from 15th January 2024. All students are requested to check their respective class schedules and prepare accordingly.",
      priority: "high",
      target_role: "all",
      created_at: "2024-01-05T10:00:00Z",
    },
    {
      id: "2",
      title: "Annual Sports Day",
      content: "Annual Sports Day will be held on 25th January 2024. All students should participate in at least one event. Registration forms are available with class teachers.",
      priority: "normal",
      target_role: "all",
      created_at: "2024-01-04T09:00:00Z",
    },
    {
      id: "3",
      title: "Fee Payment Deadline",
      content: "The last date for fee payment for the second term is 20th January 2024. Parents are requested to clear all pending dues.",
      priority: "urgent",
      target_role: "all",
      created_at: "2024-01-03T14:00:00Z",
      expires_at: "2024-01-20T23:59:59Z",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "normal" as const,
    target_role: "all" as const,
  });

  const handleCreate = () => {
    const announcement: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      created_at: new Date().toISOString(),
    };
    setAnnouncements([announcement, ...announcements]);
    setShowModal(false);
    setNewAnnouncement({ title: "", content: "", priority: "normal", target_role: "all" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityIcon = (priority: keyof typeof priorityConfig) => {
    const Icon = priorityConfig[priority].icon;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-500">School-wide notifications and updates</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Megaphone className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Urgent</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {announcements.filter((a) => a.priority === "urgent").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-orange-600">High Priority</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {announcements.filter((a) => a.priority === "high").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600">Normal</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {announcements.filter((a) => a.priority === "normal").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Low Priority</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {announcements.filter((a) => a.priority === "low").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`${priorityConfig[announcement.priority].color} border-0`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-white/50">
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <Badge variant={announcement.priority === "urgent" ? "danger" : "default"}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline" className="bg-white/50">
                        {announcement.target_role}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80 mb-4">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs opacity-60">
                      <span>Posted: {formatDate(announcement.created_at)}</span>
                      {announcement.expires_at && (
                        <span>Expires: {formatDate(announcement.expires_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Announcement"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
            placeholder="Announcement title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={newAnnouncement.content}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
              }
              placeholder="Announcement content..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    priority: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                value={newAnnouncement.target_role}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    target_role: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="admin">Admin Only</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newAnnouncement.title || !newAnnouncement.content}>
              Publish
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
