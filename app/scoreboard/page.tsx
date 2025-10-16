"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, User, RefreshCw, Award, Clock } from "lucide-react"
import { Footer } from "@/components/footer"
import { getScoreboardAction, type ScoreboardEntry } from "@/lib/actions/scoreboard"
import { getAllUsersAction } from "@/lib/actions/users"
import { getTeamsAction } from "@/lib/actions/teams"
import type { User as UserType, Team } from "@/lib/db"

export default function ScoreboardPage() {
  const [viewMode, setViewMode] = useState<"all" | "teams" | "users">("all")
  const [entries, setEntries] = useState<ScoreboardEntry[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [scoreboardRes, usersRes, teamsRes] = await Promise.all([
          getScoreboardAction(),
          getAllUsersAction(),
          getTeamsAction()
        ])
        
        if (scoreboardRes.success && scoreboardRes.entries) setEntries(scoreboardRes.entries)
        if (usersRes.success && usersRes.users) setUsers(usersRes.users as UserType[])
        if (teamsRes.success && teamsRes.teams) setTeams(teamsRes.teams as unknown as Team[])
        
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Failed to load scoreboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredScoreboard = entries.filter((entry) => {
    if (viewMode === "teams") return entry.isTeam
    if (viewMode === "users") return !entry.isTeam
    return true
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">Scoreboard</h1>
              <p className="text-black/60 text-lg">
                Live rankings • Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={loading}
              className="uppercase font-bold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-12">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className="uppercase tracking-wide font-bold"
          >
            <Trophy className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={viewMode === "teams" ? "default" : "outline"}
            onClick={() => setViewMode("teams")}
            className="uppercase tracking-wide font-bold"
          >
            <Users className="h-4 w-4 mr-2" />
            Teams ({teams.length})
          </Button>
          <Button
            variant={viewMode === "users" ? "default" : "outline"}
            onClick={() => setViewMode("users")}
            className="uppercase tracking-wide font-bold"
          >
            <User className="h-4 w-4 mr-2" />
            Users ({users.length})
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {filteredScoreboard.slice(0, 3).map((entry, index) => {
            const isTeam = entry.isTeam
            const teamData = isTeam ? teams.find(t => t.name === entry.name) : null
            const userData = !isTeam ? users.find(u => u.username === entry.name) : null
            
            return (
              <div
                key={entry.id}
                className={`border p-8 border-neutral-200 bg-white relative ${
                  index === 0 ? 'ring-2 ring-yellow-400' : 
                  index === 1 ? 'ring-2 ring-gray-300' : 
                  index === 2 ? 'ring-2 ring-orange-400' : ''
                }`}
              >
                {index < 3 && (
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      'bg-orange-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  </div>
                )}
                
                <div className="font-mono text-xs text-black/40 mb-4 tracking-widest">
                  RANK {String(entry.rank).padStart(2, "0")}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={isTeam ? `/placeholder-logo.jpg` : `/placeholder-user.jpg`} />
                    <AvatarFallback className="bg-primary text-white text-xl font-bold">
                      {entry.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{entry.name}</h3>
                    {isTeam ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Users className="h-3 w-3 mr-1" />
                          TEAM
                        </Badge>
                        <span className="text-sm text-black/60">{teamData?.members.length || 0} members</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <User className="h-3 w-3 mr-1" />
                          USER
                        </Badge>
                        <span className="text-sm text-black/60">{userData?.county || 'No County'}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-black/40">Score</span>
                    <span className="text-2xl font-black">{entry.score}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs uppercase tracking-wide text-black/40">Solves</span>
                    <span className="text-lg font-bold">{entry.solves}</span>
                  </div>
                  {isTeam && teamData && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs uppercase tracking-wide text-black/40">Members</span>
                      <span className="text-sm font-bold">{teamData.members.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white border-b border-neutral-200">
              <tr>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Rank</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Name</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Score</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Solves</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Last Solve</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {filteredScoreboard.map((entry, index) => {
                const isTeam = entry.isTeam
                const teamData = isTeam ? teams.find(t => t.name === entry.name) : null
                const userData = !isTeam ? users.find(u => u.username === entry.name) : null
                
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-neutral-200 hover:bg-black/5 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${entry.rank && entry.rank <= 3 ? "text-black" : "text-black/60"}`}>
                          #{String(entry.rank).padStart(2, "0")}
                        </span>
                        {index < 3 && (
                          <span className="text-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={isTeam ? `/placeholder-logo.jpg` : `/placeholder-user.jpg`} />
                          <AvatarFallback className="bg-primary text-white text-xs font-bold">
                            {entry.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{entry.name}</div>
                          <div className="text-xs text-black/60">
                            {isTeam ? `${teamData?.members.length || 0} members` : userData?.county || 'No County'}
                          </div>
                        </div>
                        {entry.isTeam && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            TEAM
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-black">{entry.score}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-black/60">{entry.solves}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-black/40">{entry.lastSolve || "-"}</span>
                    </td>
                    <td className="p-4">
                      {isTeam ? (
                        <Badge variant={teamData?.isOnline ? "default" : "outline"} className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {teamData?.isOnline ? "Online" : "Offline"}
                        </Badge>
                      ) : (
                        <Badge variant={userData?.isOnline ? "default" : "outline"} className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {userData?.isOnline ? "Online" : "Offline"}
                        </Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  )
}
