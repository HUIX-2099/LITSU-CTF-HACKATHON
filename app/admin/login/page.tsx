import { redirect } from "next/navigation"

export default function AdminLoginPage() {
  // Admins and users share the same login page
  redirect("/login")
}
