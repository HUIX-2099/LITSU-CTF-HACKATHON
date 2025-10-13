"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      if (result.user?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/challenges")
      }
    } else {
      setError(result.error || "Invalid credentials")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/litsu-logo.jpg" alt="LITSU" width={120} height={120} className="rounded-lg" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">User Login</h1>
          </div>
          <p className="text-white/60 uppercase tracking-wide text-sm font-bold">LITSU CTF Hackathon Platform</p>
        </div>

        <div className="bg-[#0f0f0f] border-2 border-white/20 p-6 md:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm uppercase tracking-wide font-bold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm uppercase tracking-wide font-bold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="border-2 border-primary bg-primary/10 p-4 rounded-lg">
                <p className="text-sm font-bold text-primary">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base uppercase tracking-wide font-black"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-white/10 space-y-4">
            <p className="text-sm text-white/60 text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-bold">
                Register here
              </Link>
            </p>
            <p className="text-sm text-white/60 text-center">
              Admin user?{" "}
              <Link href="/admin/login" className="text-primary hover:underline font-bold">
                Admin Login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors uppercase tracking-wide">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
