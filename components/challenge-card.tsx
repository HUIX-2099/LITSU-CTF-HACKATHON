"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users } from "lucide-react"
import type { Challenge } from "@/lib/challenges-data"
import { categoryBgColors, difficultyColors } from "@/lib/challenges-data"

interface ChallengeCardProps {
  challenge: Challenge
  onClick: () => void
  solved?: boolean
}

export function ChallengeCard({ challenge, onClick, solved }: ChallengeCardProps) {
  return (
    <Card
      className={`p-6 cursor-pointer transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20 ${
        solved
          ? "bg-[#0a0a0a] border-2 border-green-500/50"
          : "bg-[#0f0f0f] border-2 border-white/20 hover:bg-[#1a1a1a]"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge className={`${categoryBgColors[challenge.category]} border-2 uppercase font-bold tracking-wide`}>
            {challenge.category}
          </Badge>
          <Badge variant="outline" className={`${difficultyColors[challenge.difficulty]} border-2 uppercase font-bold`}>
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-primary font-black text-lg">
          <Trophy className="h-5 w-5" />
          <span>{challenge.points}</span>
        </div>
      </div>

      <h3 className="text-2xl font-black tracking-tight uppercase mb-3 text-white">{challenge.title}</h3>

      <div className="bg-[#1a1a1a] border border-white/10 p-4 mb-4 rounded">
        <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">{challenge.description}</p>
      </div>

      <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/60 font-mono">
          <Users className="h-4 w-4" />
          <span className="font-bold">{challenge.solves}</span>
          <span className="uppercase text-xs">solves</span>
        </div>
        {solved && (
          <Badge className="bg-green-500/20 text-green-400 border-2 border-green-500/50 uppercase font-bold">
            Solved
          </Badge>
        )}
      </div>
    </Card>
  )
}
