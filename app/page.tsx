import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#191919]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto mb-20 md:mb-32">
          <div className="flex items-center gap-6 mb-12">
            <Image src="/litsu-logo.jpg" alt="LITSU" width={120} height={120} className="rounded-full" />
            <div>
              <div className="inline-block border-2 border-primary px-4 py-2 mb-4">
                <span className="font-mono text-xs tracking-widest text-primary uppercase">Official CTF Platform</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white/90">
                Liberia Information Technology Students Union
              </h2>
            </div>
          </div>

          <h1 className="text-[60px] md:text-[120px] leading-[0.9] font-black tracking-tighter mb-12 uppercase">
            <span className="text-white">LITSU</span>
            <br />
            <span className="text-primary">CTF HACKATHON</span>
          </h1>

          <div className="max-w-3xl mb-12">
            <p className="text-xl text-white/80 leading-relaxed mb-4">
              Welcome to the official LITSU CTF Hackathon Platform - A cybersecurity competition platform designed for
              Liberian students to develop their skills in ethical hacking, penetration testing, and cybersecurity.
            </p>
            <p className="text-base text-white/60 leading-relaxed mb-2">
              <span className="text-primary font-bold">We think of the future and hope for progress</span>
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              Built by HUIX-2099. Developed by Victor Edet Coleman.
            </p>
          </div>

          <div className="border-2 border-white/20 p-8 mb-12 max-w-2xl">
            <p className="text-sm uppercase tracking-wide font-bold mb-6">
              You can login using one of the following accounts:
            </p>

            <div className="space-y-4 font-mono">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">admin</span>
                <span className="text-primary">password</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">user</span>
                <span className="text-primary">password</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-white/10">
              <p className="text-sm text-white/60">
                Or you can{" "}
                <Link href="/register" className="text-primary hover:underline font-bold">
                  register a new account
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-base px-8 py-6 uppercase tracking-wide font-black">
                Click here to login
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-20 md:mb-32">
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-12">
            <span className="text-white">Plus </span>
            <span className="text-primary">Features</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/challenges"
              className="border-2 border-white/20 p-8 hover:border-primary transition-colors group"
            >
              <div className="font-mono text-xs text-white/40 mb-4 tracking-widest">01</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                Unlockable Challenges
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">Progressive challenge system with dependencies</p>
            </Link>

            <Link
              href="/challenges"
              className="border-2 border-white/20 p-8 hover:border-primary transition-colors group"
            >
              <div className="font-mono text-xs text-white/40 mb-4 tracking-widest">02</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                Programming Challenges
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">Code-based challenges with automated testing</p>
            </Link>

            <Link
              href="/challenges"
              className="border-2 border-white/20 p-8 hover:border-primary transition-colors group"
            >
              <div className="font-mono text-xs text-white/40 mb-4 tracking-widest">03</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                Multiple Choice Questions
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">Quiz-style challenges for knowledge testing</p>
            </Link>
          </div>
        </div>

        <div className="border-2 border-primary p-6 md:p-12 mb-20 md:mb-32">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">Admin Panel</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Use the{" "}
              <Link href="/admin" className="text-primary hover:underline font-bold">
                Admin Panel
              </Link>{" "}
              to change whatever you'd like with the admin account.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
