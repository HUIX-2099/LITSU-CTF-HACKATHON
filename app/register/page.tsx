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
import { TerminalSquare, Mail, Lock, ArrowLeft, AlertTriangle } from "lucide-react"

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
    <div className="min-h-screen bg-[#f7fafc] text-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-lg border border-[#e5e7eb] bg-white shadow-sm">
        {/* Terminal title bar */}
        <div className="px-4 py-2 border-b border-[#e5e7eb] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]"></span>
            <span className="h-3 w-3 rounded-full bg-[#f59e0b]"></span>
            <span className="h-3 w-3 rounded-full bg-[#22c55e]"></span>
          </div>
          <div className="flex items-center gap-2 text-[#334155]">
            <TerminalSquare className="h-4 w-4" />
            <span className="font-mono text-xs">auth@litsu:~$ register</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono">
          {error && (
            <div className="flex items-center gap-2 text-[#b91c1c]">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <label className="block text-[11px] uppercase tracking-wider text-[#64748b]">username</label>
          <Input
            id="username"
            type="text"
            placeholder="hacker123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white text-[#0a0a0a] border-[#e5e7eb] placeholder-[#94a3b8]"
          />

          <label className="block text-[11px] uppercase tracking-wider text-[#64748b] mt-4">email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white text-[#0a0a0a] border-[#e5e7eb] placeholder-[#94a3b8] pl-10"
            />
          </div>

          <label className="block text-[11px] uppercase tracking-wider text-[#64748b] mt-4">password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white text-[#0a0a0a] border-[#e5e7eb] placeholder-[#94a3b8] pl-10"
            />
          </div>

          <label className="block text-[11px] uppercase tracking-wider text-[#64748b] mt-4">confirm password</label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white text-[#0a0a0a] border-[#e5e7eb] placeholder-[#94a3b8]"
          />

          <Button type="submit" disabled={isLoading} className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold">
            {isLoading ? "creating..." : "register"}
          </Button>

          <div className="text-xs text-[#64748b] pt-2">
            <span>have an account? </span>
            <Link href="/login" className="underline">login</Link>
          </div>
        </form>
        <div className="px-6 py-3 border-t border-[#e5e7eb] text-xs text-[#64748b] flex items-center gap-2">
          <ArrowLeft className="h-3 w-3" />
          <Link href="/" className="underline">back</Link>
        </div>
      </div>
    </div>
  )
}
