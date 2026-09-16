import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiDisclaimer, PageHeader } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat | Aura" },
      {
        name: "description",
        content:
          "Chat with Aura, an AI workplace assistant that helps you think through tasks, messages, plans and decisions at work.",
      },
      { property: "og:title", content: "AI Assistant Chat | Aura" },
      {
        property: "og:description",
        content: "An interactive AI workplace assistant for everyday professional tasks.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me say no to a meeting without sounding difficult.",
  "Turn this rambling update into three clear bullets for my manager.",
  "What should I check before sending a client a project delay notice?",
  "Give me an agenda for a 30-minute team retrospective.",
];

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    void sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 05"
        icon={Bot}
        title="AI Assistant Chat"
        description="An interactive workplace assistant for the questions that don't fit a form — wording, decisions, structure and next steps."
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
        <div className="surface-card flex min-h-[60vh] flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-6" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">How can I help at work today?</h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                  Ask about wording, planning, structure or decisions. Aura has no access to your
                  inbox, calendar, files or the internet.
                </p>
                <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-lg border border-border bg-muted/40 p-3 text-left text-sm transition-colors hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              const isUser = message.role === "user";
              if (!text) return null;
              return (
                <div
                  key={message.id}
                  className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
                >
                  {!isUser ? (
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="size-4" aria-hidden />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "ai-output max-w-[85%] rounded-xl px-4 py-3 text-sm",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-muted/40",
                    )}
                  >
                    {text}
                  </div>
                  {isUser ? (
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <User className="size-4" aria-hidden />
                    </span>
                  ) : null}
                </div>
              );
            })}

            {isLoading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Aura is thinking…
              </p>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                The assistant couldn't respond. Please try again in a moment.
              </p>
            ) : null}

            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t border-border bg-surface p-3 sm:p-4"
          >
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={2}
                placeholder="Ask Aura anything about your work…"
                aria-label="Message"
                className="min-h-[3rem] resize-none"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter to send · Shift + Enter for a new line
            </p>
          </form>
        </div>
      </div>

      <AiDisclaimer note="Conversations stay in your browser session only and are cleared on refresh." />
    </AppShell>
  );
}
