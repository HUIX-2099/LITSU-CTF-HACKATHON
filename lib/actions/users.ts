"use server"

import { getCurrentUser } from "./auth"
import { getAllUsers, getUserById, updateUser, deleteUser, updateUserStatus, getOnlineUsers, type User } from "@/lib/db"

export async function getAllUsersAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const users = await getAllUsers()
    return { success: true, users }
  } catch (error) {
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUserByIdAction(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const user = await getUserById(id)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function updateUserAction(id: string, updates: Partial<User>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const updatedUser = await updateUser(id, updates)
    return { success: true, user: updatedUser }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" }
  }
}

export async function deleteUserAction(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    await deleteUser(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
  }
}

export async function updateUserStatusAction(isOnline: boolean) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    await updateUserStatus(currentUser.id, isOnline)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update status" }
  }
}

export async function getOnlineUsersAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const users = await getOnlineUsers()
    return { success: true, users }
  } catch (error) {
    return { success: false, error: "Failed to fetch online users" }
  }
}
