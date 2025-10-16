import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, updateUser, verifyPassword, hashPassword } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Support both hashed and legacy plaintext-stored passwords, and auto-upgrade when needed
    let valid = false
    if (typeof user.password === "string" && user.password.includes(":")) {
      valid = await verifyPassword(password, user.password)
    } else {
      valid = password === user.password
      if (valid) {
        try {
          const upgraded = await hashPassword(password)
          await updateUser(user.id, { password: upgraded })
        } catch {}
      }
    }

    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    await updateUser(user.id, { isOnline: true, lastSeen: new Date().toISOString() })

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
        solvedChallenges: user.solvedChallenges,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}


