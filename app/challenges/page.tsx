"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ChallengeCard } from "@/components/challenge-card"
import { ChallengeModal } from "@/components/challenge-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Footer } from "@/components/footer"
import { getAllChallengesAction } from "@/lib/actions/challenges"
import { useAuth } from "@/lib/auth-context"
import type { DBChallenge } from "@/lib/db"

export default function ChallengesPage() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<DBChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<DBChallenge | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  useEffect(() => {
    async function loadChallenges() {
      const result = await getAllChallengesAction()
      if (result.success && result.challenges) {
        setChallenges(result.challenges)
      }
      setLoading(false)
    }
    loadChallenges()
  }, [])

  const solvedChallenges = new Set(user?.solvedChallenges || [])

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = ["all", "web", "crypto", "reverse", "pwn", "forensics", "misc"]
  const difficulties = ["all", "easy", "medium", "hard"]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191919]">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center py-20">
            <p className="text-white/60 uppercase tracking-wide font-bold">Loading challenges...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">Challenges</h1>
          <p className="text-white/60 text-lg">
            <span className="text-primary font-bold">{solvedChallenges.size}</span> of{" "}
            <span className="text-white font-bold">{challenges.length}</span> solved
          </p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              placeholder="SEARCH CHALLENGES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#1e1e1e] border-2 border-white/20 h-14 font-mono uppercase"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">Category</p>
              <div className="flex gap-3 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className="uppercase tracking-wide font-bold"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">Difficulty</p>
              <div className="flex gap-3 flex-wrap">
                {difficulties.map((diff) => (
                  <Button
                    key={diff}
                    variant={difficultyFilter === diff ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficultyFilter(diff)}
                    className="uppercase tracking-wide font-bold"
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClick={() => setSelectedChallenge(challenge)}
              solved={solvedChallenges.has(challenge.id)}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-20 border-2 border-white/20">
            <p className="text-white/40 uppercase tracking-wide font-bold">No challenges found</p>
          </div>
        )}
      </main>

      <ChallengeModal
        challenge={selectedChallenge}
        open={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        solved={selectedChallenge ? solvedChallenges.has(selectedChallenge.id) : false}
      />

      <Footer />
    </div>
  )
}
