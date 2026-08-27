export interface ResearchSummary {
  keyPoints: string;
  insights: string;
  recommendations: string;
}

function sentences(input: string): string[] {
  return input
    .split(/\n|(?<=[.!?])\s+/)
    .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
    .filter((line) => line.length > 0);
}

function trim(value: string, max = 160): string {
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

/**
 * Structured, template-driven summarisation.
 * Swap the body of this function for a real AI call; the shape stays the same.
 */
export async function summarise(input: string): Promise<ResearchSummary> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lines = sentences(input);
  const topic = trim(lines[0] ?? input.trim(), 70) || "the submitted material";
  const isShortTopic = lines.length <= 1 && input.trim().length < 120;

  const points = isShortTopic
    ? [
        `Scope: ${topic} spans current practice, tooling and measurable outcomes.`,
        `Stakeholders: teams adopting ${topic} report the biggest gains where processes are already documented.`,
        `Constraints: budget, change management and data quality are the usual blockers.`,
        `Signal: early adopters focus on one workflow before scaling.`,
      ]
    : lines.slice(0, 6).map((line, index) => `${index + 1}. ${trim(line)}`);

  const insights = isShortTopic
    ? [
        `The value of ${topic} concentrates in repetitive, high-volume work.`,
        "Adoption fails more often on process than on technology.",
        "Measurable baselines make the impact defensible to leadership.",
      ]
    : [
        `The material centres on ${topic}.`,
        lines.length > 6
          ? `There are ${lines.length} distinct statements; the later ones mostly reinforce the opening claims.`
          : "The argument is compact and each statement carries weight.",
        "Claims that lack supporting figures should be verified before reuse.",
      ];

  const recommendations = [
    "Pick one workflow to pilot and define a success metric before starting.",
    "Timebox a two-week review, then decide to scale, adjust or stop.",
    "Share a short written summary with stakeholders to align expectations.",
    "Verify any statistics or quotes against the original source.",
  ];

  return {
    keyPoints: points.map((point) => `• ${point.replace(/^\d+\.\s*/, "")}`).join("\n"),
    insights: insights.map((line) => `• ${line}`).join("\n"),
    recommendations: recommendations.map((line) => `• ${line}`).join("\n"),
  };
}

export function summaryToText(summary: ResearchSummary): string {
  return [
    "KEY POINTS",
    summary.keyPoints,
    "",
    "INSIGHTS",
    summary.insights,
    "",
    "RECOMMENDATIONS",
    summary.recommendations,
  ].join("\n");
}
