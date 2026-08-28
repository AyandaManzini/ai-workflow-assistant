import { useCallback, useEffect, useState } from "react";

export type HistoryKind = "email" | "plan" | "research" | "chat";

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  createdAt: number;
  pinned?: boolean;
}

const STORAGE_KEY = "awpa:history:v1";
const EVENT = "awpa:history-changed";
const MAX_ITEMS = 200;

function isBrowser() {
  return typeof window !== "undefined";
}

export function readHistory(): HistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: HistoryItem[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage full or unavailable — history is a convenience, not a requirement */
  }
}

export function saveHistoryItem(input: Omit<HistoryItem, "id" | "createdAt">): HistoryItem {
  const item: HistoryItem = {
    ...input,
    id:
      isBrowser() && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: Date.now(),
  };
  writeHistory([item, ...readHistory()]);
  return item;
}

export function deleteHistoryItem(id: string) {
  writeHistory(readHistory().filter((item) => item.id !== id));
}

export function togglePinHistoryItem(id: string) {
  writeHistory(
    readHistory().map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
  );
}

export function clearHistory() {
  writeHistory([]);
}

/** Live view of the saved history. Hydration-safe: empty on the server. */
export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const sync = useCallback(() => setItems(readHistory()), []);

  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return items;
}

export function countByKind(items: HistoryItem[], kind: HistoryKind) {
  return items.filter((item) => item.kind === kind).length;
}

export function countThisWeek(items: HistoryItem[], kind?: HistoryKind) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return items.filter((item) => item.createdAt >= cutoff && (!kind || item.kind === kind)).length;
}

export function formatWhen(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export const KIND_LABEL: Record<HistoryKind, string> = {
  email: "Email",
  plan: "Task plan",
  research: "Research",
  chat: "Chat",
};
