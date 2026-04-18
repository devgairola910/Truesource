import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

const valuePoints = [
  {
    title: "Signal Layering",
    description:
      "We combine perceptual matching, embeddings, and contextual metadata so decisions are resilient when any single signal weakens.",
  },
  {
    title: "Reviewer Trust",
    description:
      "Every incident is explained with transparent evidence, confidence ranges, and source attribution to support fast, defensible triage.",
  },
  {
    title: "Scalable Scope",
    description:
      "A staged pipeline controls cloud cost by filtering cheaply first and spending deep analysis only where risk is meaningful.",
  },
];

export default function Home() {
  return (
    <>
      <section className="reveal-up modern-card rounded-3xl border border-[var(--stroke)] bg-white p-8 md:p-12 text-center flex flex-col items-center">
        <p className="inline-block rounded-full bg-[var(--surface-1)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-4">
          Welcome to TrueSource
        </p>
        <h2 className="max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-[var(--text-strong)] md:text-6xl md:leading-[1.1]">
          Protect your official media with fast detection and explainable evidence.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[var(--text-muted)] md:text-xl leading-relaxed">
          TrueSource helps rights teams register official assets, monitor public channels,
          review suspicious reuse, and act with confidence. Our product is designed for
          practical execution, not vague promises, so teams can move from discovery to
          decision without workflow friction.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/services"
            className="rounded-full bg-[var(--brand)] px-6 py-3.5 text-base font-semibold text-[var(--brand-ink)] shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand)]/30"
          >
            Explore Services
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[var(--stroke)] bg-white px-6 py-3.5 text-base font-semibold text-[var(--text-strong)] shadow-sm transition-all hover:bg-[var(--surface-1)] hover:-translate-y-1"
          >
            Contact Our Team
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {valuePoints.map((point) => (
          <SectionCard
            key={point.title}
            className="reveal-up"
            title={point.title}
            description="Why this matters"
          >
            <p className="text-sm leading-7 text-[var(--text-muted)]">{point.description}</p>
          </SectionCard>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          className="reveal-up"
          title="What You Can Do With TrueSource"
          description="Core outcomes teams expect in the first release"
        >
          <ul className="space-y-2 text-sm leading-7 text-[var(--text-muted)]">
            <li>Upload and organize official images and videos as a source of truth.</li>
            <li>Monitor selected public channels for suspicious media reuse patterns.</li>
            <li>Review alerts with clear confidence breakdown and incident context.</li>
            <li>Whitelist authorized domains to reduce noise and improve precision.</li>
            <li>Track operational KPIs like triage speed and false positive rate.</li>
          </ul>
        </SectionCard>

        <SectionCard
          className="reveal-up"
          title="Start Here"
          description="Suggested path through the site"
        >
          <ol className="space-y-3 text-sm leading-7 text-[var(--text-muted)]">
            <li>
              Learn who we are and how we approach detection in the
              <Link href="/about" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                About page
              </Link>
              .
            </li>
            <li>
              Review capabilities and implementation scope in
              <Link href="/services" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                Services
              </Link>
              .
            </li>
            <li>
              Read practical insights from our team in the
              <Link href="/blog" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                Blog
              </Link>
              .
            </li>
            <li>
              Reach out for onboarding, pilots, or demos through
              <Link href="/contact" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                Contact
              </Link>
              .
            </li>
          </ol>
        </SectionCard>
      </section>
    </>
  );
}
