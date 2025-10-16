"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl font-black tracking-tight">Admin login removed</h1>
        <p className="text-black/70">Admins and users now share the same login.</p>
        <div>
          <Link href="/login" className="modern-nav-link">Go to Login</Link>
        </div>
      </div>
    </div>
  )
}
