/* Minimal render helpers on react-dom (no @testing-library/react: its peer @testing-library/dom is
   not in package.json / bun.lock, so the old productsPage test could not even load). */
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { ReactElement } from "react";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let host: HTMLElement | null = null;

export function render(ui: ReactElement) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(ui));
  return host;
}

export function cleanup() {
  if (root) act(() => root!.unmount());
  host?.remove();
  root = null; host = null;
}

const textOf = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

/** Elements whose own text (all descendants) equals `text`, innermost first. */
export function allByText(text: string): Element[] {
  const all = Array.from(document.body.querySelectorAll("*"));
  const ownText = (el: Element) => Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent ?? "").join("").replace(/\s+/g, " ").trim();
  return all.filter((el) => ownText(el) === text ||
    (textOf(el) === text && !Array.from(el.children).some((c) => textOf(c) === text)));
}

export function buttonsNamed(name: string): Element[] {
  return Array.from(document.body.querySelectorAll("button")).filter((b) => textOf(b) === name);
}

export async function waitFor<T>(fn: () => T, timeout = 4000): Promise<T> {
  const t0 = Date.now();
  let last: unknown;
  for (;;) {
    try { return fn(); } catch (e) { last = e; }
    if (Date.now() - t0 > timeout) throw last;
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
  }
}
