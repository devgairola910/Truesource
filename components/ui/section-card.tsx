type SectionCardProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 shadow-[0_12px_40px_rgba(5,27,50,0.09)] ${className ?? ""}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold text-[var(--text-strong)]">
            {title}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">{description}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
