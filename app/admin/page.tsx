"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  UsersRound,
  Camera,
  X,
  Save,
  RefreshCw,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { deleteChallengeAction } from "@/lib/actions/challenges"
import { updateUserAction, deleteUserAction } from "@/lib/actions/users"
import { updateTeamAction, deleteTeamAction } from "@/lib/actions/teams"
import { getAllSubmissionsAction } from "@/lib/actions/scoreboard"
import type { DBChallenge, User, Team, Submission } from "@/lib/db"
import { AdminChallengeForm } from "@/components/admin-challenge-form"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "traffic" | "challenges" | "users" | "teams" | "scoreboard">("overview")
  const [challenges, setChallenges] = useState<DBChallenge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [showChallengeForm, setShowChallengeForm] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<DBChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all")
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [teamImage, setTeamImage] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)

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
      const [chRes, usRes, tmRes, subRes] = await Promise.all([
        fetch("/api/admin/challenges", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/admin/teams", { cache: "no-store" }),
        getAllSubmissionsAction(),
      ])

      const [chJson, usJson, tmJson] = await Promise.all([chRes.json(), usRes.json(), tmRes.json()])

      if (chJson?.success && chJson.challenges) setChallenges(chJson.challenges as DBChallenge[])
      if (usJson?.success && usJson.users) setUsers(usJson.users as User[])
      if (tmJson?.success && tmJson.teams) setTeams(tmJson.teams as Team[])
      if ((subRes as any)?.success && (subRes as any).submissions) setSubmissions((subRes as any).submissions)
    } catch (error) {
      console.error("[v0] Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return

    try {
      const res = await deleteChallengeAction(id)
      if (!res.success) throw new Error("delete failed")
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

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const res = await deleteUserAction(id)
      if (!res.success) throw new Error("delete failed")
      await loadData()
    } catch (error) {
      console.error("[v0] Failed to delete user:", error)
      alert("Failed to delete user")
    }
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setShowTeamForm(true)
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return

    try {
      const res = await deleteTeamAction(id)
      if (!res.success) throw new Error("delete failed")
      await loadData()
    } catch (error) {
      console.error("[v0] Failed to delete team:", error)
      alert("Failed to delete team")
    }
  }

  const handleUserFormClose = () => {
    setShowUserForm(false)
    setEditingUser(null)
    setUserImage(null)
    loadData()
  }

  const handleTeamFormClose = () => {
    setShowTeamForm(false)
    setEditingTeam(null)
    setTeamImage(null)
    loadData()
  }

  const handleImageUpload = (file: File, type: "user" | "team") => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === "user") {
        setUserImage(result)
      } else {
        setTeamImage(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || u.role === filterRole
    return matchesSearch && matchesRole
  })

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === "all" || c.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const filteredTeams = teams.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.inviteCode.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (!user || user.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-xl font-bold">Loading admin panel...</div>
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
    activeUsers: users.filter((u) => new Date(u.lastSeen).toDateString() === new Date().toDateString()).length,
    submissionsToday: submissions.filter((s) => new Date(s.timestamp).toDateString() === new Date().toDateString()).length,
  }

  const activityLog = submissions
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)
    .map((s, idx) => {
      const u = users.find((x) => x.id === s.userId)
      const c = challenges.find((x) => x.id === s.challengeId)
      return {
        id: idx + 1,
        type: s.correct ? "solve" : "submit",
        user: u?.username || s.userId,
        action: s.correct ? "solved" : "submitted",
        target: c?.title || s.challengeId,
        time: new Date(s.timestamp).toLocaleTimeString(),
      }
    })

  return (
    <div className="modern-page">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-10 w-10 text-[#1a1a1a]" />
          <div>
              <h1 className="modern-h2 text-4xl">Admin Dashboard</h1>
              <div className="modern-label">Platform Administration</div>
          </div>
          </div>
          <div className="modern-section max-w-md">
            <div className="modern-label mb-2">Welcome back</div>
            <div className="font-bold text-lg">{user?.username}</div>
          </div>
        </div>

        <div className="modern-grid-4 mb-12">
          <div className="modern-section">
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-8 w-8 text-[#1a1a1a]" />
              <div className="modern-label">Users</div>
            </div>
            <div className="modern-number text-4xl mb-2">{stats.totalUsers}</div>
            <div className="modern-data">{stats.activeUsers} active today</div>
          </div>

          <div className="modern-section">
            <div className="flex items-center gap-4 mb-6">
              <Flag className="h-8 w-8 text-[#1a1a1a]" />
              <div className="modern-label">Challenges</div>
            </div>
            <div className="modern-number text-4xl mb-2">{stats.totalChallenges}</div>
            <div className="modern-data">{stats.activeSolves} total solves</div>
          </div>

          <div className="modern-section">
            <div className="flex items-center gap-4 mb-6">
              <UsersRound className="h-8 w-8 text-[#1a1a1a]" />
              <div className="modern-label">Teams</div>
            </div>
            <div className="modern-number text-4xl mb-2">{stats.totalTeams}</div>
            <div className="modern-data">{stats.submissionsToday} submissions today</div>
          </div>

          <div className="modern-section">
            <div className="flex items-center gap-4 mb-6">
              <Database className="h-8 w-8 text-[#1a1a1a]" />
              <div className="modern-label">Storage</div>
            </div>
            <div className="modern-number text-4xl mb-2">{stats.storageUsed}</div>
            <div className="modern-data">of {stats.storageTotal}</div>
            <div className="mt-4">
              <div className="h-2 bg-[#e5e5e5] overflow-hidden">
                <div className="h-full bg-[#1a1a1a]" style={{ width: `${stats.storagePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="vibe-card p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Backend</span>
                <Badge className="bg-white text-black border border-neutral-200 uppercase font-bold">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Database</span>
                <Badge className="bg-white text-black border border-neutral-200 uppercase font-bold">
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">API</span>
                <Badge className="bg-white text-black border border-neutral-200 uppercase font-bold">
                  Healthy
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="vibe-card p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">Platform Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Version</span>
                <span className="text-sm font-mono">v2.0.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Uptime</span>
                <span className="text-sm font-mono">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Region</span>
                <span className="text-sm font-mono">Liberia</span>
              </div>
            </div>
          </Card>

          <Card className="vibe-card p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tight">Quick Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Avg Score</span>
                <span className="text-sm font-mono font-bold">
                  {Math.floor(users.reduce((acc, e) => acc + e.score, 0) / users.length || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Top Score</span>
                <span className="text-sm font-mono font-bold">
                  {users.reduce((max, u) => Math.max(max, u.score), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Completion</span>
                <span className="text-sm font-mono font-bold">
                  {Math.floor((stats.activeSolves / (stats.totalChallenges * stats.totalUsers)) * 100) || 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-1 mb-12 border-b border-[#e5e5e5] overflow-x-auto">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "traffic" ? "default" : "ghost"}
            onClick={() => setActiveTab("traffic")}
            className={activeTab === "traffic" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <Wifi className="h-4 w-4 mr-2" />
            Traffic
          </Button>
          <Button
            variant={activeTab === "challenges" ? "default" : "ghost"}
            onClick={() => setActiveTab("challenges")}
            className={activeTab === "challenges" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <Flag className="h-4 w-4 mr-2" />
            Challenges
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === "teams" ? "default" : "ghost"}
            onClick={() => setActiveTab("teams")}
            className={activeTab === "teams" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <UsersRound className="h-4 w-4 mr-2" />
            Teams
          </Button>
          <Button
            variant={activeTab === "scoreboard" ? "default" : "ghost"}
            onClick={() => setActiveTab("scoreboard")}
            className={activeTab === "scoreboard" ? "modern-nav-link-active" : "modern-nav-link"}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Scoreboard
          </Button>
        </div>

        {activeTab === "traffic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="vibe-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="h-8 w-8 text-primary" />
                  <TrendingUp className="h-4 w-4 text-black" />
                </div>
                <div className="text-3xl font-black mb-1">{trafficData.currentUsers}</div>
                <div className="text-xs text-black/60 uppercase tracking-wide font-bold">Current Users</div>
                <div className="text-xs text-black mt-2 font-mono">+12% from last hour</div>
              </Card>

              <Card className="vibe-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 text-primary" />
                  <Zap className="h-4 w-4 text-black" />
                </div>
                <div className="text-3xl font-black mb-1">{trafficData.requestsPerMin}</div>
                <div className="text-xs text-black/60 uppercase tracking-wide font-bold">Requests/Min</div>
                <div className="text-xs text-black mt-2 font-mono">Real-time</div>
              </Card>

              <Card className="vibe-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <CheckCircle className="h-4 w-4 text-black" />
                </div>
                <div className="text-3xl font-black mb-1">{trafficData.avgResponseTime}ms</div>
                <div className="text-xs text-black/60 uppercase tracking-wide font-bold">Avg Response</div>
                <div className="text-xs text-black mt-2 font-mono">Excellent</div>
              </Card>

              <Card className="vibe-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <Database className="h-8 w-8 text-primary" />
                  <TrendingUp className="h-4 w-4 text-black" />
                </div>
                <div className="text-3xl font-black mb-1">{trafficData.bandwidth}</div>
                <div className="text-xs text-black/60 uppercase tracking-wide font-bold">Bandwidth</div>
                <div className="text-xs text-black mt-2 font-mono">Current usage</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="vibe-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Load Balancer Stats</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-black/60 uppercase tracking-wide font-bold">
                        Server 1 (Primary)
                      </span>
                      <Badge className="bg-white text-black border border-neutral-200">Active</Badge>
                    </div>
                    <div className="h-2 bg-black/10 overflow-hidden">
                      <div className="h-full bg-black" style={{ width: "65%" }} />
                    </div>
                    <div className="text-xs text-black/40 mt-1 font-mono">CPU: 65% | RAM: 4.2GB/8GB</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Server 2 (Backup)</span>
                      <Badge className="bg-white text-black border border-neutral-200">Active</Badge>
                    </div>
                    <div className="h-2 bg-black/10 overflow-hidden">
                      <div className="h-full bg-black" style={{ width: "42%" }} />
                    </div>
                    <div className="text-xs text-black/40 mt-1 font-mono">CPU: 42% | RAM: 3.1GB/8GB</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-black/60 uppercase tracking-wide font-bold">Database Server</span>
                      <Badge className="bg-white text-black border border-neutral-200">Healthy</Badge>
                    </div>
                    <div className="h-2 bg-black/10 overflow-hidden">
                      <div className="h-full bg-black" style={{ width: "28%" }} />
                    </div>
                    <div className="text-xs text-black/40 mt-1 font-mono">CPU: 28% | RAM: 2.8GB/16GB</div>
                  </div>
                </div>
              </Card>

              <Card className="vibe-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Activity Log</h3>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {activityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-white border border-neutral-200"
                    >
                      <div className="h-8 w-8 bg-black/5 flex items-center justify-center flex-shrink-0">
                        {activity.type === "solve" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {activity.type === "team" && <Users className="h-4 w-4 text-black" />}
                        {activity.type === "login" && <Shield className="h-4 w-4 text-black" />}
                        {activity.type === "register" && <Plus className="h-4 w-4 text-black" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-bold">{activity.user}</span>
                          <span className="text-black/60"> {activity.action} </span>
                          <span className="font-medium">{activity.target}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-black/40 font-mono">{activity.ip}</span>
                          <span className="text-xs text-black/40">•</span>
                          <span className="text-xs text-black/40">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="vibe-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black uppercase tracking-tight">System Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border border-neutral-200">
                  <CheckCircle className="h-5 w-5 text-black flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold">All Systems Operational</div>
                    <div className="text-xs text-black/60 mt-1">No issues detected. Platform running smoothly.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card className="vibe-card p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 uppercase tracking-tight">Recent Activity</h3>
              <div className="space-y-3">
                {activityLog.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-neutral-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-black/5 flex items-center justify-center">
                        <span className="text-xs font-semibold">{activity.user[0].toUpperCase()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-black/60"> {activity.action} </span>
                        <span className="font-medium">{activity.target}</span>
                      </div>
                    </div>
                    <span className="text-xs text-black/60">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="vibe-card p-4 md:p-6">
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-tight">Top Performers</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black/60">#{user.rank}</span>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <span className="font-bold">{user.score}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="vibe-card p-4 md:p-6">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Challenges</h3>
              <div className="flex gap-2">
              <Button onClick={() => setShowChallengeForm(true)} className="uppercase font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Challenge
              </Button>
                <Button variant="outline" onClick={loadData} className="uppercase font-bold">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
              </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-2 border-black/20"
                  />
                </div>
              </div>
              <Select value={filterDifficulty} onValueChange={(value: "all" | "easy" | "medium" | "hard") => setFilterDifficulty(value)}>
                <SelectTrigger className="w-48 bg-white border-2 border-black/20">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showChallengeForm && (
              <AdminChallengeForm
                open={showChallengeForm}
                challenge={editingChallenge}
                onClose={handleChallengeFormClose}
                onSuccess={loadData}
              />
            )}

            <Card className="overflow-hidden vibe-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Title</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Category</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Difficulty</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Points</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Solves</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Views</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChallenges.map((challenge) => (
                      <tr key={challenge.id} className="border-b border-neutral-200 hover:bg-black/5 transition-colors">
                        <td className="p-4 font-medium">{challenge.title}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="uppercase">
                            {challenge.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`uppercase ${
                              challenge.difficulty === 'easy' ? 'text-green-600 border-green-600' :
                              challenge.difficulty === 'medium' ? 'text-yellow-600 border-yellow-600' :
                              'text-red-600 border-red-600'
                            }`}
                          >
                            {challenge.difficulty}
                          </Badge>
                        </td>
                        <td className="p-4 text-black font-semibold">{challenge.points}</td>
                        <td className="p-4 text-black/60">{challenge.solves}</td>
                        <td className="p-4 text-black/60">{challenge.views || 0}</td>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Users</h3>
              <div className="flex gap-2">
                <Button onClick={() => setShowUserForm(true)} className="uppercase font-bold">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
                <Button variant="outline" onClick={loadData} className="uppercase font-bold">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
              </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-2 border-black/20"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={(value: "all" | "admin" | "user") => setFilterRole(value)}>
                <SelectTrigger className="w-48 bg-white border-2 border-black/20">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="overflow-hidden vibe-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">User</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Email</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Role</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Score</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Solves</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Status</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-neutral-200 hover:bg-black/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={userImage || `/placeholder-user.jpg`} />
                              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                                {u.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{u.username}</div>
                              <div className="text-xs text-black/60">{u.county || 'No County'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-black/60 font-mono text-sm">{u.email}</td>
                        <td className="p-4">
                          <Badge variant={u.role === "admin" ? "default" : "outline"} className="uppercase">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-black font-semibold">{u.score}</td>
                        <td className="p-4 text-black/60">{u.solvedChallenges.length}</td>
                        <td className="p-4">
                          <Badge variant={u.isOnline ? "default" : "outline"} className="uppercase">
                            {u.isOnline ? "Online" : "Offline"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(u)
                                setShowUserModal(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditUser(u)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}>
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

        {activeTab === "teams" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Manage Teams</h3>
              <div className="flex gap-2">
                <Button onClick={() => setShowTeamForm(true)} className="uppercase font-bold">
                  <UsersRound className="h-4 w-4 mr-2" />
                  Add Team
                </Button>
                <Button variant="outline" onClick={loadData} className="uppercase font-bold">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
              </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-2 border-black/20"
                  />
                </div>
              </div>
            </div>

            <Card className="overflow-hidden vibe-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Team</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Invite Code</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Members</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Score</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">County</th>
                      <th className="text-left p-4 font-semibold uppercase text-xs tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.map((team) => (
                      <tr key={team.id} className="border-b border-neutral-200 hover:bg-black/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={teamImage || `/placeholder-logo.jpg`} />
                              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                                {team.name[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{team.name}</div>
                              <div className="text-xs text-black/60">Created {new Date(team.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-black/60 font-mono text-sm">{team.inviteCode}</td>
                        <td className="p-4 text-black/60">{team.members.length}</td>
                        <td className="p-4 text-black font-semibold">{team.score}</td>
                        <td className="p-4 text-black/60">{team.county || 'No County'}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTeam(team)
                                setShowTeamModal(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditTeam(team)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTeam(team.id)}>
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

        {activeTab === "scoreboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold uppercase tracking-tight">Live Scoreboard</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} className="uppercase font-bold">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" className="uppercase font-bold">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="vibe-card p-6">
                <h4 className="text-lg font-bold uppercase tracking-tight mb-4">Individual Rankings</h4>
                <div className="space-y-3">
                  {users
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-neutral-200">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-white font-bold text-sm rounded-full">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={userImage || `/placeholder-user.jpg`} />
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-black/60">{user.county || 'No County'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{user.score}</div>
                          <div className="text-xs text-black/60">{user.solvedChallenges.length} solves</div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="vibe-card p-6">
                <h4 className="text-lg font-bold uppercase tracking-tight mb-4">Team Rankings</h4>
                <div className="space-y-3">
                  {teams
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
                    .map((team, index) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-white border border-neutral-200">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-white font-bold text-sm rounded-full">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={teamImage || `/placeholder-logo.jpg`} />
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {team.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-black/60">{team.members.length} members</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{team.score}</div>
                          <div className="text-xs text-black/60">{team.county || 'No County'}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>

            <Card className="vibe-card p-6">
              <h4 className="text-lg font-bold uppercase tracking-tight mb-4">Challenge Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challenges
                  .sort((a, b) => b.solves - a.solves)
                  .slice(0, 6)
                  .map((challenge) => (
                    <div key={challenge.id} className="p-4 bg-white border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{challenge.title}</h5>
                        <Badge 
                          variant="outline" 
                          className={`uppercase text-xs ${
                            challenge.difficulty === 'easy' ? 'text-green-600 border-green-600' :
                            challenge.difficulty === 'medium' ? 'text-yellow-600 border-yellow-600' :
                            'text-red-600 border-red-600'
                          }`}
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary">{challenge.solves}</div>
                      <div className="text-xs text-black/60">solves</div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowUserModal(false)} />
          <div className="relative vibe-card w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">User Details</h2>
              <Button variant="outline" size="sm" onClick={() => setShowUserModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userImage || `/placeholder-user.jpg`} />
                  <AvatarFallback className="bg-primary text-white text-lg font-bold">
                    {selectedUser.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.username}</h3>
                  <p className="text-sm text-black/60">{selectedUser.email}</p>
                  <Badge variant={selectedUser.role === "admin" ? "default" : "outline"} className="uppercase mt-1">
                    {selectedUser.role}
                  </Badge>
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-neutral-200">
                  <div className="text-xs uppercase tracking-wide text-black/50">Score</div>
                  <div className="text-2xl font-bold text-primary">{selectedUser.score}</div>
                </div>
                <div className="p-3 bg-white border border-neutral-200">
                  <div className="text-xs uppercase tracking-wide text-black/50">Solves</div>
                  <div className="text-2xl font-bold text-primary">{selectedUser.solvedChallenges.length}</div>
                </div>
              </div>
              <div className="space-y-2">
              <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">County</span>
                  <span className="text-sm">{selectedUser.county || 'No County'}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">Status</span>
                  <Badge variant={selectedUser.isOnline ? "default" : "outline"} className="uppercase">
                    {selectedUser.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">Last Seen</span>
                  <span className="text-sm">{new Date(selectedUser.lastSeen).toLocaleString()}</span>
              </div>
              {selectedUser.teamId && (
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">Team</span>
                    <span className="text-sm">{selectedUser.teamId}</span>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTeamModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowTeamModal(false)} />
          <div className="relative vibe-card w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">Team Details</h2>
              <Button variant="outline" size="sm" onClick={() => setShowTeamModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={teamImage || `/placeholder-logo.jpg`} />
                  <AvatarFallback className="bg-primary text-white text-lg font-bold">
                    {selectedTeam.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedTeam.name}</h3>
                  <p className="text-sm text-black/60 font-mono">{selectedTeam.inviteCode}</p>
                  <div className="text-xs text-black/60 mt-1">
                    Created {new Date(selectedTeam.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-neutral-200">
                  <div className="text-xs uppercase tracking-wide text-black/50">Score</div>
                  <div className="text-2xl font-bold text-primary">{selectedTeam.score}</div>
                </div>
                <div className="p-3 bg-white border border-neutral-200">
                  <div className="text-xs uppercase tracking-wide text-black/50">Members</div>
                  <div className="text-2xl font-bold text-primary">{selectedTeam.members.length}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">County</span>
                  <span className="text-sm">{selectedTeam.county || 'No County'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wide text-black/50">Status</span>
                  <Badge variant={selectedTeam.isOnline ? "default" : "outline"} className="uppercase">
                    {selectedTeam.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserForm && (
        <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
          <DialogContent className="max-w-2xl bg-white text-black border-2 border-black/20 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-black">
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                const payload: any = {
                  username: String(formData.get("username") || ""),
                  email: String(formData.get("email") || ""),
                  password: String(formData.get("password") || ""),
                  role: String(formData.get("role") || "user"),
                  county: String(formData.get("county") || ""),
                  score: Number(formData.get("score") || 0),
                }
                try {
                  if (editingUser) {
                    delete payload.password
                    await fetch(`/api/admin/users/${editingUser.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    })
                  } else {
                    await fetch(`/api/admin/users`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    })
                  }
                  handleUserFormClose()
                  await loadData()
                } catch (err) {
                  console.error("Failed to save user", err)
                }
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userImage || `/placeholder-user.jpg`} />
                  <AvatarFallback className="bg-primary text-white text-lg font-bold">
                    {editingUser?.username[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label className="text-sm font-bold uppercase tracking-wide">Profile Image</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, "user")
                      }}
                      className="hidden"
                      id="user-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("user-image-upload")?.click()}
                      className="text-xs"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    {userImage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUserImage(null)}
                        className="text-xs"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Username</Label>
                  <Input
                    name="username"
                    defaultValue={editingUser?.username || ""}
                    className="bg-white border-2 border-black/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={editingUser?.email || ""}
                    className="bg-white border-2 border-black/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Role</Label>
                  <Select name="role" defaultValue={editingUser?.role || "user"}>
                    <SelectTrigger className="bg-white border-2 border-black/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">County</Label>
                  <Select name="county" defaultValue={editingUser?.county || ""}>
                    <SelectTrigger className="bg-white border-2 border-black/20">
                      <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="montserrado">Montserrado</SelectItem>
                      <SelectItem value="bomi">Bomi</SelectItem>
                      <SelectItem value="lolphim">Lolphim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Score</Label>
                  <Input
                    name="score"
                    type="number"
                    defaultValue={editingUser?.score || 0}
                    className="bg-white border-2 border-black/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Password</Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                    className="bg-white border-2 border-black/20"
                    required={!editingUser}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 font-bold uppercase">
                  <Save className="h-4 w-4 mr-2" />
                  {editingUser ? "Update User" : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={handleUserFormClose} className="font-bold uppercase bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {showTeamForm && (
        <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
          <DialogContent className="max-w-2xl bg-white text-black border-2 border-black/20 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-black">
                {editingTeam ? "Edit Team" : "Add New Team"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={teamImage || `/placeholder-logo.jpg`} />
                  <AvatarFallback className="bg-primary text-white text-lg font-bold">
                    {editingTeam?.name[0]?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label className="text-sm font-bold uppercase tracking-wide">Team Logo</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, "team")
                      }}
                      className="hidden"
                      id="team-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("team-image-upload")?.click()}
                      className="text-xs"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    {teamImage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTeamImage(null)}
                        className="text-xs"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wide">Team Name</Label>
                <Input
                  defaultValue={editingTeam?.name || ""}
                  className="bg-white border-2 border-black/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">County</Label>
                  <Select defaultValue={editingTeam?.county || ""}>
                    <SelectTrigger className="bg-white border-2 border-black/20">
                      <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="montserrado">Montserrado</SelectItem>
                      <SelectItem value="bomi">Bomi</SelectItem>
                      <SelectItem value="lolphim">Lolphim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Score</Label>
                  <Input
                    type="number"
                    defaultValue={editingTeam?.score || 0}
                    className="bg-white border-2 border-black/20"
                  />
                </div>
              </div>

              {editingTeam && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Invite Code</Label>
                  <Input
                    value={editingTeam.inviteCode}
                    className="bg-white border-2 border-black/20 font-mono"
                    readOnly
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 font-bold uppercase">
                  <Save className="h-4 w-4 mr-2" />
                  {editingTeam ? "Update Team" : "Create Team"}
                </Button>
                <Button type="button" variant="outline" onClick={handleTeamFormClose} className="font-bold uppercase bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
