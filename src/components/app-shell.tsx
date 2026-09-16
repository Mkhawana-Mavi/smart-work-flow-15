import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bot,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Your workspace at a glance" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft professional email in any tone" },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen, blurb: "Decisions, actions, deadlines" },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritised daily & weekly plans" },
  { to: "/research", label: "Research Assistant", icon: Search, blurb: "Summaries, insights, recommendations" },
  { to: "/chat", label: "Assistant Chat", icon: Bot, blurb: "Ask anything about your work" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4 text-sidebar-foreground">
      <Link
        to="/"
        onClick={onNavigate}
        className="mb-6 flex items-center gap-2.5 px-2 py-1"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4.5" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold">Aura</span>
          <span className="block text-xs text-sidebar-foreground/60">Workplace AI</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground/80">
        <span className="mb-1.5 flex items-center gap-2 font-medium text-sidebar-accent-foreground">
          <ShieldCheck className="size-3.5" aria-hidden />
          Responsible AI
        </span>
        Outputs are AI-generated and may be wrong. Review before sending, and never paste
        confidential or personal data.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarInner />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-display text-base font-semibold">Aura Workplace AI</span>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
