"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Flag,
  Trophy,
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Shield,
  HardDrive,
  Database,
  Server,
  Wifi,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { getAllChallenges, getAllUsers, getAllTeams, deleteChallenge } from "@/lib/db"
import type { DBChallenge, User, Team } from "@/lib/db"
import { AdminChallengeForm } from "@/components/admin-challenge-form"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "traffic" | "challenges" | "users" | "teams">("overview")
  const [challenges, setChallenges] = useState<DBChallenge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [showChallengeForm, setShowChallengeForm] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<DBChallenge | null>(null)
  const [loading, setLoading] = useState(true)

  const [trafficData, setTrafficData] = useState({
    currentUsers: 47,
    requestsPerMin: 234,
    avgResponseTime: 45,
    bandwidth: "2.4 MB/s",
  })

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/challenges")
      return
    }

    if (!user) {
      router.push("/admin/login")
      return
    }

    loadData()

    const interval = setInterval(() => {
      setTrafficData({
        currentUsers: Math.floor(Math.random() * 20) + 40,
        requestsPerMin: Math.floor(Math.random() * 100) + 200,
        avgResponseTime: Math.floor(Math.random() * 30) + 30,
        bandwidth: `${(Math.random() * 2 + 1).toFixed(1)} MB/s`,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [user, router])

  const loadData = async () => {
    try {
      const [challengesData, usersData, teamsData] = await Promise.all([
        getAllChallenges(),
        getAllUsers(),
        getAllTeams(),
      ])
      setChallenges(challengesData)
      setUsers(usersData)
      setTeams(teamsData)
    } catch (error) {
      console.error("[v0] Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return

    try {
      await deleteChallenge(id)
      await loadData()
    } catch (error) {
      console.error("[v0] Failed to delete challenge:", error)
      alert("Failed to delete challenge")
    }
  }

  const handleEditChallenge = (challenge: DBChallenge) => {
    setEditingChallenge(challenge)
    setShowChallengeForm(true)
  }

  const handleChallengeFormClose = () => {
    setShowChallengeForm(false)
    setEditingChallenge(null)
    loadData()
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191919] flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading admin panel...</div>
      </div>
    )
  }

  const stats = {
    totalUsers: users.length,
    totalChallenges: challenges.length,
    totalTeams: teams.length,
    activeSolves: challenges.reduce((acc, c) => acc + c.solves, 0),
    storageUsed: "2.4 GB",
    storageTotal: "10 GB",
    storagePercent: 24,
    activeUsers: Math.floor(users.length * 0.6),
    submissionsToday: 47,
  }

  const activityLog = [
    {
      id: 1,
      type: "solve",
      user: "elite_hacker",
      action: "solved",
      target: "Basic SQL Injection",
      time: "2 min ago",
      ip: "192.168.1.45",
    },
    {
      id: 2,
      type: "solve",
      user: "crypto_master",
      action: "solved",
      target: "RSA Weak Keys",
      time: "15 min ago",
      ip: "192.168.1.78",
    },
    {
      id: 3,
      type: "team",
      user: "web_wizard",
      action: "joined team",
      target: "CyberNinjas",
      time: "1 hour ago",
      ip: "192.168.1.92",
    },
    {
      id: 4,
      type: "solve",
      user: "pwn_noob",
      action: "solved",
      target: "Buffer Overflow 101",
      time: "2 hours ago",
      ip: "192.168.1.34",
    },
    {
      id: 5,
      type: "login",
      user: "forensics_pro",
      action: "logged in",
      target: "Platform",
      time: "3 hours ago",
      ip: "192.168.1.56",
    },
    {
      id: 6,
      type: "register",
      user: "newbie_123",
      action: "registered",
      target: "New Account",
      time: "4 hours ago",
      ip: "192.168.1.89",
    },
  ]

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              Admin Panel
            </h1>
            <p className="text-white/60 text-sm md:text-base">LITSU CTF Platform Management</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2 uppercase font-bold">
            Admin Access
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black mb-1 text-white">{stats.totalUsers}</div>
            <div className="text-xs md:text-sm text-white/60 uppercase tracking-wide font-bold">Total Users</div>
            <div className="text-xs text-primary mt-2 font-mono">{stats.activeUsers} active today</div>
          </Card>

          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Flag className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black mb-1 text-white">{stats.totalChallenges}</div>
            <div className="text-xs md:text-sm text-white/60 uppercase tracking-wide font-bold">Challenges</div>
            <div className="text-xs text-primary mt-2 font-mono">{stats.activeSolves} total solves</div>
          </Card>

          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black mb-1 text-white">{stats.totalTeams}</div>
            <div className="text-xs md:text-sm text-white/60 uppercase tracking-wide font-bold">Teams</div>
            <div className="text-xs text-primary mt-2 font-mono">{stats.submissionsToday} submissions today</div>
          </Card>

          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-primary">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black mb-1 text-white">{stats.storageUsed}</div>
            <div className="text-xs md:text-sm text-white/60 uppercase tracking-wide font-bold">Storage Used</div>
            <div className="mt-3">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${stats.storagePercent}%` }} />
              </div>
              <div className="text-xs text-white/40 mt-1 font-mono">of {stats.storageTotal}</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Backend</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 uppercase font-bold">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Database</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 uppercase font-bold">
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">API</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 uppercase font-bold">
                  Healthy
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">Platform Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Version</span>
                <span className="text-sm font-mono text-white">v2.0.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Uptime</span>
                <span className="text-sm font-mono text-white">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Region</span>
                <span className="text-sm font-mono text-white">Liberia</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">Quick Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Avg Score</span>
                <span className="text-sm font-mono text-primary font-bold">
                  {Math.floor(users.reduce((acc, e) => acc + e.score, 0) / users.length || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Top Score</span>
                <span className="text-sm font-mono text-primary font-bold">
                  {users.reduce((max, u) => Math.max(max, u.score), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Completion</span>
                <span className="text-sm font-mono text-primary font-bold">
                  {Math.floor((stats.activeSolves / (stats.totalChallenges * stats.totalUsers)) * 100) || 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 border-b-2 border-white/20 overflow-x-auto">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="rounded-b-none uppercase font-bold text-xs md:text-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "traffic" ? "default" : "ghost"}
            onClick={() => setActiveTab("traffic")}
            className="rounded-b-none uppercase font-bold text-xs md:text-sm"
          >
            <Wifi className="h-4 w-4 mr-2" />
            Traffic
          </Button>
          <Button
            variant={activeTab === "challenges" ? "default" : "ghost"}
            onClick={() => setActiveTab("challenges")}
            className="rounded-b-none uppercase font-bold text-xs md:text-sm"
          >
            <Flag className="h-4 w-4 mr-2" />
            Challenges
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            onClick={() => setActiveTab("users")}
            className="rounded-b-none uppercase font-bold text-xs md:text-sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === "teams" ? "default" : "ghost"}
            onClick={() => setActiveTab("teams")}
            className="rounded-b-none uppercase font-bold text-xs md:text-sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Teams
          </Button>
        </div>

        {activeTab === "traffic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-[#1e1e1e] border-2 border-primary">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="h-8 w-8 text-primary" />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-3xl font-black mb-1 text-white">{trafficData.currentUsers}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide font-bold">Current Users</div>
                <div className="text-xs text-green-500 mt-2 font-mono">+12% from last hour</div>
              </Card>

              <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 text-primary" />
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-black mb-1 text-white">{trafficData.requestsPerMin}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide font-bold">Requests/Min</div>
                <div className="text-xs text-primary mt-2 font-mono">Real-time</div>
              </Card>

              <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-3xl font-black mb-1 text-white">{trafficData.avgResponseTime}ms</div>
                <div className="text-xs text-white/60 uppercase tracking-wide font-bold">Avg Response</div>
                <div className="text-xs text-green-500 mt-2 font-mono">Excellent</div>
              </Card>

              <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Database className="h-8 w-8 text-primary" />
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-black mb-1 text-white">{trafficData.bandwidth}</div>
                <div className="text-xs text-white/60 uppercase tracking-wide font-bold">Bandwidth</div>
                <div className="text-xs text-primary mt-2 font-mono">Current usage</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Load Balancer Stats</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/60 uppercase tracking-wide font-bold">
                        Server 1 (Primary)
                      </span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "65%" }} />
                    </div>
                    <div className="text-xs text-white/40 mt-1 font-mono">CPU: 65% | RAM: 4.2GB/8GB</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Server 2 (Backup)</span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "42%" }} />
                    </div>
                    <div className="text-xs text-white/40 mt-1 font-mono">CPU: 42% | RAM: 3.1GB/8GB</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/60 uppercase tracking-wide font-bold">Database Server</span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Healthy</Badge>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "28%" }} />
                    </div>
                    <div className="text-xs text-white/40 mt-1 font-mono">CPU: 28% | RAM: 2.8GB/16GB</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Activity Log</h3>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {activityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-white/10"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {activity.type === "solve" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {activity.type === "team" && <Users className="h-4 w-4 text-primary" />}
                        {activity.type === "login" && <Shield className="h-4 w-4 text-blue-500" />}
                        {activity.type === "register" && <Plus className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-bold text-white">{activity.user}</span>
                          <span className="text-white/60"> {activity.action} </span>
                          <span className="font-medium text-primary">{activity.target}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/40 font-mono">{activity.ip}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black uppercase tracking-tight">System Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-green-500">All Systems Operational</div>
                    <div className="text-xs text-white/60 mt-1">No issues detected. Platform running smoothly.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
              <h3 className="text-xl font-semibold mb-4 uppercase tracking-tight">Recent Activity</h3>
              <div className="space-y-3">
                {activityLog.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{activity.user[0].toUpperCase()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-medium">{activity.target}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-tight">Top Performers</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">#{user.rank}</span>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <span className="font-bold text-primary">{user.score}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-[#1e1e1e] border-2 border-white/20">
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-tight">Challenge Stats</h3>
                <div className="space-y-3">
                  {challenges
                    .sort((a, b) => b.solves - a.solves)
                    .slice(0, 5)
                    .map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between">
                        <span className="font-medium text-sm">{challenge.title}</span>
                        <Badge variant="outline">{challenge.solves} solves</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Challenges</h3>
              <Button onClick={() => setShowChallengeForm(true)} className="uppercase font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Challenge
              </Button>
            </div>

            {showChallengeForm && (
              <AdminChallengeForm challenge={editingChallenge} onClose={handleChallengeFormClose} />
            )}

            <Card className="overflow-hidden bg-[#1e1e1e] border-2 border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Title</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Category</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Difficulty</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Points</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Solves</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((challenge) => (
                      <tr key={challenge.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{challenge.title}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="uppercase">
                            {challenge.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="uppercase">
                            {challenge.difficulty}
                          </Badge>
                        </td>
                        <td className="p-4 text-primary font-semibold">{challenge.points}</td>
                        <td className="p-4 text-muted-foreground">{challenge.solves}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditChallenge(challenge)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteChallenge(challenge.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Users</h3>
              <Button variant="outline" className="uppercase font-bold bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                User Settings
              </Button>
            </div>

            <Card className="overflow-hidden bg-[#1e1e1e] border-2 border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Username</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Email</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Role</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Score</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Solves</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{u.username}</td>
                        <td className="p-4 text-white/60 font-mono text-sm">{u.email}</td>
                        <td className="p-4">
                          <Badge variant={u.role === "admin" ? "default" : "outline"} className="uppercase">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-primary font-semibold">{u.score}</td>
                        <td className="p-4 text-muted-foreground">{u.solvedChallenges.length}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Teams</h3>
              <Button variant="outline" className="uppercase font-bold bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Team Settings
              </Button>
            </div>

            <Card className="overflow-hidden bg-[#1e1e1e] border-2 border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Team Name</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Invite Code</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Members</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Score</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{team.name}</td>
                        <td className="p-4 font-mono text-sm text-primary">{team.inviteCode}</td>
                        <td className="p-4">
                          <Badge variant="outline">{team.members.length}</Badge>
                        </td>
                        <td className="p-4 text-primary font-semibold">{team.score}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
