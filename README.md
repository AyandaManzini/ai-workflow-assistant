# AI Workflow Assistant

Lovable Build Prompt — AI Workplace Productivity Assistant

Build a responsive, modern SaaS-style web app called "AI Workplace Productivity Assistant" that helps professionals automate workplace tasks using AI. No backend, no database, no login/signup — fully client-side, with structured AI-style outputs that are editable.

Design System

Theme: dark, professional — black/near-black background with deep blue (#0B1F3A) panels and a bright blue accent (#2E75B6 or #3B82F6) for buttons, links, active states, and highlights

Clean SaaS aesthetic: rounded cards, subtle shadows, generous whitespace, modern sans-serif (Inter or Poppins)

Persistent left sidebar navigation with icons: Dashboard, Email Generator, Task Planner, Research Assistant, Chatbot

Top bar with app logo/name and a "Responsible AI" info icon (opens the disclaimer)

Fully responsive: sidebar collapses into a hamburger/bottom nav on mobile

Pages

1. Dashboard Welcome banner + quick-access cards to the four tools; a few placeholder stat widgets (e.g. "Emails generated," "Tasks planned") for visual polish.

2. Smart Email Generator

Inputs: recipient, context/key points (textarea), tone selector (Formal / Friendly / Persuasive)

"Generate Email" button produces a structured, editable draft in an output box

Copy-to-clipboard button

3. AI Task Planner

Inputs: add/remove task rows, timeframe toggle (Daily / Weekly), priority per task

"Generate Schedule" produces a prioritized, structured plan (table or timeline by day/time block), editable

Color-coded priority tags (High / Medium / Low)

4. AI Research Assistant

Input: topic or pasted article text

"Summarise" produces a structured output with clear sections: Key Points, Insights, Recommendations

Editable output, copy button

5. AI Chatbot Interface

Simple chat UI: message bubbles, input box, send button

Simulated responses to general workplace prompts

Scrollable session-only history (no persistence needed)

Technical Requirements

No backend, no database, no authentication — fully static/client-side

Generate all "AI" outputs using structured client-side prompt templates/logic that mimic real AI responses, written so a real AI API call could be swapped in later without restructuring the UI

Every AI-generated output must be editable before copying/using

Include a visible Responsible AI disclaimer (footer + info modal): "This tool uses AI-assisted content generation. Outputs may be inaccurate or incomplete — please review and edit before professional use."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a8727a3e-4f5c-4583-94cc-2e226429bbdb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
