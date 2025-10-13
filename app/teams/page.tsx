"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateTeamDialog } from "@/components/create-team-dialog"
import { JoinTeamDialog } from "@/components/join-team-dialog"
import { Users, Trophy, Crown, UserPlus, Plus, Copy, Check } from "lucide-react"
import { mockTeams, type Team } from "@/lib/teams-data"
import { Footer } from "@/components/footer"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCreateTeam = (name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      captain: "current_user",
      members: [{ id: "current", username: "current_user", score: 0, role: "captain" }],
      score: 0,
      solves: 0,
      createdAt: new Date().toISOString().split("T")[0],
      inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    }
    setTeams([...teams, newTeam])
  }

  const handleJoinTeam = (inviteCode: string) => {
    const team = teams.find((t) => t.inviteCode === inviteCode)
    if (team) {
      alert(`Successfully joined ${team.name}!`)
    } else {
      alert("Invalid invite code")
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Teams</h1>
            <p className="text-muted-foreground">Collaborate with others to solve challenges together</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
            <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Join Team
            </Button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedTeam(team)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Crown className="h-3 w-3" />
                      <span>{team.captain}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Score</span>
                  <span className="font-bold text-primary">{team.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Solves</span>
                  <span className="font-semibold">{team.solves}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <Badge variant="outline">{team.members.length}</Badge>
                </div>
              </div>

              {team.inviteCode && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">Invite Code</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyInviteCode(team.inviteCode!)
                      }}
                      className="h-7 px-2"
                    >
                      <code className="text-xs font-mono mr-2">{team.inviteCode}</code>
                      {copiedCode === team.inviteCode ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Team Details Modal */}
        {selectedTeam && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <Card className="max-w-2xl w-full p-6 bg-card border-border" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedTeam.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Crown className="h-4 w-4" />
                    <span>Captain: {selectedTeam.captain}</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedTeam(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1">{selectedTeam.score}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="text-2xl font-bold text-secondary mb-1">{selectedTeam.solves}</div>
                  <div className="text-sm text-muted-foreground">Solves</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="text-2xl font-bold text-accent mb-1">{selectedTeam.members.length}</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </h3>
                <div className="space-y-2">
                  {selectedTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">{member.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-medium">{member.username}</div>
                          {member.role === "captain" && (
                            <Badge variant="outline" className="text-xs">
                              Captain
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{member.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <CreateTeamDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateTeam}
      />
      <JoinTeamDialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} onJoin={handleJoinTeam} />

      <Footer />
    </div>
  )
}
