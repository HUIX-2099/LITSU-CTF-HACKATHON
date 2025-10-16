"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, Tag, FileText, Lightbulb, CheckCircle2, XCircle, UsersRound, Clock, User, Award } from "lucide-react"
import type { DBChallenge, User, Team } from "@/lib/db"
import { submitFlagAction } from "@/lib/actions/challenges"
import { useAuth } from "@/lib/auth-context"

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
  const { user } = useAuth()
  const [flag, setFlag] = useState("")
  const [showHints, setShowHints] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "correct" | "incorrect" | "loading">("idle")
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [teamInfo, setTeamInfo] = useState<Team | null>(null)
  const [showTeamStats, setShowTeamStats] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    if (open && challenge) {
      setTimeSpent(0)
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [open, challenge])

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
      <DialogContent className="max-w-3xl bg-white text-black border-2 border-black/20">
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
              <span className="text-black">{challenge.points} points</span>
            </div>
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight text-black">{challenge.title}</DialogTitle>
          <div className="bg-white border border-black/20 p-4 rounded mt-3">
            <DialogDescription className="text-base leading-relaxed text-black">
              {challenge.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm bg-white border border-black/20 p-3 rounded">
            <div className="flex items-center gap-2 text-black/80 font-mono">
              <Users className="h-4 w-4" />
              <span className="font-bold">{challenge.solves}</span>
              <span className="uppercase text-xs">solves</span>
            </div>
            <div className="flex items-center gap-2 text-black/80 font-mono">
              <Clock className="h-4 w-4" />
              <span className="font-bold">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
              <span className="uppercase text-xs">time</span>
            </div>
            {user?.teamId && (
              <div className="flex items-center gap-2 text-black/80 font-mono">
                <UsersRound className="h-4 w-4" />
                <span className="font-bold">Team Mode</span>
              </div>
            )}
          </div>

          {/* Team Testing Section */}
          {user?.teamId && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 p-4 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5 text-primary" />
                  <span className="font-bold text-primary uppercase tracking-wide">Team Testing</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTeamStats(!showTeamStats)}
                  className="text-xs"
                >
                  {showTeamStats ? "Hide" : "Show"} Team Stats
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-white border border-primary/20 p-3 rounded">
                  <div className="text-xs uppercase tracking-wide text-primary/60">Team Score</div>
                  <div className="text-2xl font-bold text-primary">{teamInfo?.score || 0}</div>
                </div>
                <div className="bg-white border border-primary/20 p-3 rounded">
                  <div className="text-xs uppercase tracking-wide text-primary/60">Team Solves</div>
                  <div className="text-2xl font-bold text-primary">{teamMembers.filter(m => m.solvedChallenges.includes(challenge.id)).length}</div>
                </div>
              </div>

              {showTeamStats && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-primary/80">Team Members Working on This Challenge:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between bg-white border border-primary/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {member.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.solvedChallenges.includes(challenge.id) ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Solved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Working
                            </Badge>
                          )}
                          <span className="text-xs text-primary/60">{member.score} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="bg-gray-50 border border-black/10 p-4 rounded">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-black/60" />
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
            <div className="bg-gray-50 border border-black/10 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-black/60" />
                <span className="text-sm font-medium text-black/60">Files</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.files.map((file, i) => (
                  <a
                    key={i}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {file.split("/").pop()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="bg-gray-50 border border-black/10 p-4 rounded">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-medium">Hints ({challenge.hints.length})</span>
              </button>

              {showHints && (
                <div className="mt-2 space-y-2">
                  {challenge.hints.map((hint, i) => (
                    <div key={i} className="text-sm text-black/80 bg-white p-3 rounded border border-black/10">
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Flag */}
          <div className="bg-gray-50 border border-black/10 p-4 rounded">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-black/60">Submit Flag</span>
              {solved && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Solved
                </Badge>
              )}
              {user?.teamId && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <UsersRound className="h-3.5 w-3.5 mr-1" />
                  Team Mode
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="bg-white border-2 border-black/10 text-black placeholder:text-black/40 h-12"
                disabled={submitStatus === "loading" || submitStatus === "correct" || solved}
              />
              <Button
                onClick={handleSubmit}
                disabled={
                  !flag.trim() || submitStatus === "loading" || submitStatus === "correct" || solved
                }
                className="h-12 px-6 font-bold uppercase tracking-wide"
              >
                {submitStatus === "loading"
                  ? "Submitting..."
                  : submitStatus === "correct"
                    ? "Correct!"
                    : submitStatus === "incorrect"
                      ? "Incorrect"
                      : "Submit"}
              </Button>
            </div>

            {submitStatus === "correct" && (
              <div className="mt-3 text-green-600 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {user?.teamId ? (
                  <>
                    Correct flag! Your team earned {challenge.points} points.
                    <Award className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  `Correct flag! You've earned ${challenge.points} points.`
                )}
              </div>
            )}

            {submitStatus === "incorrect" && (
              <div className="mt-3 text-red-600 text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Incorrect flag. Try again!
              </div>
            )}

            {/* Team Testing Tips */}
            {user?.teamId && !solved && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <UsersRound className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Team Testing Tips</span>
                </div>
                <ul className="text-xs text-primary/80 space-y-1">
                  <li>• Work together to solve the challenge</li>
                  <li>• Share findings and approaches with your team</li>
                  <li>• Only one team member needs to submit the correct flag</li>
                  <li>• All team members will receive the points when solved</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
