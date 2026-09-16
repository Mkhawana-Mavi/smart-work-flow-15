import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Aura" },
      {
        name: "description",
        content:
          "Summarize a topic or a pasted article and get key insights, practical recommendations, risks and open questions tailored to your audience.",
      },
      { property: "og:title", content: "AI Research Assistant | Aura" },
      {
        property: "og:description",
        content: "Topic and article summaries with insights, recommendations and caveats.",
      },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM = `You are a research analyst briefing a busy professional.

Output EXACTLY these sections as plain text with "-" bullets:

BRIEF
A 4-6 sentence orientation to the topic, written for the stated audience.

KEY INSIGHTS
5-7 bullets. Each states a substantive point, not a generality.

WHAT IT MEANS FOR YOU
Practical implications tied to the user's stated goal or context.

RECOMMENDATIONS
Concrete next actions, ordered by priority, each with a one-line rationale.

RISKS & COUNTERPOINTS
Where the mainstream view is contested, uncertain, or could go wrong.

CONFIDENCE & GAPS
State plainly how confident you are and what you could not verify. If the answer depends on
recent developments, say that your knowledge has a cutoff and may be out of date.

OPEN QUESTIONS TO RESEARCH NEXT
Specific questions, each with the kind of source that would answer it.

Rules: when the user pastes source text, ground everything in that text and mark anything you
add from general knowledge as "[general knowledge]". Never fabricate statistics, citations,
study names, URLs or quotes. If you do not know, say so. No markdown other than "-".`;

const DEPTHS = ["Quick brief", "Standard analysis", "Deep dive"];
const AUDIENCES = ["Executive / leadership", "Technical team", "Client or customer", "General colleague"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard analysis");
  const [audience, setAudience] = useState("Executive / leadership");
  const [goal, setGoal] = useState("");
  const [source, setSource] = useState("");
  const { output, setOutput, isRunning, error, run, stop } = useAiStream();

  const generate = () => {
    if (!topic.trim() && !source.trim()) return;
    void run({
      system: SYSTEM,
      prompt: [
        topic.trim() ? `Topic or question: ${topic.trim()}` : "Topic: derive it from the source text below.",
        `Depth: ${depth}`,
        `Audience: ${audience}`,
        goal.trim() ? `Why the user needs this: ${goal.trim()}` : "",
        source.trim() ? `\nSource text to summarize and ground the analysis in:\n"""\n${source.trim()}\n"""` : "\nNo source text provided — answer from general knowledge and flag the limits.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 04"
        icon={Search}
        title="AI Research Assistant"
        description="Summarize a topic or paste an article. Aura returns insights, recommendations, counterpoints and an honest confidence statement."
      />

      <ToolGrid>
        <Panel title="Research brief" description="Paste source text for grounded answers; leave it empty for a general overview.">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                placeholder="How should mid-sized firms approach AI governance?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPTHS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal">What decision will this inform? (optional)</Label>
              <Input
                id="goal"
                placeholder="Choosing whether to pilot AI tooling next quarter"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="source">Article or source text (optional)</Label>
              <Textarea
                id="source"
                rows={9}
                placeholder="Paste the article, report extract or notes you want summarized…"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <Button
              onClick={generate}
              disabled={isRunning || (!topic.trim() && !source.trim())}
              className="w-full"
            >
              {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isRunning ? "Researching…" : "Run research"}
            </Button>
          </div>
        </Panel>

        <OutputPanel
          value={output}
          onChange={setOutput}
          isRunning={isRunning}
          error={error}
          onStop={stop}
          filename="aura-research-brief.txt"
          emptyHint="Your brief, insights, recommendations and open questions will appear here."
        />
      </ToolGrid>

      <AiDisclaimer note="Aura cannot browse the web and has a knowledge cutoff — verify facts and figures against primary sources." />
    </AppShell>
  );
}
