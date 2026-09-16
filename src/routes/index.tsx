import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AppShell, NAV_ITEMS } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/tool-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Aura helps professionals draft emails, summarize meeting notes, plan tasks, research topics and chat with an AI workplace assistant.",
      },
      { property: "og:title", content: "Aura — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan your week and research faster with one responsible AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const HIGHLIGHTS = [
  { icon: Zap, title: "Structured prompts", body: "Every tool sends a task-specific, role-based prompt — not a blank box." },
  { icon: Sparkles, title: "Editable outputs", body: "Results stream in and stay fully editable, copyable and downloadable." },
  { icon: ShieldCheck, title: "Responsible by default", body: "Clear disclaimers, no invented facts, and guidance to keep private data out." },
];

function Dashboard() {
  const tools = NAV_ITEMS.filter((item) => item.to !== "/");

  return (
    <AppShell>
      <section className="bg-brand-mesh border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            AI workplace productivity assistant
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            <span className="text-gradient-brand">Do the thinking. Let Aura do the drafting.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Five focused AI workflows for everyday professional work — writing email, turning messy
            meeting notes into decisions and action items, planning a realistic week, researching a
            topic, and asking an assistant anything in between.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
            >
              Start with an email <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Open the assistant
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-display text-lg font-semibold">Workspace tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="surface-card group p-5 transition-shadow hover:shadow-lifted"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold">{tool.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{tool.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-12 font-display text-lg font-semibold">How Aura works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-card p-5">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      <AiDisclaimer note="Aura has no access to your inbox, calendar, files or the live internet." />
    </AppShell>
  );
}
