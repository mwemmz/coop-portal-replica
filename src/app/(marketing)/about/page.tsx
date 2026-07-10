import Link from "next/link";
import { Button, Reveal } from "@/components/ui";

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 md:py-28">
        <Reveal>
          <div className="glass-surface--light rounded-3xl p-10 md:p-16">
            <span className="inline-block rounded-full bg-surface/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-surface">Our Story</span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl text-surface">About Coop</h1>
            <p className="mt-4 text-lg text-surface/85 max-w-2xl">
              The Cooperative Society Limited was founded
              by smallholder avocado farmers in Lusaka Province, Zambia, to collectively market
              their produce, access better prices, and build a sustainable value chain.
            </p>
          </div>
        </Reveal>

      <div className="mt-20 space-y-20 text-surface/80 leading-relaxed md:mt-28">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="glass-card-strong p-8 md:p-10">
              <h2 className="font-serif text-2xl text-surface">Who We Are</h2>
              <p className="mt-3 text-surface/75">
                Our members range from family farms with a few dozen trees to medium-scale
                commercial orchards. Together we pool our harvest, grade consistently, and
                connect directly with buyers — from Lusaka markets to export partners.
              </p>
            </div>
            <div className="glass-card-strong p-8 md:p-10">
              <h2 className="font-serif text-2xl text-surface">Our Structure</h2>
              <p className="mt-3">
                Coop is registered under the Cooperatives Act of Zambia and governed by an
                elected committee of member farmers. Every decision is made with the producer
                at the center.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-surface--light rounded-3xl px-8 py-14 md:px-14 md:py-20">
            <span className="inline-block rounded-full bg-surface/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-surface">Governance</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl text-surface">Farmer-Led, Farmer-Owned</h2>
            <p className="mt-4 max-w-2xl text-lg text-surface/80">
              The Cooperative is managed by a Board elected at the Annual General Meeting.
              Day-to-day operations are handled by a secretariat led by a General Manager,
              supported by field officers who work directly with member farmers.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-surface--light rounded-3xl px-8 py-14 md:px-14 md:py-20 shadow-xl shadow-pit/20">
            <span className="inline-block rounded-full bg-surface/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-surface">Membership</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl text-surface">Join the Cooperative</h2>
            <p className="mt-4 max-w-2xl text-lg text-surface/85">
              Membership is open to any avocado farmer in Zambia. Members contribute a
              portion of their harvest to the Cooperative and receive payouts based on
              quantity and grade delivered.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button trailingIcon={<ArrowIcon />} className="bg-pit text-white hover:bg-pit/90">Apply for Membership</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
