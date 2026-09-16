# Aura — AI Workplace Productivity Assistant

This project was built with [Lovable](https://lovable.dev).
## Project overview

## Build with Lovable
Aura is a modern, responsive web application that helps busy professionals with everyday knowledge work. Instead of a blank AI chat box, it provides focused, task-specific workflows: drafting professional emails, turning messy meeting notes into structured summaries, planning a realistic schedule, researching a topic, and asking an assistant anything in between.

Open your project in the [Lovable editor](https://lovable.dev) and keep building.
The app is built around responsible AI practices — every tool sends a task-specific, role-based prompt, all outputs are editable and reviewable, and clear disclaimers remind users that AI output can be wrong and should never include confidential data.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.
## Features

## Development
- **Dashboard** — workspace overview with quick access to all five tools, plus guidance on how Aura works.
- **Smart Email Generator** — draft professional email in Formal, Friendly, Persuasive, Apologetic, or Direct & concise tones, with short/medium/detailed length control.
- **Meeting Notes Summarizer** — converts raw meeting notes into structured output with decisions, action items, and deadlines at Executive, Standard, or Detailed depth.
- **AI Task Planner** — prioritises your task list into a daily or weekly plan using Eisenhower, MoSCoW, Impact vs effort, or Deadline-first frameworks, accounting for working hours and peak energy times.
- **AI Research Assistant** — produces summaries, insights, and recommendations on any topic at Quick brief, Standard, or Deep dive depth, tailored to your audience and goal.
- **Assistant Chat** — streaming AI chat for anything else about your work, with conversation history and suggestion chips.
- **Responsive design** — full sidebar navigation on desktop, collapsible mobile navigation.
- **Editable, exportable outputs** — every result streams in, stays fully editable, and can be copied or downloaded as a `.txt` file.
- **Responsible AI** — disclaimers on every tool, no invented facts in prompts, and guidance to review output before sending or acting on it.

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
## Tools used

- **TanStack Start** (React 19, TanStack Router) — full-stack framework with server functions and file-based routing
- **TypeScript**
- **Tailwind CSS v4** — styling with a custom design token system
- **shadcn-style UI components**
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) — streaming AI responses
- **Lovable AI Gateway** — hosted model access (streaming completions)
- **TanStack Query** — data fetching and caching
- **lucide-react** — icons
- **Lovable** — development platform, preview, and deployment

## Setup instructions

### Run in Lovable (recommended)

Open the project in the [Lovable editor](https://lovable.dev) — the preview runs automatically and the AI integration is pre-configured.

### Run locally

You need Node.js (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone <this-repository-url>
npm run dev
```

## Built with
The app runs at `http://localhost:8080`.

- TanStack Start
- TypeScript
- React
- Tailwind CSS
### AI configuration

The app streams responses through the Lovable AI Gateway using the `LOVABLE_API_KEY` environment variable. When running locally outside Lovable, set the key in a `.env` file before starting the dev server.

## Team members (if applicable)

| Name | Role |
| --- | --- |
| _Add your team here_ | |

