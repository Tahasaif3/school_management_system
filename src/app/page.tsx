import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function Home() {
  const token = getToken();

  if (token) {
    // Determine dashboard based on user role (stored in localStorage via auth context)
    redirect("/admin/students");
  } else {
    redirect("/login");
  }
}
