export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INTENTS: { match: RegExp; reply: string }[] = [
  {
    match: /meeting|agenda|standup|stand-up/i,
    reply:
      "For a tighter meeting, try this structure:\n\n1. Purpose in one sentence, sent in advance\n2. Three agenda items max, each with an owner and a time box\n3. Decisions and actions captured live\n4. A two-line recap sent within the hour\n\nIf there's no decision to make, a written update usually replaces the meeting.",
  },
  {
    match: /email|inbox|reply|follow.?up/i,
    reply:
      "A reliable email rhythm:\n\n• Process the inbox in two fixed blocks a day rather than continuously\n• Answer anything under two minutes immediately\n• Convert the rest into tasks with a due date\n• Keep replies to one ask per message so the response is easy\n\nThe Email Generator tab can draft the message for you.",
  },
  {
    match: /deadline|late|behind|overdue|time manage/i,
    reply:
      "When a deadline is at risk, communicate early and specifically:\n\n1. State the new realistic date\n2. Explain the single biggest cause\n3. Offer a reduced-scope option that still hits the original date\n\nThen protect two uninterrupted blocks per day for the critical path work.",
  },
  {
    match: /feedback|review|performance|one.?on.?one/i,
    reply:
      "Useful feedback is situation, behaviour, impact:\n\n• Situation — \"In yesterday's client call…\"\n• Behaviour — \"…you walked through the pricing without the discount context…\"\n• Impact — \"…which left the client unsure about the final figure.\"\n\nClose with one concrete change to try next time.",
  },
  {
    match: /delegat|priorit|workload|too much|overwhelm/i,
    reply:
      "Sort the workload before adding hours:\n\n• High — moves a commitment forward this week; do it yourself in a focus block\n• Medium — necessary but not urgent; schedule it\n• Low — delegate, automate or drop\n\nThe Task Planner tab turns that list into a time-blocked schedule.",
  },
  {
    match: /report|summar|research|document/i,
    reply:
      "Write the summary first, then the detail: one paragraph of conclusion, three supporting points, and the evidence in an appendix. Most readers stop after the first paragraph, so it has to stand alone. The Research Assistant tab can produce that structure from your notes.",
  },
];

const FALLBACK =
  "Here's how I'd approach that:\n\n1. Define the outcome you want in a single sentence\n2. List the two or three steps that actually move it forward\n3. Block time for the first step today and note who else needs to be involved\n\nTell me more about the situation and I can be more specific.";

/**
 * Simulated assistant reply.
 * Swap the body of this function for a real AI call; the shape stays the same.
 */
export async function chatReply(prompt: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const intent = INTENTS.find((entry) => entry.match.test(prompt));
  return intent ? intent.reply : FALLBACK;
}
