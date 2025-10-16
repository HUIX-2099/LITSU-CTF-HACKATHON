import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, updateUser, hashPassword } from "@/lib/db"

async function requireUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value
  if (!userId) return null
  const me = await getUserById(userId)
  return me
}

export async function PATCH(req: Request) {
  const me = await requireUser()
  if (!me) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
  const body = await req.json()
  const updates: any = {}
  if (typeof body.username === "string" && body.username.trim()) updates.username = body.username.trim()
  if (typeof body.email === "string" && body.email.trim()) updates.email = body.email.trim()
  if (typeof body.county === "string") updates.county = body.county
  if (typeof body.password === "string" && body.password.length >= 8) {
    updates.password = await hashPassword(body.password)
  }
  const updated = await updateUser(me.id, updates)
  return NextResponse.json({ success: true, user: {
    id: updated.id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    teamId: updated.teamId,
    score: updated.score,
    solvedChallenges: updated.solvedChallenges,
  } })
}


