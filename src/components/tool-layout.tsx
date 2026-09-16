import type { ComponentType, ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <header className="bg-brand-mesh border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-start gap-4">
          <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ToolGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {children}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface-card flex flex-col p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AiDisclaimer({ note }: { note?: string }) {
  return (
    <p className="mx-auto mt-2 mb-8 flex max-w-6xl items-start gap-2 px-4 text-xs text-muted-foreground sm:px-6">
      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
      <span>
        AI-generated content can be inaccurate or incomplete. Review and edit every output before
        you rely on it, and keep confidential, personal or regulated data out of your inputs.
        {note ? ` ${note}` : ""}
      </span>
    </p>
  );
}
