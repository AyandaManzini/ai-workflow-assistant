export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "draft"
  );
}

export function downloadTextFile(filename: string, contents: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Wraps plain output in a titled markdown document. */
export function toMarkdown(title: string, body: string) {
  return `# ${title}\n\n${body}\n\n---\n\n_Generated with AI Workplace Productivity Assistant. Review before professional use._\n`;
}

export function printText(title: string, body: string) {
  if (typeof window === "undefined") return;
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  const escape = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  win.document.write(
    `<!doctype html><html><head><title>${escape(title)}</title><style>body{font:14px/1.6 -apple-system,Segoe UI,sans-serif;padding:40px;max-width:720px;margin:auto;white-space:pre-wrap}h1{font-size:20px}</style></head><body><h1>${escape(
      title,
    )}</h1>${escape(body)}</body></html>`,
  );
  win.document.close();
  win.focus();
  win.print();
}
