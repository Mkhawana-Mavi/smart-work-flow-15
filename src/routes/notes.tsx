import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, NotebookPen, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Aura" },
      {
        name: "description",
        content:
          "Turn long meeting notes or transcripts into a short summary with decisions, owned action items, deadlines, risks and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Aura" },
      {
        property: "og:description",
        content: "Decisions, action items and deadlines extracted from messy meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

const SYSTEM = `You are a meticulous chief-of-staff who turns raw meeting notes into a usable record.

Output EXACTLY these sections, in this order, as plain text with "-" bullets:

SUMMARY
Three to five sentences covering purpose and outcome.

DECISIONS
Each decision on one line, with who decided it if stated.

ACTION ITEMS
One line each: "[Owner] — [action] — [due date or 'no date given']". Use "Unassigned" when no
owner is stated. Never guess an owner.

DEADLINES & DATES
Every date or time commitment mentioned, with what it belongs to. Write relative dates exactly as
said (e.g. "end of next week") — do not convert them to calendar dates.

RISKS & BLOCKERS
Concerns, dependencies or blockers raised. Write "None mentioned." if there are none.

OPEN QUESTIONS
Unresolved items or things the notes leave ambiguous.

Rules: extract only what the notes support. Never invent owners, dates, numbers or decisions.
If the notes are contradictory or unclear, say so in OPEN QUESTIONS rather than choosing for them.
No preamble, no closing commentary, no markdown symbols other than "-".`;

const DETAIL = ["Executive (tight)", "Standard", "Detailed"];

function NotesPage() {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [detail, setDetail] = useState("Standard");
  const [notes, setNotes] = useState("");
  const { output, setOutput, isRunning, error, run, stop } = useAiStream();

  const generate = () => {
    if (!notes.trim()) return;
    void run({
      system: SYSTEM,
      prompt: [
        title ? `Meeting: ${title}` : "",
        attendees ? `Attendees: ${attendees}` : "",
        `Detail level: ${detail}`,
        ``,
        `Raw notes / transcript:`,
        notes.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 02"
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript. Aura returns a summary plus decisions, owned action items, deadlines, risks and open questions."
      />

      <ToolGrid>
        <Panel title="Meeting input" description="Bullet points, a transcript or a wall of text all work.">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Meeting name (optional)</Label>
              <Input
                id="title"
                placeholder="Weekly product sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="attendees">Attendees (optional)</Label>
              <Input
                id="attendees"
                placeholder="Lerato, Daniel, Priya, Marcus"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Detail level</Label>
              <Select value={detail} onValueChange={setDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DETAIL.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes or transcript</Label>
              <Textarea
                id="notes"
                rows={12}
                placeholder="Paste your raw meeting notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"}
              </p>
            </div>
            <Button onClick={generate} disabled={isRunning || !notes.trim()} className="w-full">
              {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isRunning ? "Summarizing…" : "Summarize notes"}
            </Button>
          </div>
        </Panel>

        <OutputPanel
          value={output}
          onChange={setOutput}
          isRunning={isRunning}
          error={error}
          onStop={stop}
          filename="aura-meeting-summary.txt"
          emptyHint="Your summary, decisions, action items and deadlines will appear here."
        />
      </ToolGrid>

      <AiDisclaimer note="Confirm owners and due dates with attendees before circulating the recap." />
    </AppShell>
  );
}
