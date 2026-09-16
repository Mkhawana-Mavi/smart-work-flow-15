import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import {
  AI_MODEL,
  RESPONSES_PROVIDER_OPTIONS,
  createResponsesProvider,
  gatewayErrorResponse,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

type Body = { system?: unknown; prompt?: unknown };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { system, prompt } = (await request.json()) as Body;
          if (typeof prompt !== "string" || !prompt.trim()) {
            return new Response(JSON.stringify({ error: "Prompt is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const key = process.env["LOVABLE_API_KEY"];
          if (!key) {
            return new Response(JSON.stringify({ error: "AI is not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const provider = createResponsesProvider(key, getLovableAiGatewayRunId(request));
          const result = streamText({
            model: provider.responses(AI_MODEL),
            system: typeof system === "string" ? system : undefined,
            prompt,
            providerOptions: RESPONSES_PROVIDER_OPTIONS,
          });

          return result.toTextStreamResponse();
        } catch (error) {
          return gatewayErrorResponse(error);
        }
      },
    },
  },
});
