"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "GENERAL",
    questions: [
      {
        q: "What is LITSU CTF?",
        a: "LITSU CTF is a Capture The Flag cybersecurity competition platform designed for Liberian students to practice and improve their hacking skills in a safe, legal environment.",
      },
      {
        q: "Who can participate?",
        a: "Anyone interested in cybersecurity can participate! Whether you're a beginner or an experienced hacker, we have challenges for all skill levels.",
      },
      {
        q: "Is it free to join?",
        a: "Yes! LITSU CTF is completely free for all students and participants.",
      },
    ],
  },
  {
    category: "CHALLENGES",
    questions: [
      {
        q: "What types of challenges are available?",
        a: "We offer challenges in Web Exploitation, Cryptography, Forensics, Reverse Engineering, Binary Exploitation, OSINT, and more.",
      },
      {
        q: "How do I submit a flag?",
        a: "Click on a challenge, read the description, solve it, and submit the flag in the format specified (usually flag{...}).",
      },
      {
        q: "Can I get hints?",
        a: "Yes! Most challenges have hints available. Click the 'Show Hints' button on the challenge page.",
      },
    ],
  },
  {
    category: "TEAMS",
    questions: [
      {
        q: "Can I join a team?",
        a: "Yes! You can create a team or join an existing team using an invite code.",
      },
      {
        q: "How many members can a team have?",
        a: "Teams can have up to 5 members by default. Check the current competition rules for specific limits.",
      },
      {
        q: "Can I compete individually?",
        a: "You can compete as an individual or as part of a team.",
      },
    ],
  },
  {
    category: "SCORING",
    questions: [
      {
        q: "How is scoring calculated?",
        a: "Each challenge has a point value. Solve challenges to earn points. The scoreboard ranks participants by total points and solve time.",
      },
      {
        q: "What is dynamic scoring?",
        a: "Some challenges use dynamic scoring where the point value decreases as more people solve it, rewarding early solvers.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">
            FAQ<span className="text-primary">S</span>
          </h1>
          <p className="text-white/60 text-lg">Frequently Asked Questions</p>
        </div>

        <div className="max-w-4xl space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="border-2 border-primary px-4 py-2 inline-block mb-6">
                <h2 className="text-xl font-black uppercase tracking-wide">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`
                  const isOpen = openIndex === index

                  return (
                    <div key={index} className="border-2 border-white/20 overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <span className="text-left font-bold uppercase tracking-wide">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 border-t-2 border-white/10 pt-6">
                          <p className="text-white/70 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-2 border-primary p-8">
          <h2 className="text-3xl font-black uppercase mb-4">Still Have Questions?</h2>
          <p className="text-white/70 mb-6">
            Can't find the answer you're looking for? Contact our support team and we'll get back to you as soon as
            possible.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-black px-8 py-3 font-black uppercase tracking-wide hover:bg-primary/90 transition-colors"
          >
            CONTACT US
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
