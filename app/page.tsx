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
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-[0_12px_40px_rgba(5,27,50,0.1)] md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Home
        </p>
        <h2 className="mt-2 max-w-3xl font-heading text-3xl font-bold leading-tight text-[var(--text-strong)] md:text-5xl">
          Protect your official media with fast detection and explainable evidence.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[var(--text-muted)] md:text-lg">
          TrueSource helps rights teams register official assets, monitor public channels,
          review suspicious reuse, and act with confidence. Our product is designed for
          practical execution, not vague promises, so teams can move from discovery to
          decision without workflow friction.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
          >
            Explore Services
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
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
