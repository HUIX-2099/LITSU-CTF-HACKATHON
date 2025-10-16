import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createUser } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const user = await createUser(username, email, password)

    const cookieStore = await cookies()
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        score: user.score,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}


