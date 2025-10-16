import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserById } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value
    if (!userId) return NextResponse.json({ user: null })
    const user = await getUserById(userId)
    if (!user) return NextResponse.json({ user: null })
    // Rolling session: refresh cookie expiry on activity
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        score: user.score,
        solvedChallenges: user.solvedChallenges,
      },
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}


