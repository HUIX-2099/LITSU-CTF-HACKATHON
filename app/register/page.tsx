"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const result = await register(username, email, password)

    if (result.success) {
      router.push("/challenges")
    } else {
      setError(result.error || "Registration failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-12">
          <Link href="/" className="inline-block mb-8">
            <div className="font-black text-4xl tracking-tighter">
              <span className="text-white">CTF</span>
              <span className="text-primary">d</span>
            </div>
          </Link>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">Register</h1>
          <p className="text-white/60">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm uppercase tracking-wide font-bold">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="hacker123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm uppercase tracking-wide font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm uppercase tracking-wide font-bold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm uppercase tracking-wide font-bold">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-[#1e1e1e] border-2 border-white/20 h-12 font-mono"
            />
          </div>

          {error && (
            <div className="border-2 border-primary bg-primary/10 p-4">
              <p className="text-sm font-bold text-primary">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base uppercase tracking-wide font-black"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t-2 border-white/10">
          <p className="text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
