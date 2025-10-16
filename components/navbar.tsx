"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Shield, User, LogOut, Menu, Flag, Users, Trophy, Info } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "phone" | "vr">("desktop")

  useEffect(() => {
    let mounted = true
    const detect = async () => {
      try {
        // Basic VR detection via WebXR
        const xrSupported = typeof navigator !== "undefined" && (navigator as any).xr && typeof (navigator as any).xr.isSessionSupported === "function"
        if (xrSupported) {
          const supported = await (navigator as any).xr.isSessionSupported("immersive-vr").catch(() => false)
          if (mounted && supported) {
            setDeviceType("vr")
            return
          }
        }
      } catch {}

      if (typeof window !== "undefined") {
        const ua = navigator.userAgent || ""
        const isPhone = /Mobi|Android|iPhone|iPod/i.test(ua)
        const isTablet = /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI|SM-T\w+/i.test(ua)
        const prefersTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches
        const width = window.innerWidth
        if (isPhone || (prefersTouch && width < 768)) {
          setDeviceType("phone")
        } else if (isTablet || width < 1024) {
          setDeviceType("tablet")
        } else {
          setDeviceType("desktop")
        }
      }
    }

    detect()
    const onResize = () => detect()
    window.addEventListener("resize", onResize)
    return () => {
      mounted = false
      window.removeEventListener("resize", onResize)
    }
  }, [])

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

        {(deviceType === "phone" || deviceType === "tablet") && (
          <button
            className="p-2 rounded-md border border-[#e5e5e5]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {user ? (
          deviceType === "desktop" ? (
          <div className="flex items-center gap-8">
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
          ) : null
        ) : (
          deviceType === "desktop" ? (
          <div className="flex items-center gap-6">
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
          ) : null
        )}
      </div>
      {/* Mobile menu */}
      {open && (deviceType === "phone" || deviceType === "tablet") && (
        <div className="lg:hidden border-t border-[#e5e5e5] bg-white">
          <div className="container mx-auto py-2">
            <div className="divide-y divide-[#e5e5e5]">
              <Link href="/challenges" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm">Challenges</Link>
              <Link href="/scoreboard" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm">Scoreboard</Link>
              <Link href="/teams" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm">Teams</Link>
              <Link href="/about" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm">About</Link>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm">Admin</Link>
              )}
            </div>
            <div className="flex items-center justify-between pt-3 px-3">
              {user ? (
                <>
                  <div className="font-bold text-sm">{user.username} · {user.score} PTS</div>
                  <Button variant="outline" size="sm" className="modern-button-outline text-xs" onClick={() => { setOpen(false); logout() }}>
                    <LogOut className="h-3 w-3 mr-1" /> Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" onClick={() => setOpen(false)} className="block">
                    <Button variant="outline" size="sm" className="modern-button-outline text-xs px-4">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="block">
                    <Button size="sm" className="modern-button text-xs px-4">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      {(deviceType === "phone" || deviceType === "tablet") && (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e5e5] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-screen-md mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <Link href="/challenges" className="flex flex-col items-center justify-center py-1">
              <Flag className="h-5 w-5" />
              <span>Challenges</span>
            </Link>
            <Link href="/scoreboard" className="flex flex-col items-center justify-center py-1">
              <Trophy className="h-5 w-5" />
              <span>Scores</span>
            </Link>
            <Link href="/teams" className="flex flex-col items-center justify-center py-1">
              <Users className="h-5 w-5" />
              <span>Teams</span>
            </Link>
            <Link href="/about" className="flex flex-col items-center justify-center py-1">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </div>
          {user?.role === "admin" && (
            <div className="mt-2">
              <Link href="/admin" className="flex items-center justify-center gap-2 py-2 w-full border border-[#e5e5e5] bg-white">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold">Admin</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      )}
    </nav>
  )
}

