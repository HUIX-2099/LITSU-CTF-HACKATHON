import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById } from "@/lib/db"
import { promises as fs } from "fs"
import path from "path"

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
  const dir = path.join(process.cwd(), ".next-data")
  const files = ["users.json", "teams.json", "challenges.json", "submissions.json"]
  const payload: Record<string, unknown> = {}
  for (const f of files) {
    try {
      const full = path.join(dir, f)
      const data = await fs.readFile(full, "utf8").catch(() => "[]")
      payload[f] = JSON.parse(data)
    } catch {
      payload[f] = []
    }
  }
  return NextResponse.json({ success: true, data: payload })
}


