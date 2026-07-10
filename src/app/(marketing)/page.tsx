import Link from "next/link";
import { Button } from "@/components/ui";

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 7h12M8 2l5 5-5 5" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-3xl px-4 text-center">
          <div className="rounded-3xl p-10 md:p-14 scroll-reveal" style={{ background: "rgba(35, 43, 28, 0.60)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.10)", boxShadow: "0 20px 60px -10px rgba(35, 43, 28, 0.4)" }}>
            <h1 className="font-serif text-5xl leading-tight text-surface md:text-7xl">
              Growing Zambia&apos;s Finest Avocados, Together
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface/80">
              Cooperative Society — farmer-owned,
              quality-driven, feeding the nation and beyond.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/produce">
                <Button trailingIcon={<ArrowRight />} className="bg-pit text-white hover:bg-pit/90">
                  Browse Produce
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost-light">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="glass-surface--light rounded-3xl p-10 md:p-16">
            <div className="text-center scroll-reveal">
              <span className="inline-block rounded-full bg-surface/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-surface">From Our Farms</span>
              <h2 className="mt-4 font-serif text-4xl text-surface">Our Produce</h2>
              <p className="mt-2 text-surface/75">Farm-fresh, graded, and delivered to you.</p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { name: "Grade A Avocados", desc: "Premium export-quality, perfect condition.", price: "ZMW 45/kg" },
              { name: "Grade B Avocados", desc: "Great for processing and local markets.", price: "ZMW 30/kg" },
              { name: "Avocado Oil", desc: "Cold-pressed, extra virgin — coming soon.", price: "Coming soon" },
            ].map((item, i) => (
              <div key={item.name} className={`scroll-reveal hover-lift ${i === 1 ? "scroll-reveal-delay-1" : i === 2 ? "scroll-reveal-delay-2" : ""}`}>
                <div className="double-bezel">
                  <div className="double-bezel-inner p-6">
                    <div className="mb-3 inline-block rounded-full bg-pit/15 px-3 py-1 text-xs font-semibold text-surface">
                      {item.price}
                    </div>
                    <h3 className="font-serif text-xl text-surface">{item.name}</h3>
                    <p className="mt-1 text-sm text-surface/70">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="glass-surface--light rounded-3xl p-10 md:p-16 text-center">
            <div className="scroll-reveal">
              <span className="inline-block rounded-full bg-surface/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-surface">Why Join</span>
              <h2 className="mt-4 font-serif text-4xl text-surface">Why Coop?</h2>
              <p className="mt-2 text-surface/75">A cooperative built for and by Zambian avocado growers.</p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                { title: "Farmer-Owned", desc: "Every member has a voice and a share in our collective success." },
                { title: "Quality Assured", desc: "Rigorous grading ensures every fruit meets our standard." },
                { title: "Direct from Farm", desc: "No middlemen — better prices for farmers and buyers alike." },
              ].map((item, i) => (
                <div key={item.title} className={`scroll-reveal hover-lift ${i === 1 ? "scroll-reveal-delay-1" : i === 2 ? "scroll-reveal-delay-2" : ""}`}>
                  <div className="rounded-xl glass-card-strong p-8 h-full">
                    <h3 className="font-serif text-lg text-surface">{item.title}</h3>
                    <p className="mt-2 text-sm text-surface/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="glass-surface--light rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center scroll-reveal shadow-xl shadow-pit/20">
            <h2 className="font-serif text-4xl md:text-5xl text-surface">Ready to get involved?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-surface/85">Whether you&apos;re a farmer, a buyer, or a partner — there&apos;s a place for you at Coop.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="ghost-pit" trailingIcon={<ArrowRight />}>Contact Us</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost-pit">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
