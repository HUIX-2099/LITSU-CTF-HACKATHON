"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockScoreboard } from "@/lib/scoreboard-data"
import { Footer } from "@/components/footer"

export default function ScoreboardPage() {
  const [viewMode, setViewMode] = useState<"all" | "teams" | "users">("all")

  const filteredScoreboard = mockScoreboard.filter((entry) => {
    if (viewMode === "teams") return entry.isTeam
    if (viewMode === "users") return !entry.isTeam
    return true
  })

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">Scoreboard</h1>
          <p className="text-white/60 text-lg">Live rankings updated in real-time</p>
        </div>

        <div className="flex items-center gap-3 mb-12">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className="uppercase tracking-wide font-bold"
          >
            All
          </Button>
          <Button
            variant={viewMode === "teams" ? "default" : "outline"}
            onClick={() => setViewMode("teams")}
            className="uppercase tracking-wide font-bold"
          >
            Teams
          </Button>
          <Button
            variant={viewMode === "users" ? "default" : "outline"}
            onClick={() => setViewMode("users")}
            className="uppercase tracking-wide font-bold"
          >
            Users
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {filteredScoreboard.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className={`border-2 p-8 ${
                entry.rank === 1
                  ? "border-primary bg-primary/5"
                  : entry.rank === 2
                    ? "border-white/40 bg-white/5"
                    : "border-white/20 bg-white/5"
              }`}
            >
              <div className="font-mono text-xs text-white/40 mb-4 tracking-widest">
                RANK {String(entry.rank).padStart(2, "0")}
              </div>
              <div className="text-7xl font-black tracking-tighter mb-4 text-primary">{entry.rank}</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{entry.name}</h3>
              {entry.isTeam && (
                <div className="inline-block border border-white/20 px-2 py-1 mb-4">
                  <span className="text-xs font-mono tracking-wider">TEAM</span>
                </div>
              )}
              <div className="mt-4 pt-4 border-t-2 border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-white/40">Score</span>
                  <span className="text-2xl font-black">{entry.score}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs uppercase tracking-wide text-white/40">Solves</span>
                  <span className="text-lg font-bold">{entry.solves}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-2 border-white/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1e1e1e] border-b-2 border-white/20">
              <tr>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Rank</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Name</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Score</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Solves</th>
                <th className="text-left p-4 font-black uppercase tracking-wide text-xs">Last Solve</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {filteredScoreboard.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                    index < 3 ? "bg-white/5" : ""
                  }`}
                >
                  <td className="p-4">
                    <span className={`font-bold ${entry.rank <= 3 ? "text-primary" : "text-white/60"}`}>
                      #{String(entry.rank).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{entry.name}</span>
                      {entry.isTeam && <span className="text-xs border border-white/20 px-2 py-0.5">TEAM</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-primary">{entry.score}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-white/60">{entry.solves}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-white/40">{entry.lastSolve}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  )
}
