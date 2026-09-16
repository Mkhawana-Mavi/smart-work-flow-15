import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Aura" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly, persuasive, apologetic or direct tone, with an editable draft you control.",
      },
      { property: "og:title", content: "Smart Email Generator | Aura" },
      {
        property: "og:description",
        content: "Draft professional emails in the tone and length you need, in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM = `You are an executive communications specialist who writes workplace email.

Rules:
- Return ONLY the email: a "Subject:" line, then a blank line, then the body, then a sign-off.
- Match the requested tone precisely and keep it professional in every case.
- Respect the requested length. Short = under 90 words. Medium = 90-160. Detailed = 160-260.
- Use the sender's and recipient's names exactly as given. If a detail was not provided,
  use a clearly marked placeholder like [date] or [figure] — never invent facts, numbers,
  dates, commitments, prices or policies.
- Plain text only: no markdown, no emoji unless the tone is friendly and the user asked.
- One clear ask or next step, placed where the reader cannot miss it.
- Never use manipulative pressure, false urgency or guilt, even in a persuasive tone.`;

const TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Direct & concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [context, setContext] = useState("");
  const { output, setOutput, isRunning, error, run, stop } = useAiStream();

  const generate = () => {
    if (!context.trim()) return;
    void run({
      system: SYSTEM,
      prompt: [
        `Write a workplace email.`,
        `Tone: ${tone}`,
        `Length: ${length}`,
        recipient ? `Recipient: ${recipient}` : `Recipient: not specified, use a neutral greeting`,
        sender ? `Sender (sign off as): ${sender}` : `Sender: sign off with [Your name]`,
        subject ? `Desired subject/topic: ${subject}` : "",
        ``,
        `What the email must achieve, in the sender's own words:`,
        context.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 01"
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and Aura writes the email — tone, length and sign-off included. Every draft stays editable."
      />

      <ToolGrid>
        <Panel title="Email brief" description="The more context you give, the fewer placeholders you get.">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="Thandi, Head of Finance"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sender">Your name & role</Label>
                <Input
                  id="sender"
                  placeholder="Sam Okoye, Project Lead"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject">Topic or subject line (optional)</Label>
              <Input
                id="subject"
                placeholder="Q3 budget review — request to move the deadline"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="context">What needs to be said?</Label>
              <Textarea
                id="context"
                rows={7}
                placeholder="We can't hit Friday's deadline because the data export was delayed. Ask for an extension to Wednesday, offer a partial draft on Friday, keep it polite but confident."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <Button onClick={generate} disabled={isRunning || !context.trim()} className="w-full">
              {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isRunning ? "Writing…" : "Generate email"}
            </Button>
          </div>
        </Panel>

        <OutputPanel
          value={output}
          onChange={setOutput}
          isRunning={isRunning}
          error={error}
          onStop={stop}
          filename="aura-email.txt"
          emptyHint="Your drafted email will appear here, ready to edit and copy into your mail client."
        />
      </ToolGrid>

      <AiDisclaimer note="Check names, dates and commitments before you hit send." />
    </AppShell>
  );
}
