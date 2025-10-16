import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createUser, getAllUsers, getUserById, updateUser, type User } from "@/lib/db"

async function requireAdmin() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value
  if (!userId) return null
  const me = await getUserById(userId)
  if (!me || me.role !== "admin") return null
  return me
}

export async function GET() {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const users = await getAllUsers()
  return NextResponse.json({ success: true, users })
}

export async function POST(req: Request) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { username, email, password, role, county, score } = body as Partial<User> & { password?: string }
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: "username, email, password required" }, { status: 400 })
    }
    const user = await createUser(username, email, password)
    const updated = await updateUser(user.id, {
      role: (role === "admin" ? "admin" : "user"),
      county: county || undefined,
      score: typeof score === "number" ? score : user.score,
    })
    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}


