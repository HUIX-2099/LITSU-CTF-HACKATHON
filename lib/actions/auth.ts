"use server"

import { cookies } from "next/headers"
import { createUser, getUserByEmail } from "@/lib/db"

export async function loginAction(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid credentials" }
    }

    // Create session (in production, use proper session management)
    const cookieStore = await cookies()
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        score: user.score,
      },
    }
  } catch (error) {
    return { success: false, error: "Login failed" }
  }
}

export async function registerAction(username: string, email: string, password: string) {
  try {
    const user = await createUser(username, email, password)

    // Create session
    const cookieStore = await cookies()
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        score: user.score,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("user_id")
  return { success: true }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value

    if (!userId) {
      return null
    }

    const { getUserById } = await import("@/lib/db")
    const user = await getUserById(userId)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      score: user.score,
      solvedChallenges: user.solvedChallenges,
    }
  } catch (error) {
    return null
  }
}
