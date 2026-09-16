import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiDisclaimer, PageHeader, Panel, ToolGrid } from "@/components/tool-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiStream } from "@/lib/use-ai-stream";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler | Aura" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised, time-blocked daily or weekly schedule using Eisenhower, MoSCoW or impact-effort prioritisation.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler | Aura" },
      {
        property: "og:description",
        content: "A realistic, prioritised day or week built from your task list.",
      },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM = `You are a productivity coach who builds realistic, prioritised schedules.

Output EXACTLY these sections as plain text with "-" bullets:

PRIORITY CALL
The 1-3 things that matter most in this period, and one sentence on why each wins.

PRIORITISED TASKS
One line per task: "P1/P2/P3 — task — estimated time — reason". Use the prioritisation
framework the user selected.

SCHEDULE
Time-blocked plan inside the stated working hours. Keep blocks 30-120 minutes, put demanding
deep work in the user's stated peak-energy time, and include short breaks and a buffer block
for overruns. For a weekly horizon, group by day.

WHAT TO DROP OR DELEGATE
Tasks that do not fit, with a suggested owner or a later slot. Say plainly if the workload
exceeds the available hours.

END-OF-PERIOD CHECK
Two or three questions to review progress honestly.

Rules: never schedule more work than the stated hours allow — flag the overflow instead.
Respect every fixed commitment exactly as given. Do not invent meetings, deadlines or
priorities the user did not mention. No markdown other than "-".`;

const HORIZONS = ["Today", "This week"];
const FRAMEWORKS = ["Eisenhower (urgent/important)", "MoSCoW", "Impact vs. effort", "Deadline-first"];
const ENERGY = ["Morning", "Afternoon", "Evening", "No preference"];

function PlannerPage() {
  const [horizon, setHorizon] = useState("Today");
  const [framework, setFramework] = useState("Eisenhower (urgent/important)");
  const [hours, setHours] = useState("09:00 – 17:00");
  const [energy, setEnergy] = useState("Morning");
  const [tasks, setTasks] = useState("");
  const [fixed, setFixed] = useState("");
  const { output, setOutput, isRunning, error, run, stop } = useAiStream();

  const generate = () => {
    if (!tasks.trim()) return;
    void run({
      system: SYSTEM,
      prompt: [
        `Planning horizon: ${horizon}`,
        `Prioritisation framework: ${framework}`,
        `Working hours: ${hours || "not specified"}`,
        `Peak energy: ${energy}`,
        ``,
        `Tasks (one per line, with any deadlines or estimates the user provided):`,
        tasks.trim(),
        fixed.trim() ? `\nFixed commitments that cannot move:\n${fixed.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 03"
        icon={CalendarClock}
        title="AI Task Planner & Scheduler"
        description="Dump your task list. Aura prioritises it with a real framework and time-blocks a day or week that actually fits your hours."
      />

      <ToolGrid>
        <Panel title="Planning input" description="Add deadlines and rough time estimates for sharper plans.">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HORIZONS.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Peak energy</Label>
                <Select value={energy} onValueChange={setEnergy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENERGY.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Prioritisation framework</Label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FRAMEWORKS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hours">Working hours</Label>
              <Input
                id="hours"
                placeholder="09:00 – 17:00"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tasks">Tasks</Label>
              <Textarea
                id="tasks"
                rows={8}
                placeholder={"Finish Q3 report — due Thursday — 3h\nReview two pull requests — 1h\nPrep client demo — due Friday\nExpense claims"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fixed">Fixed commitments (optional)</Label>
              <Textarea
                id="fixed"
                rows={3}
                placeholder={"10:00–10:30 standup\n14:00–15:00 client call"}
                value={fixed}
                onChange={(e) => setFixed(e.target.value)}
              />
            </div>

            <Button onClick={generate} disabled={isRunning || !tasks.trim()} className="w-full">
              {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isRunning ? "Planning…" : "Build my schedule"}
            </Button>
          </div>
        </Panel>

        <OutputPanel
          value={output}
          onChange={setOutput}
          isRunning={isRunning}
          error={error}
          onStop={stop}
          filename="aura-schedule.txt"
          emptyHint="Your prioritised task list and time-blocked schedule will appear here."
        />
      </ToolGrid>

      <AiDisclaimer note="Aura cannot see your calendar — double-check the plan against real commitments." />
    </AppShell>
  );
}
