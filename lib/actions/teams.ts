"use server"

import {
  createTeam,
  joinTeam,
  leaveTeam,
  getAllTeams,
  getTeamById,
  getUserById,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  type Team,
} from "@/lib/db"
import { getCurrentUser } from "./auth"

export async function createTeamAction(name: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    if (currentUser.teamId) {
      return { success: false, error: "You are already in a team" }
    }

    const team = await createTeam(name, currentUser.id)

    return {
      success: true,
      team: {
        id: team.id,
        name: team.name,
        inviteCode: team.inviteCode,
        members: team.members,
        score: team.score,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create team" }
  }
}

export async function joinTeamAction(inviteCode: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    if (currentUser.teamId) {
      return { success: false, error: "You are already in a team" }
    }

    const team = await joinTeam(currentUser.id, inviteCode)

    return {
      success: true,
      team: {
        id: team.id,
        name: team.name,
        inviteCode: team.inviteCode,
        members: team.members,
        score: team.score,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to join team" }
  }
}

export async function leaveTeamAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    if (!currentUser.teamId) {
      return { success: false, error: "You are not in a team" }
    }

    await leaveTeam(currentUser.id, currentUser.teamId)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to leave team" }
  }
}

export async function getTeamsAction() {
  try {
    const teams = await getAllTeams()

    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await Promise.all(team.members.map((id) => getUserById(id)))
        return {
          ...team,
          memberDetails: members.filter((m) => m !== null).map((m) => ({ id: m!.id, username: m!.username })),
        }
      }),
    )

    return { success: true, teams: teamsWithMembers }
  } catch (error) {
    return { success: false, error: "Failed to fetch teams" }
  }
}

export async function getTeamDetailsAction(teamId: string) {
  try {
    const team = await getTeamById(teamId)
    if (!team) {
      return { success: false, error: "Team not found" }
    }

    const members = await Promise.all(team.members.map((id) => getUserById(id)))

    return {
      success: true,
      team: {
        ...team,
        memberDetails: members
          .filter((m) => m !== null)
          .map((m) => ({ id: m!.id, username: m!.username, score: m!.score })),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to fetch team details" }
  }
}

export async function updateTeamAction(id: string, updates: Partial<Team>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const updatedTeam = await updateTeam(id, updates)
    return { success: true, team: updatedTeam }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update team" }
  }
}

export async function deleteTeamAction(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    await deleteTeam(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete team" }
  }
}

export async function getTeamMembersAction(teamId: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const members = await getTeamMembers(teamId)
    return { success: true, members }
  } catch (error) {
    return { success: false, error: "Failed to fetch team members" }
  }
}
