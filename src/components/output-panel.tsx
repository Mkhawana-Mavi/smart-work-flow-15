import { useState } from "react";
import { Check, Copy, Download, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel } from "@/components/tool-layout";

export function OutputPanel({
  value,
  onChange,
  isRunning,
  error,
  onStop,
  emptyHint,
  filename,
}: {
  value: string;
  onChange: (next: string) => void;
  isRunning: boolean;
  error: string | null;
  onStop: () => void;
  emptyHint: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel
      title="AI result"
      description="Fully editable — treat it as a first draft, not a final answer."
      action={
        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="outline" size="sm" onClick={onStop}>
              <Square className="size-3.5" /> Stop
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!value}>
            <Download className="size-3.5" />
            <span className="sr-only sm:not-sr-only">Save</span>
          </Button>
        </div>
      }
    >
      {error ? (
        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!value && !isRunning ? (
        <div className="flex min-h-[18rem] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      ) : (
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ai-output min-h-[22rem] resize-y bg-muted/30 font-sans"
            aria-label="AI generated output"
          />
          {isRunning && !value ? (
            <span className="absolute inset-x-0 top-1/2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </span>
          ) : null}
        </div>
      )}
    </Panel>
  );
}
