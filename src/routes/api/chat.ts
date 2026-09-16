import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  AI_MODEL,
  RESPONSES_PROVIDER_OPTIONS,
  createResponsesProvider,
  gatewayErrorResponse,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Aura, an AI workplace productivity assistant for busy professionals.

Behaviour:
- Be concise, warm and practical. Prefer short paragraphs, bullets and clear headings.
- When the user describes work, respond with actionable structure: next steps, owners, timing.
- Ask one clarifying question only when the request cannot be answered usefully without it.
- Format output in clean markdown-ish plain text (headings, "-" bullets). Never invent facts,
  names, numbers, dates or policies. If something is unknown, say so and state the assumption.
- You cannot access the internet, company systems, files or email. Say so plainly if asked.
- Decline requests that are deceptive, discriminatory, or that require confidential data you
  were not given. Remind the user to review AI output before sending or acting on it when the
  stakes are high (HR, legal, financial, customer-facing).`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: unknown };
          if (!Array.isArray(messages)) {
            return new Response("Messages are required", { status: 400 });
          }

          const key = process.env["LOVABLE_API_KEY"];
          if (!key) return new Response("AI is not configured", { status: 500 });

          const provider = createResponsesProvider(key, getLovableAiGatewayRunId(request));
          const result = streamText({
            model: provider.responses(AI_MODEL),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
            providerOptions: RESPONSES_PROVIDER_OPTIONS,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (error) {
          return gatewayErrorResponse(error);
        }
      },
    },
  },
});
