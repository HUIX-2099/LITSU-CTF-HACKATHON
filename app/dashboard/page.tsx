"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await refreshUser()
      setLoading(false)
    }
    load()
  }, [refreshUser])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight mb-6">Your Dashboard</h1>
        {!user ? (
          <Card className="p-6 bg-white border border-neutral-200">
            <div className="text-black/70">Please <Link href="/login" className="underline">login</Link> to view your dashboard.</div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border border-neutral-200">
              <div className="text-sm text-black/60">Username</div>
              <div className="text-xl font-bold">{user.username}</div>
              <div className="mt-2"><Badge>{user.role}</Badge></div>
            </Card>
            <Card className="p-6 bg-white border border-neutral-200">
              <div className="text-sm text-black/60">Score</div>
              <div className="text-3xl font-black text-primary">{user.score}</div>
            </Card>
            <Card className="p-6 bg-white border border-neutral-200">
              <div className="text-sm text-black/60">Solved Challenges</div>
              <div className="text-3xl font-black">{user.solvedChallenges?.length || 0}</div>
            </Card>
            <Card className="p-6 bg-white border border-neutral-200 md:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-black/60">Team</div>
                  <div className="text-xl font-bold">{user.teamId ? user.teamId : "Not in a team"}</div>
                </div>
                <div className="flex gap-2">
                  <Link href="/teams" className="underline">Go to Teams</Link>
                  <Link href="/settings" className="underline">Settings</Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


