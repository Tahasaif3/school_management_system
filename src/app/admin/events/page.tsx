"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Flag,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: "holiday" | "exam" | "activity" | "meeting" | "other";
  start_date: string;
  end_date: string;
  target_classes: string;
}

const eventTypeConfig = {
  holiday: { color: "bg-green-100 border-green-300 text-green-800", icon: Flag },
  exam: { color: "bg-red-100 border-red-300 text-red-800", icon: BookOpen },
  activity: { color: "bg-purple-100 border-purple-300 text-purple-800", icon: Users },
  meeting: { color: "bg-blue-100 border-blue-300 text-blue-800", icon: Clock },
  other: { color: "bg-gray-100 border-gray-300 text-gray-800", icon: Calendar },
};

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Winter Vacation",
      description: "Winter break for all students",
      event_type: "holiday",
      start_date: "2024-01-15",
      end_date: "2024-01-28",
      target_classes: "all",
    },
    {
      id: "2",
      title: "Mathematics Unit Test",
      description: "Unit test for Class 9 and 10",
      event_type: "exam",
      start_date: "2024-01-20",
      end_date: "2024-01-20",
      target_classes: "9,10",
    },
    {
      id: "3",
      title: "Science Exhibition",
      description: "Annual science exhibition",
      event_type: "activity",
      start_date: "2024-01-25",
      end_date: "2024-01-26",
      target_classes: "all",
    },
    {
      id: "4",
      title: "Parent-Teacher Meeting",
      description: "PTM for all classes",
      event_type: "meeting",
      start_date: "2024-01-30",
      end_date: "2024-01-30",
      target_classes: "all",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "other" as const,
    start_date: "",
    end_date: "",
    target_classes: "",
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true });
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return events.filter(
      (event) => dateStr >= event.start_date && dateStr <= event.end_date
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCreate = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
    };
    setEvents([...events, event]);
    setShowModal(false);
    setNewEvent({
      title: "",
      description: "",
      event_type: "other",
      start_date: "",
      end_date: "",
      target_classes: "",
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">School Calendar</h1>
            <p className="text-gray-500">Events, holidays, and activities</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(eventTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`p-1 rounded ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm capitalize">{type}</span>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = day.date ? getEventsForDate(day.date) : [];
                const isToday =
                  day.date === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`min-h-24 p-1 border border-gray-100 rounded-lg ${
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
                  >
                    {day.date && (
                      <>
                        <div
                          className={`text-xs font-medium text-right p-1 ${
                            isToday
                              ? "bg-indigo-500 text-white rounded"
                              : "text-gray-500"
                          }`}
                        >
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => {
                            const config =
                              eventTypeConfig[event.event_type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${config.color}`}
                                title={event.title}
                              >
                                <Icon className="w-3 h-3 inline mr-0.5" />
                                {event.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter((e) => e.start_date >= new Date().toISOString().split("T")[0])
                .slice(0, 5)
                .map((event) => {
                  const config = eventTypeConfig[event.event_type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {event.start_date === event.end_date
                            ? event.start_date
                            : `${event.start_date} to ${event.end_date}`}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.event_type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Event"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            placeholder="Enter event title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Event description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={newEvent.start_date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start_date: e.target.value })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={newEvent.end_date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end_date: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={newEvent.event_type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    event_type: e.target.value as any,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="holiday">Holiday</option>
                <option value="exam">Exam</option>
                <option value="activity">Activity</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Target Classes"
              value={newEvent.target_classes}
              onChange={(e) =>
                setNewEvent({ ...newEvent, target_classes: e.target.value })
              }
              placeholder="e.g., 9,10 or all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newEvent.title || !newEvent.start_date}
            >
              Create Event
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
