"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ChallengeCard } from "@/components/challenge-card"
import { ChallengeModal } from "@/components/challenge-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Flag, Filter } from "lucide-react"
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
      <div className="modern-page">
        <Navbar />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="modern-label">Loading challenges...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="modern-page">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Flag className="h-10 w-10 text-[#1a1a1a]" />
            <div>
              <h1 className="modern-h2 text-4xl">Challenges</h1>
              <div className="modern-label">Test your skills</div>
            </div>
          </div>
          <div className="modern-section max-w-md">
            <div className="modern-label mb-2">Progress</div>
            <div className="font-bold text-lg">
              {solvedChallenges.size} of {challenges.length} solved
            </div>
          </div>
        </div>

        <div className="mb-12 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-input pl-10 h-12"
            />
          </div>

          <div className="modern-grid-2">
            <div>
              <div className="modern-label mb-4">Category</div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className={categoryFilter === cat ? "modern-button" : "modern-button-outline"}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="modern-label mb-4">Difficulty</div>
              <div className="flex gap-2 flex-wrap">
                {difficulties.map((diff) => (
                  <Button
                    key={diff}
                    variant={difficultyFilter === diff ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficultyFilter(diff)}
                    className={difficultyFilter === diff ? "modern-button" : "modern-button-outline"}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modern-grid-3">
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
          <div className="modern-section text-center py-20">
            <div className="modern-label">No challenges found</div>
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
