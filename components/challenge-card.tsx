"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users } from "lucide-react"
import type { DBChallenge } from "@/lib/db"

interface ChallengeCardProps {
  challenge: DBChallenge
  onClick: () => void
  solved?: boolean
}

export function ChallengeCard({ challenge, onClick, solved }: ChallengeCardProps) {
  return (
    <Card
      className={`p-6 cursor-pointer transition-all bg-white text-black border border-neutral-200 hover:border-black ${
        solved ? "opacity-90" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border border-neutral-200 uppercase font-bold tracking-wide">
            {challenge.category}
          </Badge>
          <Badge variant="outline" className="border border-neutral-200 uppercase font-bold">
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-black font-black text-lg">
          <Trophy className="h-5 w-5" />
          <span>{challenge.points}</span>
        </div>
      </div>

      <h3 className="text-2xl font-black tracking-tight uppercase mb-3">{challenge.title}</h3>

      <div className="bg-white border border-neutral-200 p-4 mb-4">
        <p className="text-sm text-black/70 line-clamp-3 leading-relaxed">{challenge.description}</p>
      </div>

      <div className="flex items-center justify-between text-sm pt-3 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-black/60 font-mono">
          <Users className="h-4 w-4" />
          <span className="font-bold">{challenge.solves}</span>
          <span className="uppercase text-xs">solves</span>
        </div>
        {solved && (
          <Badge className="bg-black text-white border border-black uppercase font-bold">
            Solved
          </Badge>
        )}
      </div>
    </Card>
  )
}

