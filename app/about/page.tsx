import Image from "next/image"
import { Footer } from "@/components/footer"
import { Shield, Users, Trophy, Code, Lock, Zap, Globe, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#191919]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <Image src="/litsu-logo.jpg" alt="LITSU" width={100} height={100} className="rounded-full" />
            <div>
              <div className="inline-block border-2 border-primary px-4 py-2 mb-3">
                <p className="text-xs font-mono text-primary tracking-widest">ABOUT LITSU</p>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white/90">
                Liberia Information Technology Students Union
              </h2>
            </div>
          </div>

          <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase mb-8">
            CYBER
            <br />
            SECURITY
            <br />
            <span className="text-primary">TRAINING</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-4">
            LITSU CTF Hackathon Platform is a cutting-edge Capture The Flag platform designed to train the next
            generation of cybersecurity professionals in Liberia and across West Africa.
          </p>
          <p className="text-lg text-primary font-bold italic">"We think of the future and hope for progress"</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="border-2 border-white/20 p-8">
            <div className="text-6xl font-black text-primary mb-4">500+</div>
            <div className="text-sm uppercase tracking-wide font-bold text-white/60">Active Students</div>
          </div>
          <div className="border-2 border-white/20 p-8">
            <div className="text-6xl font-black text-primary mb-4">50+</div>
            <div className="text-sm uppercase tracking-wide font-bold text-white/60">Challenges</div>
          </div>
          <div className="border-2 border-white/20 p-8">
            <div className="text-6xl font-black text-primary mb-4">100+</div>
            <div className="text-sm uppercase tracking-wide font-bold text-white/60">Teams</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-black uppercase mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Real-World Challenges</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Practice with challenges based on real cybersecurity scenarios and vulnerabilities.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Team Collaboration</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Form teams and compete together to solve complex security challenges.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Trophy className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Live Scoreboard</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Track your progress and compete with others on our real-time leaderboard.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Code className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Multiple Categories</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Web, Crypto, Forensics, Reverse Engineering, Binary Exploitation, and more.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Progressive Difficulty</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Start with easy challenges and progress to advanced levels as you improve.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Instant Feedback</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Get immediate validation on your solutions and learn from your mistakes.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Global Standards</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Training aligned with international cybersecurity standards and best practices.
              </p>
            </div>

            <div className="border-2 border-white/20 p-8 hover:border-primary transition-colors">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-black uppercase mb-3">Certificates</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Earn certificates for completing challenges and demonstrating your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="border-2 border-primary p-8 md:p-12 mb-20">
          <h2 className="text-4xl font-black uppercase mb-6">Our Mission</h2>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            The Liberia Information Technology Students Union (LITSU) is dedicated to empowering Liberian students and
            young professionals with world-class cybersecurity training. We foster a community of skilled security
            practitioners who can protect digital infrastructure and contribute to the global cybersecurity workforce.
          </p>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            We believe that cybersecurity education should be accessible to everyone, regardless of their background or
            location. Through hands-on challenges and collaborative learning, we're building the next generation of
            cyber defenders in Liberia.
          </p>
          <p className="text-xl text-primary font-bold italic">"We think of the future and hope for progress"</p>
        </div>

        {/* Technology Stack */}
        <div className="mb-20">
          <h2 className="text-4xl font-black uppercase mb-12">Built With Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-2 border-white/20 p-6 text-center">
              <div className="text-2xl font-black mb-2">Next.js</div>
              <div className="text-xs text-white/60 font-mono">FRAMEWORK</div>
            </div>
            <div className="border-2 border-white/20 p-6 text-center">
              <div className="text-2xl font-black mb-2">React</div>
              <div className="text-xs text-white/60 font-mono">UI LIBRARY</div>
            </div>
            <div className="border-2 border-white/20 p-6 text-center">
              <div className="text-2xl font-black mb-2">TypeScript</div>
              <div className="text-xs text-white/60 font-mono">LANGUAGE</div>
            </div>
            <div className="border-2 border-white/20 p-6 text-center">
              <div className="text-2xl font-black mb-2">Vercel</div>
              <div className="text-xs text-white/60 font-mono">HOSTING</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-2 border-white/20 p-8 md:p-12">
          <h2 className="text-4xl font-black uppercase mb-6">Get In Touch</h2>
          <p className="text-lg text-white/60 mb-8">
            Interested in joining LITSU or have questions about the platform? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-sm uppercase tracking-wide font-bold text-white/40 mb-2">Email</div>
              <div className="text-xl font-mono">info@litsu.org</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide font-bold text-white/40 mb-2">Location</div>
              <div className="text-xl font-mono">Monrovia, Liberia</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
