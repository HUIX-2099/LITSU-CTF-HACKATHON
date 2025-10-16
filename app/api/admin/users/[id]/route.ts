import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, updateUser, deleteUser } from "@/lib/db"

async function requireAdmin() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value
  if (!userId) return null
  const me = await getUserById(userId)
  if (!me || me.role !== "admin") return null
  return me
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const body = await _req.json()
  const updated = await updateUser(params.id, body)
  return NextResponse.json({ success: true, user: updated })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  await deleteUser(params.id)
  return NextResponse.json({ success: true })
}


