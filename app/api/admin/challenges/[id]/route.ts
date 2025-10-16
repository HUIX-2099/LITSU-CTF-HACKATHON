import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, updateChallenge, deleteChallenge } from "@/lib/db"

async function requireAdmin() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value
  if (!userId) return null
  const me = await getUserById(userId)
  if (!me || me.role !== "admin") return null
  return me
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const updates = await req.json()
  const c = await updateChallenge(params.id, updates)
  return NextResponse.json({ success: true, challenge: c })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  await deleteChallenge(params.id)
  return NextResponse.json({ success: true })
}


