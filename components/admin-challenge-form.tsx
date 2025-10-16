"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createChallengeAction, updateChallengeAction } from "@/lib/actions/challenges"
import type { DBChallenge } from "@/lib/db"

interface AdminChallengeFormProps {
  open: boolean
  onClose: () => void
  challenge?: DBChallenge | null
  onSuccess: () => void
}

export function AdminChallengeForm({ open, onClose, challenge, onSuccess }: AdminChallengeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: challenge?.title || "",
    description: challenge?.description || "",
    category: challenge?.category || "web",
    difficulty: challenge?.difficulty || "easy",
    points: challenge?.points || 100,
    flag: challenge?.flag || "",
    tags: challenge?.tags?.join(", ") || "",
    hints: challenge?.hints?.join("\n") || "",
    files: challenge?.files?.join(", ") || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const challengeData = {
      title: formData.title,
      description: formData.description,
      category: formData.category as "web" | "crypto" | "reverse" | "pwn" | "forensics" | "misc",
      difficulty: formData.difficulty as "easy" | "medium" | "hard",
      points: Number(formData.points),
      flag: formData.flag,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      hints: formData.hints.split("\n").filter(Boolean),
      files: formData.files
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    }

    const result = challenge
      ? await updateChallengeAction(challenge.id, challengeData)
      : await createChallengeAction(challengeData)

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white text-black border-2 border-black/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-black">
            {challenge ? "Edit Challenge" : "Create Challenge"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#1a1a1a] border-2 border-white/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white border-2 border-black/20 min-h-[100px] text-black"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wide">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "web" | "crypto" | "reverse" | "pwn" | "forensics" | "misc") => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-white border-2 border-black/20 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="reverse">Reverse</SelectItem>
                  <SelectItem value="pwn">Pwn</SelectItem>
                  <SelectItem value="forensics">Forensics</SelectItem>
                  <SelectItem value="misc">Misc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wide">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: "easy" | "medium" | "hard") => 
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger className="bg-white border-2 border-black/20 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Points</Label>
            <Input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
              className="bg-white border-2 border-black/20 text-black"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Flag</Label>
            <Input
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              className="bg-white border-2 border-black/20 text-black font-mono"
              placeholder="CTF{...}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Tags (comma separated)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="bg-[#1a1a1a] border-2 border-white/20"
              placeholder="sql, injection, web"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Hints (one per line)</Label>
            <Textarea
              value={formData.hints}
              onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
              className="bg-white border-2 border-black/20 min-h-[100px] text-black font-mono"
              placeholder="Hint 1&#10;Hint 2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-wide">Files (comma separated)</Label>
            <Input
              value={formData.files}
              onChange={(e) => setFormData({ ...formData, files: e.target.value })}
              className="bg-[#1a1a1a] border-2 border-white/20"
              placeholder="challenge.zip, data.txt"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 font-bold uppercase">
              {loading ? "Saving..." : challenge ? "Update Challenge" : "Create Challenge"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="font-bold uppercase bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
