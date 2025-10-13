"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Tag, FileText, Lightbulb, CheckCircle2, XCircle } from "lucide-react"
import type { DBChallenge } from "@/lib/db"
import { submitFlagAction } from "@/lib/actions/challenges"

const categoryBgColors = {
  web: "bg-primary/10 border-primary/20",
  crypto: "bg-secondary/10 border-secondary/20",
  reverse: "bg-accent/10 border-accent/20",
  pwn: "bg-destructive/10 border-destructive/20",
  forensics: "bg-yellow-500/10 border-yellow-500/20",
  misc: "bg-green-500/10 border-green-500/20",
}

const difficultyColors = {
  easy: "text-green-500",
  medium: "text-yellow-500",
  hard: "text-red-500",
}

interface ChallengeModalProps {
  challenge: DBChallenge | null
  open: boolean
  onClose: () => void
  solved?: boolean
}

export function ChallengeModal({ challenge, open, onClose, solved }: ChallengeModalProps) {
  const [flag, setFlag] = useState("")
  const [showHints, setShowHints] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "correct" | "incorrect" | "loading">("idle")

  if (!challenge) return null

  const handleSubmit = async () => {
    setSubmitStatus("loading")
    const result = await submitFlagAction(challenge.id, flag.trim())

    if (result.success && result.correct) {
      setSubmitStatus("correct")
      setTimeout(() => {
        onClose()
        setFlag("")
        setSubmitStatus("idle")
        window.location.reload() // Refresh to update solved challenges
      }, 1500)
    } else {
      setSubmitStatus("incorrect")
      setTimeout(() => setSubmitStatus("idle"), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0f0f0f] border-2 border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${categoryBgColors[challenge.category]} border-2 uppercase font-bold tracking-wide`}>
              {challenge.category}
            </Badge>
            <Badge
              variant="outline"
              className={`${difficultyColors[challenge.difficulty]} border-2 uppercase font-bold`}
            >
              {challenge.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-primary font-black text-lg ml-auto">
              <Trophy className="h-5 w-5" />
              <span>{challenge.points} points</span>
            </div>
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight">{challenge.title}</DialogTitle>
          <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded mt-3">
            <DialogDescription className="text-base leading-relaxed text-white/70">
              {challenge.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm bg-[#1a1a1a] border border-white/10 p-3 rounded">
            <div className="flex items-center gap-2 text-white/60 font-mono">
              <Users className="h-4 w-4" />
              <span className="font-bold">{challenge.solves}</span>
              <span className="uppercase text-xs">solves</span>
            </div>
          </div>

          {/* Tags */}
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-white/60" />
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs uppercase font-bold border-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {challenge.files && challenge.files.length > 0 && (
            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <FileText className="h-4 w-4" />
                <span>Challenge Files</span>
              </div>
              <div className="space-y-2">
                {challenge.files.map((file) => (
                  <Button
                    key={file}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-[#0f0f0f] border-2 font-mono hover:bg-[#252525]"
                  >
                    {file}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="w-full border-2 font-bold uppercase tracking-wide"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
              {showHints && (
                <div className="space-y-3 p-4 bg-[#1a1a1a] border-2 border-yellow-500/30 rounded">
                  {challenge.hints.map((hint, index) => (
                    <div key={index} className="text-sm bg-[#0f0f0f] border border-white/10 p-3 rounded">
                      <span className="font-bold text-yellow-500 uppercase">Hint {index + 1}:</span>{" "}
                      <span className="text-white/70">{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Flag Submission */}
          {!solved ? (
            <div className="space-y-3 pt-4 border-t-2 border-white/20">
              <div className="bg-[#1a1a1a] border-2 border-white/20 p-4 rounded space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-white/60">Submit Flag</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="CTF{...}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="font-mono bg-[#0f0f0f] border-2 border-white/20 h-12 text-lg"
                    disabled={submitStatus === "loading"}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!flag.trim() || submitStatus === "loading"}
                    className="px-8 font-bold uppercase tracking-wide"
                  >
                    {submitStatus === "loading" ? "..." : "Submit"}
                  </Button>
                </div>
              </div>

              {submitStatus === "correct" && (
                <div className="flex items-center gap-3 text-green-400 bg-green-500/20 border-2 border-green-500/50 p-4 rounded">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wide">Correct! Well done!</span>
                </div>
              )}

              {submitStatus === "incorrect" && (
                <div className="flex items-center gap-3 text-red-400 bg-red-500/20 border-2 border-red-500/50 p-4 rounded">
                  <XCircle className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wide">Incorrect flag. Try again!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-400 bg-green-500/20 border-2 border-green-500/50 p-4 rounded">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-bold uppercase tracking-wide">You've already solved this challenge!</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
