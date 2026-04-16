import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

export default function ContactPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Contact
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Let us design the right integrity workflow for your team.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Whether you are evaluating a pilot, improving an existing queue, or preparing a launch,
          we can help you define a focused implementation plan with clear scope, milestones, and
          measurable outcomes.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard
          className="reveal-up"
          title="Send a Message"
          description="Share your goals and current challenges"
        >
          <form className="space-y-3" aria-label="Contact form">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-[var(--text-muted)]">
                Name
                <input
                  type="text"
                  className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                  placeholder="Your full name"
                />
              </label>
              <label className="space-y-1 text-sm text-[var(--text-muted)]">
                Work Email
                <input
                  type="email"
                  className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                  placeholder="name@company.com"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-[var(--text-muted)]">
              Company
              <input
                type="text"
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                placeholder="Organization name"
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text-muted)]">
              Message
              <textarea
                rows={5}
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                placeholder="Tell us about your content protection goals, channels, and review process."
              />
            </label>
            <button
              type="button"
              className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
            >
              Send Inquiry
            </button>
          </form>
        </SectionCard>

        <SectionCard
          className="reveal-up"
          title="Other Ways to Reach Us"
          description="Response within one business day"
        >
          <div className="space-y-4 text-sm leading-7 text-[var(--text-muted)]">
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Email</p>
              <p>hello@truesource.ai</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Partnerships</p>
              <p>partners@truesource.ai</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Office Hours</p>
              <p>Monday to Friday, 9:00 AM to 6:00 PM UTC</p>
            </div>
            <p>
              Looking for service details first? Visit the
              <Link href="/services" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                Services page
              </Link>
              to review scope and delivery options.
            </p>
          </div>
        </SectionCard>
      </section>
    </>
  );
}
