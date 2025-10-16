import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, getAllTeams, createTeam, updateTeam } from "@/lib/db"

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
  const teams = await getAllTeams()
  return NextResponse.json({ success: true, teams })
}

export async function POST(req: Request) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const name = String(body?.name || "")
  const creatorId = me.id
  if (!name) return NextResponse.json({ success: false, error: "name required" }, { status: 400 })
  const team = await createTeam(name, creatorId)
  if (body?.county) await updateTeam(team.id, { county: String(body.county) })
  return NextResponse.json({ success: true, team })
}


