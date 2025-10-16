"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [county, setCounty] = useState(user?.county || "") as any
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, county, password: password || undefined }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed to save")
      await refreshUser()
      setPassword("")
      setMessage("Saved")
    } catch (err) {
      setMessage("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight mb-6">Settings</h1>
        {!user ? (
          <Card className="p-6 bg-white border border-neutral-200">Login to edit your settings.</Card>
        ) : (
          <Card className="p-6 bg-white border border-neutral-200">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={save}>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>County</Label>
                <Input value={county as string} onChange={(e) => setCounty(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                {message && <span className="text-sm text-black/60">{message}</span>}
              </div>
            </form>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}


