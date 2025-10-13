"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await loginAction(email, password)

      if (result.success && result.user) {
        if (result.user.role !== "admin") {
          setError("Access denied. Admin credentials required.")
          setLoading(false)
          return
        }
        router.push("/admin")
        router.refresh()
      } else {
        setError(result.error || "Invalid admin credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/litsu-logo.jpg" alt="LITSU" width={120} height={120} className="rounded-lg" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Admin Access</h1>
          </div>
          <p className="text-white/60 uppercase tracking-wide text-sm font-bold">LITSU CTF Platform Administration</p>
        </div>

        <Card className="p-8 bg-[#0f0f0f] border-2 border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border-2 border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide text-white/80">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@litsu.org"
                  required
                  className="pl-10 bg-[#1e1e1e] border-2 border-white/20 h-12 text-white placeholder:text-white/40 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide text-white/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-[#1e1e1e] border-2 border-white/20 h-12 text-white placeholder:text-white/40 font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wide text-sm"
            >
              {loading ? "Authenticating..." : "Admin Login"}
            </Button>

            <div className="text-center pt-4 border-t-2 border-white/10">
              <p className="text-sm text-white/60">
                Regular user?{" "}
                <Link href="/login" className="text-primary hover:underline font-bold">
                  User Login
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-white/60 font-mono text-center">Demo: admin@ctfd.io / admin123</p>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors uppercase tracking-wide">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
