"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, Database, Shield, Bell, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    platformName: "LITSU CTF Platform",
    platformDescription: "Liberia Information Technology Students Union CTF Hackathon",
    maxTeamSize: "5",
    registrationEnabled: true,
    emailNotifications: true,
    maintenanceMode: false,
    allowTeamCreation: true,
    maxChallengesPerUser: "unlimited",
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
  }, [user, router])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Settings saved successfully!")
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              Platform Settings
            </h1>
            <p className="text-white/60 text-sm md:text-base">Configure your CTF platform</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="uppercase font-bold">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-tight">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platformName" className="text-white/80 uppercase text-xs font-bold mb-2 block">
                  Platform Name
                </Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="bg-[#0f0f0f] border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="platformDesc" className="text-white/80 uppercase text-xs font-bold mb-2 block">
                  Platform Description
                </Label>
                <Input
                  id="platformDesc"
                  value={settings.platformDescription}
                  onChange={(e) => setSettings({ ...settings, platformDescription: e.target.value })}
                  className="bg-[#0f0f0f] border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="maxTeamSize" className="text-white/80 uppercase text-xs font-bold mb-2 block">
                  Max Team Size
                </Label>
                <Input
                  id="maxTeamSize"
                  type="number"
                  value={settings.maxTeamSize}
                  onChange={(e) => setSettings({ ...settings, maxTeamSize: e.target.value })}
                  className="bg-[#0f0f0f] border-white/20 text-white"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-tight">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div>
                  <div className="font-bold text-white uppercase text-sm">Registration</div>
                  <div className="text-xs text-white/60 mt-1">Allow new user registration</div>
                </div>
                <Badge
                  className={
                    settings.registrationEnabled
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {settings.registrationEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div>
                  <div className="font-bold text-white uppercase text-sm">Team Creation</div>
                  <div className="text-xs text-white/60 mt-1">Allow users to create teams</div>
                </div>
                <Badge
                  className={
                    settings.allowTeamCreation
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {settings.allowTeamCreation ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div>
                  <div className="font-bold text-white uppercase text-sm">Maintenance Mode</div>
                  <div className="text-xs text-white/60 mt-1">Platform maintenance status</div>
                </div>
                <Badge
                  className={
                    settings.maintenanceMode
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-green-500/10 text-green-500 border-green-500/20"
                  }
                >
                  {settings.maintenanceMode ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-tight">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div>
                  <div className="font-bold text-white uppercase text-sm">Email Notifications</div>
                  <div className="text-xs text-white/60 mt-1">Send email notifications to users</div>
                </div>
                <Badge
                  className={
                    settings.emailNotifications
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }
                >
                  {settings.emailNotifications ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div>
                <Label htmlFor="adminEmail" className="text-white/80 uppercase text-xs font-bold mb-2 block">
                  Admin Email
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@litsu.org"
                  className="bg-[#0f0f0f] border-white/20 text-white"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1e1e1e] border-2 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-tight">Database Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div>
                  <div className="font-bold text-white uppercase text-sm">Database Status</div>
                  <div className="text-xs text-white/60 mt-1">Connection status</div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
              </div>
              <div className="p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                <div className="font-bold text-white uppercase text-sm mb-2">Storage Info</div>
                <div className="space-y-2 text-xs text-white/60 font-mono">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="text-primary">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Teams:</span>
                    <span className="text-primary">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Challenges:</span>
                    <span className="text-primary">3</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full uppercase font-bold bg-transparent">
                <Database className="h-4 w-4 mr-2" />
                Backup Database
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
