import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById, getAllChallenges, createChallenge, updateChallenge, deleteChallenge, type NewChallengeInput } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
  const challenges = await getAllChallenges()
  return NextResponse.json({ success: true, challenges })
}

export async function POST(req: Request) {
  const me = await requireAdmin()
  if (!me) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const input = (await req.json()) as NewChallengeInput
  const challenge = await createChallenge(input)
  return NextResponse.json({ success: true, challenge })
}


