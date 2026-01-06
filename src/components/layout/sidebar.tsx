"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  Megaphone,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  DollarSign,
  FileText,
  BarChart,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  User,
  Bell,
  Book,
} from "lucide-react";
import { useState } from "react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/admin/fees", label: "Fees", icon: DollarSign },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/homework", label: "Homework", icon: Book },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/reports", label: "Reports", icon: BarChart },
];

const teacherLinks = [
  { href: "/teacher/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/teacher/marks", label: "Marks", icon: FileText },
];

const studentLinks = [
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/student/fees", label: "Fees", icon: DollarSign },
  { href: "/student/marks", label: "Marks", icon: FileText },
  { href: "/student/events", label: "Events", icon: Calendar },
  { href: "/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/student/homework", label: "Homework", icon: Book },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userRole, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const links = userRole === "admin"
    ? adminLinks
    : userRole === "teacher"
      ? teacherLinks
      : studentLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-white/5">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            SchoolOS
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
            {userRole || "Guest"}
          </p>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden ml-auto">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/5 text-primary font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                <span>{link.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary opacity-100 transition-opacity" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full text-left text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-600 transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl animate-in slide-in-from-left duration-300">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 h-screen shadow-xl shadow-gray-200/50 dark:shadow-none z-30">
        <NavContent />
      </div>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black font-sans">
      <Sidebar />
      <div className="lg:pl-72 transition-all duration-300">
        <main className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
