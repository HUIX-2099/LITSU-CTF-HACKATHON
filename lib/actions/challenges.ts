"use server"

import {
  submitFlag,
  getUserSubmissions,
  createChallenge,
  getAllChallenges,
  updateChallenge,
  deleteChallenge,
  type DBChallenge,
  type NewChallengeInput,
} from "@/lib/db"
import { getCurrentUser } from "./auth"

export async function submitFlagAction(challengeId: string, flag: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const correct = await submitFlag(currentUser.id, challengeId, flag)

    return { success: true, correct }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit flag" }
  }
}

export async function getUserSubmissionsAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const submissions = await getUserSubmissions(currentUser.id)

    return { success: true, submissions }
  } catch (error) {
    return { success: false, error: "Failed to fetch submissions" }
  }
}

export async function getAllChallengesAction() {
  try {
    const challenges = await getAllChallenges()
    return { success: true, challenges }
  } catch (error) {
    return { success: false, error: "Failed to fetch challenges" }
  }
}

export async function createChallengeAction(challenge: NewChallengeInput) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const newChallenge = await createChallenge(challenge)
    return { success: true, challenge: newChallenge }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create challenge" }
  }
}

export async function updateChallengeAction(id: string, updates: Partial<DBChallenge>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const updatedChallenge = await updateChallenge(id, updates)
    return { success: true, challenge: updatedChallenge }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update challenge" }
  }
}

export async function deleteChallengeAction(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    await deleteChallenge(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete challenge" }
  }
}
