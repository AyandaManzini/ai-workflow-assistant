# AI Workplace Productivity Assistant

A dark, SaaS-style, fully client-side app with four AI-style tools. No backend, no login, no database. All "AI" outputs come from structured client-side template logic, written behind a single generator interface so a real AI call can replace it later without touching the UI.

## Design system

- Near-black background, deep blue panels (#0B1F3A), bright blue accent (#3B82F6) for buttons, links, active nav, highlights.
- Inter, rounded cards, soft shadows, generous spacing. All colors as semantic tokens in the stylesheet — no hardcoded color classes in components.
- Shell: persistent left sidebar (Dashboard, Email Generator, Task Planner, Research Assistant, Chatbot) + top bar with app name and a "Responsible AI" info icon that opens the disclaimer modal. Footer carries the disclaimer text on every page.
- Mobile: sidebar collapses to a hamburger drawer, with a bottom nav bar for the five destinations.

## Pages

1. **Dashboard** (`/`) — welcome banner, four quick-access tool cards, placeholder stat widgets (Emails generated, Tasks planned, Summaries created, Chats).
2. **Email Generator** (`/email`) — recipient input, context/key points textarea, tone selector (Formal / Friendly / Persuasive). Generate produces a structured draft (subject, greeting, body from key points, closing) in an editable textarea with a copy button.
3. **Task Planner** (`/planner`) — add/remove task rows, each with a priority (High / Medium / Low), plus a Daily/Weekly toggle. Generate produces a prioritized schedule: day/time-block rows for weekly, time-block rows for daily. Output is an editable table with color-coded priority tags; copy as text.
4. **Research Assistant** (`/research`) — topic or pasted article textarea. Summarise produces sections Key Points, Insights, Recommendations; each section editable, copy button for the whole output.
5. **Chatbot** (`/chat`) — message bubbles, input, send. Simulated replies keyed on workplace intents (meetings, email, deadlines, feedback, delegation) with a sensible fallback, small typing delay. Session-only history, scrollable, auto-scroll to newest.

## Editability and copy

Every generated output renders into editable state (textarea / contenteditable table cells), so the user can revise before copying. Copy buttons use the clipboard API with a toast confirmation.

## Responsible AI

- Fixed footer line: "This tool uses AI-assisted content generation. Outputs may be inaccurate or incomplete — please review and edit before professional use."
- Same text in the top-bar info modal, with a short note on reviewing outputs before professional use.

## Technical notes

- TanStack Start file routes: `index.tsx`, `email.tsx`, `planner.tsx`, `research.tsx`, `chat.tsx`; shared shell (sidebar, top bar, footer, modal) in `__root.tsx`. Each route gets its own head() title/description/og tags.
- Generator logic in `src/lib/ai/` — one module per tool exposing an async function (`generateEmail`, `generatePlan`, `summarise`, `chatReply`) that returns a typed structured object. Templates are pure functions inside those modules; swapping in a real API means changing only the function body.
- State is local React state per page; no persistence, no storage.
- Sonner for toasts, shadcn primitives (button, card, input, textarea, select, dialog, badge, table) for UI.
