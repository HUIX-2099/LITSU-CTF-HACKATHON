"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b-2 border-white/10 bg-[#191919] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/litsu-logo.jpg" alt="LITSU" width={60} height={60} className="rounded-full" />
          <div className="hidden sm:block">
            <div className="font-black text-xl tracking-tighter leading-tight">
              <span className="text-white">LITSU</span>
            </div>
            <div className="text-[10px] text-white/60 font-mono uppercase tracking-wider">CTF Hackathon</div>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/challenges"
              className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
            >
              Challenges
            </Link>
            <Link
              href="/scoreboard"
              className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
            >
              Scoreboard
            </Link>
            <Link
              href="/teams"
              className="hidden sm:inline text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
            >
              Teams
            </Link>
            <Link
              href="/about"
              className="hidden md:inline text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
            >
              About
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
              >
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-4 pl-2 md:pl-4 border-l-2 border-white/10">
              <div className="text-xs md:text-sm">
                <div className="font-bold uppercase tracking-wide">{user.username}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground font-mono">{user.score} PTS</div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="uppercase tracking-wide font-bold bg-transparent text-xs"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/about"
              className="hidden sm:inline text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
            >
              About
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/admin/login">
                <Button variant="ghost" className="uppercase tracking-wide font-bold text-xs md:text-sm">
                  Admin
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="uppercase tracking-wide font-bold text-xs md:text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="uppercase tracking-wide font-bold text-xs md:text-sm">Register</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
