import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-32 text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Image src="/litsu-logo.jpg" alt="LITSU" width={60} height={60} />
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">
                  <span className="text-black">LITSU</span>
                </h3>
                <p className="text-xs text-black/60 uppercase tracking-widest font-mono">CTF Hackathon</p>
              </div>
            </div>
            <p className="text-black/70 leading-relaxed mb-4 max-w-md">
              Liberia Information Technology Students Union - A Capture The Flag platform for cybersecurity education
              and competition. Building the next generation of security professionals.
            </p>
            <p className="text-sm text-black font-bold italic">"We think of the future and hope for progress"</p>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide mb-4 text-black">Location</h4>
            <div className="text-sm text-black/60 space-y-2">
              <p>Monrovia, Liberia</p>
              <p>West Africa</p>
            </div>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide mb-4 text-black">Helpful Links</h4>
            <div className="space-y-2">
              <Link href="/challenges" className="block text-sm text-black/60 hover:text-black transition-colors">
                Challenges
              </Link>
              <Link href="/scoreboard" className="block text-sm text-black/60 hover:text-black transition-colors">
                Scoreboard
              </Link>
              <Link href="/teams" className="block text-sm text-black/60 hover:text-black transition-colors">
                Teams
              </Link>
              <Link href="/about" className="block text-sm text-black/60 hover:text-black transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>

        {/* Large HUIX branding section */}
        <div className="border-t border-neutral-200 pt-12 mb-12">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-[60px] md:text-[120px] font-black tracking-[0.2em] text-black/10 uppercase">
              HUIX-2099
            </h2>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="font-mono text-xs text-black/40 tracking-widest">HUIX-2099</div>
              <div className="w-px h-4 bg-black/10"></div>
              <div className="font-mono text-xs text-black/40">Monochrome</div>
            </div>

            <div className="text-sm text-black/60 text-center"></div>

            <div className="text-xs text-black/40 font-mono">© 2025 LITSU</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

