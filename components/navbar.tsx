"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Shield, User, LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="modern-nav bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/litsu-logo.jpg" alt="LITSU" width={40} height={40} className="rounded" />
          <div>
            <div className="modern-h3 text-lg">LITSU</div>
            <div className="modern-caption">CTF Platform</div>
          </div>
        </Link>

        <button
          className="lg:hidden p-2 rounded-md border border-[#e5e5e5]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {user ? (
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link href="/challenges" className="modern-nav-link">
                Challenges
              </Link>
              <Link href="/scoreboard" className="modern-nav-link">
                Scoreboard
              </Link>
              <Link href="/teams" className="modern-nav-link">
                Teams
              </Link>
              <Link href="/about" className="modern-nav-link">
                About
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="modern-nav-link">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-[#e5e5e5]">
              <div className="text-right">
                <div className="font-bold text-sm uppercase tracking-wide">{user.username}</div>
                <div className="modern-caption">{user.score} PTS</div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="modern-button-outline text-xs px-4 py-2"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/about" className="modern-nav-link">
              About
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="modern-button-outline text-xs px-4 py-2">
                  <User className="h-3 w-3 mr-1" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="modern-button text-xs px-4 py-2">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[#e5e5e5] bg-white">
          <div className="container mx-auto py-3 space-y-2">
            <div className="flex flex-wrap gap-4">
              <Link href="/challenges" className="modern-nav-link" onClick={() => setOpen(false)}>Challenges</Link>
              <Link href="/scoreboard" className="modern-nav-link" onClick={() => setOpen(false)}>Scoreboard</Link>
              <Link href="/teams" className="modern-nav-link" onClick={() => setOpen(false)}>Teams</Link>
              <Link href="/about" className="modern-nav-link" onClick={() => setOpen(false)}>About</Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="modern-nav-link" onClick={() => setOpen(false)}>Admin</Link>
              )}
            </div>
            <div className="flex items-center justify-between pt-2">
              {user ? (
                <>
                  <div className="font-bold text-sm">{user.username} · {user.score} PTS</div>
                  <Button variant="outline" size="sm" className="modern-button-outline text-xs" onClick={() => { setOpen(false); logout() }}>
                    <LogOut className="h-3 w-3 mr-1" /> Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="modern-button-outline text-xs">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button size="sm" className="modern-button text-xs">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

