"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">
            CONTACT <span className="text-primary">US</span>
          </h1>
          <p className="text-white/60 text-lg">Get in touch with the LITSU team</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-[#0f0f0f] border-2 border-white/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-[#0f0f0f] border-2 border-white/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Subject</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="bg-[#0f0f0f] border-2 border-white/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="bg-[#0f0f0f] border-2 border-white/20 focus:border-primary"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full uppercase tracking-wide font-black">
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </Button>

              {submitted && (
                <div className="border-2 border-green-500 bg-green-500/10 p-4">
                  <p className="text-sm font-bold text-green-500">MESSAGE SENT SUCCESSFULLY!</p>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-white/20 p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-black uppercase mb-2">Email</h3>
                  <p className="text-white/60 font-mono">info@litsu.org</p>
                  <p className="text-white/60 font-mono">support@litsu.org</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-white/20 p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-black uppercase mb-2">Location</h3>
                  <p className="text-white/60">Monrovia, Liberia</p>
                  <p className="text-white/60">Montserrado County</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-white/20 p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-black uppercase mb-2">Phone</h3>
                  <p className="text-white/60 font-mono">+231 XXX XXXX</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-primary p-6">
              <h3 className="text-xl font-black uppercase mb-3">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Monday - Friday</span>
                  <span className="font-mono">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Saturday</span>
                  <span className="font-mono">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Sunday</span>
                  <span className="font-mono">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
