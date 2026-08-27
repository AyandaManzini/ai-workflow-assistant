export type EmailTone = "formal" | "friendly" | "persuasive";

export interface EmailRequest {
  recipient: string;
  context: string;
  tone: EmailTone;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

const OPENERS: Record<EmailTone, (name: string) => string> = {
  formal: (name) => `Dear ${name},\n\nI hope this message finds you well.`,
  friendly: (name) => `Hi ${name},\n\nHope you're having a good week!`,
  persuasive: (name) => `Hi ${name},\n\nI wanted to share something I believe is worth your time.`,
};

const CLOSERS: Record<EmailTone, string> = {
  formal: "Thank you for your time and consideration.\n\nKind regards,\n[Your name]",
  friendly: "Thanks so much — let me know what you think!\n\nBest,\n[Your name]",
  persuasive:
    "I'd welcome the chance to discuss this further at your convenience.\n\nBest regards,\n[Your name]",
};

const BRIDGES: Record<EmailTone, string> = {
  formal: "I am writing regarding the following points:",
  friendly: "Here's a quick rundown of what I had in mind:",
  persuasive: "Here's why this matters:",
};

function toPoints(context: string): string[] {
  return context
    .split(/\n|(?<=[.!?])\s+(?=[A-Z])/)
    .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
    .filter(Boolean);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Structured, template-driven email generation.
 * Swap the body of this function for a real AI call; the shape stays the same.
 */
export async function generateEmail(request: EmailRequest): Promise<EmailDraft> {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const recipient = request.recipient.trim() || "there";
  const firstName = recipient.split(/\s+/)[0];
  const points = toPoints(request.context);
  const topic = points[0] ? titleCase(points[0].slice(0, 60)) : "Quick update";

  const subjectPrefix: Record<EmailTone, string> = {
    formal: "Regarding",
    friendly: "Quick note:",
    persuasive: "An opportunity:",
  };

  const bulletBlock = points.length
    ? points.map((point) => `• ${titleCase(point)}`).join("\n")
    : "• [Add the key points you'd like to cover]";

  const body = [
    OPENERS[request.tone](firstName),
    "",
    BRIDGES[request.tone],
    "",
    bulletBlock,
    "",
    request.tone === "persuasive"
      ? "Acting on this now keeps us ahead of the deadline and avoids rework later."
      : "Please let me know if anything above needs clarification or adjustment.",
    "",
    CLOSERS[request.tone],
  ].join("\n");

  return {
    subject: `${subjectPrefix[request.tone]} ${topic}`,
    body,
  };
}
