"use server"

import { getAllUsers, getAllTeams, getAllSubmissions } from "@/lib/db"

export interface ScoreboardEntry {
  id: string
  name: string
  score: number
  solves: number
  lastSolve?: string
  isTeam: boolean
  rank?: number
}

export async function getAllSubmissionsAction() {
  try {
    const submissions = await getAllSubmissions()
    return { success: true, submissions }
  } catch (error) {
    return { success: false, error: "Failed to fetch submissions" }
  }
}

export async function getScoreboardAction() {
  try {
    const [users, teams] = await Promise.all([getAllUsers(), getAllTeams()])

    const userEntries: ScoreboardEntry[] = users.map((u) => ({
      id: u.id,
      name: u.username,
      score: u.score,
      solves: u.solvedChallenges.length,
      lastSolve: undefined,
      isTeam: false,
    }))

    const teamEntries: ScoreboardEntry[] = teams.map((t) => ({
      id: t.id,
      name: t.name,
      score: t.score,
      solves: 0,
      lastSolve: undefined,
      isTeam: true,
    }))

    const merged = [...userEntries, ...teamEntries].sort((a, b) => b.score - a.score)
    merged.forEach((e, i) => (e.rank = i + 1))

    return { success: true, entries: merged }
  } catch (error) {
    return { success: false, error: "Failed to compute scoreboard" }
  }
}

export async function getStatsAction() {
  try {
    const [users, teams, submissions] = await Promise.all([
      getAllUsers(),
      getAllTeams(),
      getAllSubmissions(),
    ])
    const totalSolves = submissions.filter((s) => s.correct).length
    const activeToday = users.filter((u) => {
      const d = new Date(u.lastSeen)
      const now = new Date()
      return d.toDateString() === now.toDateString()
    }).length
    const submissionsToday = submissions.filter((s) => {
      const d = new Date(s.timestamp)
      const now = new Date()
      return d.toDateString() === now.toDateString()
    }).length
    return {
      success: true,
      stats: {
        users: users.length,
        teams: teams.length,
        totalSolves,
        activeToday,
        submissionsToday,
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to compute stats" }
  }
}
