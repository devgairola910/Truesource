import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

const posts = [
  {
    title: "Why Explainable Alerts Reduce Reviewer Fatigue",
    summary:
      "A practical look at how confidence breakdowns and source context help analysts make faster, more consistent decisions without sacrificing quality.",
    date: "April 10, 2026",
    readTime: "6 min read",
  },
  {
    title: "Designing Staged Detection Pipelines for Cost Control",
    summary:
      "How to balance recall and spend by combining low-cost prefilters with selective deep similarity matching in cloud-native workflows.",
    date: "March 28, 2026",
    readTime: "8 min read",
  },
  {
    title: "Handling Cropped and Re-Encoded Media in Real-World Feeds",
    summary:
      "Common transformation patterns and the signal combinations that maintain reliability when adversarial edits degrade single-method checks.",
    date: "March 16, 2026",
    readTime: "7 min read",
  },
  {
    title: "Building Whitelist Governance Without Losing Visibility",
    summary:
      "A framework for authorized domain suppression that cuts alert noise while preserving oversight and measurable accountability.",
    date: "February 24, 2026",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Blog
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Insights on detection quality, reviewer workflows, and operational strategy.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Our blog shares implementation lessons from real content integrity programs. We focus on
          practical methods teams can apply now, from threshold tuning and evidence design to queue
          governance and reporting discipline.
        </p>
      </section>

      <section className="space-y-4">
        {posts.map((post) => (
          <SectionCard
            key={post.title}
            className="reveal-up"
            title={post.title}
            description={`${post.date}  |  ${post.readTime}`}
          >
            <p className="text-sm leading-7 text-[var(--text-muted)]">{post.summary}</p>
            <p className="mt-3 text-sm font-semibold text-[var(--text-strong)]">
              Full article coming soon.
            </p>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        className="reveal-up"
        title="Looking for a specific topic?"
        description="Tell us what you want us to publish next"
      >
        <p className="mb-4 text-sm leading-7 text-[var(--text-muted)]">
          We regularly publish deep dives on scoring strategy, source selection, and review ops.
          If your team has a challenge you want covered, send us a note and we will prioritize it.
        </p>
        <Link
          href="/contact"
          className="inline-flex rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
        >
          Suggest a Topic
        </Link>
      </SectionCard>
    </>
  );
}
