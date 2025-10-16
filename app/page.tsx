import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Users, Flag, Trophy, Code, BookOpen, Settings, ArrowRight } from "lucide-react"
import { getAllChallenges, getAllUsers, getAllTeams } from "@/lib/db"

export default async function Home() {
  const [challenges, users, teams] = await Promise.all([
    getAllChallenges(),
    getAllUsers(),
    getAllTeams(),
  ])
  const totalSolves = challenges.reduce((sum, c) => sum + (c.solves || 0), 0)
  const year = new Date().getFullYear()
  return (
    <div className="modern-page">
      <Navbar />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Image src="/litsu-logo.jpg" alt="LITSU" width={80} height={80} className="rounded-lg" />
                <div>
                  <div className="modern-label">Official CTF Platform</div>
                  <div className="modern-h3">Liberia Information Technology Students Union</div>
                </div>
              </div>

              <h1 className="modern-h1 mb-8">
                <span className="block">LITSU</span>
                <span className="block">CTF HACKATHON</span>
              </h1>

              <div className="max-w-2xl mb-12">
                <p className="modern-prose mb-6">
                  A cybersecurity competition platform designed for Liberian students to develop their skills in ethical hacking, penetration testing, and cybersecurity.
                </p>
                <p className="modern-caption">
                  Built by HUIX-2099. Developed by Victor Edet Coleman.
                </p>
              </div>

              <div className="modern-section mb-8 max-w-xl">
                <div className="modern-label mb-4">Demo Credentials</div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-bold">admin@ctfd.io</span>
                    <span className="modern-muted">admin123</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">user@ctfd.io</span>
                    <span className="modern-muted">user123</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 modern-divider">
                  <p className="text-sm modern-muted">
                    Or{" "}
                    <Link href="/register" className="font-bold hover:underline">
                      register a new account
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button className="modern-button">
                    Login to Platform
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {/* Admin login removed; admins use the same login */}
              </div>
            </div>

            <div className="relative">
              <div className="modern-section p-12">
                <div className="modern-number text-center mb-8">{year}</div>
                <div className="modern-h3 text-center mb-8">Cybersecurity Excellence</div>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="modern-number text-4xl">{challenges.length}</div>
                    <div className="modern-label">Challenges</div>
                  </div>
                  <div>
                    <div className="modern-number text-4xl">{users.length}</div>
                    <div className="modern-label">Participants</div>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <div className="modern-label">Total Solves</div>
                  <div className="modern-number text-3xl">{totalSolves}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="modern-label mb-4">Platform Features</div>
            <h2 className="modern-h2">Comprehensive CTF Experience</h2>
          </div>

          <div className="modern-grid-3">
            <div className="modern-section group hover:border-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center">
                  <Flag className="h-6 w-6 text-white" />
                </div>
                <div className="modern-label">01</div>
              </div>
              <h3 className="modern-h3 mb-4">Challenge Categories</h3>
              <p className="modern-prose">
                Web exploitation, cryptography, reverse engineering, forensics, and binary exploitation challenges.
              </p>
            </div>

            <div className="modern-section group hover:border-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="modern-label">02</div>
              </div>
              <h3 className="modern-h3 mb-4">Team Collaboration</h3>
              <p className="modern-prose">
                Form teams, collaborate on challenges, and compete together in the leaderboard.
              </p>
            </div>

            <div className="modern-section group hover:border-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="modern-label">03</div>
              </div>
              <h3 className="modern-h3 mb-4">Real-time Scoring</h3>
              <p className="modern-prose">
                Live leaderboard updates, automated flag validation, and instant feedback on submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Types */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="modern-label mb-4">Challenge Types</div>
            <h2 className="modern-h2">Diverse Learning Paths</h2>
          </div>

          <div className="modern-grid-2">
            <div className="modern-section">
              <div className="flex items-center gap-4 mb-6">
                <Code className="h-8 w-8" />
                <div className="modern-label">Programming</div>
              </div>
              <h3 className="modern-h3 mb-4">Code-Based Challenges</h3>
              <p className="modern-prose mb-6">
                Solve algorithmic problems, implement security solutions, and debug vulnerable code.
              </p>
              <div className="modern-data">
                <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                  <span>Difficulty Levels</span>
                  <span>Easy → Hard</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                  <span>Languages</span>
                  <span>Python, C++, JavaScript</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Points Range</span>
                  <span>100 - 500</span>
                </div>
              </div>
            </div>

            <div className="modern-section">
              <div className="flex items-center gap-4 mb-6">
                <BookOpen className="h-8 w-8" />
                <div className="modern-label">Knowledge</div>
              </div>
              <h3 className="modern-h3 mb-4">Multiple Choice Questions</h3>
              <p className="modern-prose mb-6">
                Test your theoretical knowledge of cybersecurity concepts, protocols, and best practices.
              </p>
              <div className="modern-data">
                <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                  <span>Categories</span>
                  <span>Network, Crypto, Web</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                  <span>Time Limit</span>
                  <span>2 minutes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Points Range</span>
                  <span>50 - 200</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div className="modern-section">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Settings className="h-8 w-8" />
              <div className="modern-label">Administration</div>
            </div>
            <h2 className="modern-h2 mb-6">Platform Management</h2>
            <p className="modern-prose mb-8 max-w-2xl mx-auto">
              Comprehensive admin dashboard for managing challenges, users, teams, and monitoring platform activity in real-time.
            </p>
            <Link href="/admin">
              <Button className="modern-button">
                Access Admin Panel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

