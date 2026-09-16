import { useCallback, useRef, useState } from "react";

type RunArgs = { system: string; prompt: string };

export function useAiStream() {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  const run = useCallback(async ({ system, prompt }: RunArgs) => {
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;

    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, prompt }),
        signal: ac.signal,
      });

      if (!response.ok || !response.body) {
        let message = `Request failed (${response.status})`;
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          /* keep default message */
        }
        if (response.status === 429) message = "Too many requests right now — try again shortly.";
        if (response.status === 402) message = "AI credits are exhausted for this workspace.";
        throw new Error(message);
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let text = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        text += value;
        setOutput(text);
      }
      if (!text.trim()) {
        setError("The assistant returned an empty response. Try rephrasing your input.");
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError((err as Error)?.message ?? "Something went wrong.");
    } finally {
      if (controller.current === ac) setIsRunning(false);
    }
  }, []);

  const stop = useCallback(() => {
    controller.current?.abort();
    setIsRunning(false);
  }, []);

  return { output, setOutput, isRunning, error, run, stop };
}
