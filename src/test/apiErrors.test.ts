import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
}));

import { api, ApiError, API_MESSAGES } from "@/lib/api";

const reply = (status: number, body: unknown) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(typeof body === "string" ? body : JSON.stringify(body), { status }),
  );

const fail = async (): Promise<ApiError> => {
  try { await api.getStats(); } catch (e) { return e as ApiError; }
  throw new Error("expected failure");
};

afterEach(() => vi.restoreAllMocks());

describe("api error mapping", () => {
  it("401 -> sign in", async () => {
    reply(401, { detail: "Invalid token" });
    const e = await fail();
    expect(e.kind).toBe("auth");
    expect(e.message).toBe(API_MESSAGES.signIn);
  });
  it("403 shows the server's upgrade text, or a default", async () => {
    reply(403, { detail: "This product is part of the Pro catalogue. Upgrade to Pro to see it." });
    const u = await fail();
    expect(u.kind).toBe("upgrade");
    expect(u.message).toBe("This product is part of the Pro catalogue. Upgrade to Pro to see it.");
    reply(403, {});
    const e = await fail();
    expect(e.kind).toBe("upgrade");
    expect(e.message).toBe(API_MESSAGES.upgrade);
  });
  it("403 confirm email", async () => {
    reply(403, { detail: "Confirm your email to use credits" });
    const e = await fail();
    expect(e.kind).toBe("confirm_email");
    expect(e.message).toBe("Confirm your email to use credits");
  });
  it("429 -> friendly rate limit", async () => {
    reply(429, { detail: "Rate limit exceeded: 30 per 1 minute" });
    expect((await fail()).message).toBe(API_MESSAGES.rateLimited);
    reply(429, "Too Many Requests");
    expect((await fail()).message).toBe(API_MESSAGES.rateLimited);
    reply(429, { detail: "An Amazon search is already running for you. Wait for it to finish." });
    const e = await fail();
    expect(e.kind).toBe("rate_limit");
    expect(e.message).toContain("Amazon search is already running");
  });
  it("403 confirm email as object detail, and bare Forbidden", async () => {
    reply(403, { detail: { code: "email_unconfirmed", message: "Confirm your email to use credits. Check your inbox for the confirmation link." } });
    expect((await fail()).kind).toBe("confirm_email");
    reply(403, { detail: "Forbidden" });
    const e = await fail();
    expect(e.kind).toBe("forbidden");
    expect(e.message).toBe(API_MESSAGES.forbidden);
  });
  it("5xx and leaky text are never shown", async () => {
    reply(500, { detail: "psycopg2.errors.UndefinedColumn: column \"x\" does not exist" });
    expect((await fail()).message).toBe(API_MESSAGES.server);
    reply(400, { detail: "Traceback (most recent call last): File main.py, line 12" });
    expect((await fail()).message).toBe(API_MESSAGES.generic);
    reply(400, "<html>bad gateway</html>");
    expect((await fail()).message).toBe(API_MESSAGES.generic);
  });
  it("keeps detail codes for callers", async () => {
    reply(402, { detail: { code: "no_credits", message: "No credits left" } });
    const e = await fail();
    expect(e.code).toBe("no_credits");
    expect(e.message).toBe("No credits left");
  });
  it("402 without a code is an upgrade prompt", async () => {
    reply(402, { detail: "The listing generator is a Pro feature" });
    const e = await fail();
    expect(e.kind).toBe("upgrade");
    expect(e.message).toBe("The listing generator is a Pro feature");
    reply(402, { detail: { code: "no_credits", message: "No credits left" } });
    expect((await fail()).kind).not.toBe("upgrade");
  });
  it("network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    expect((await fail()).message).toBe(API_MESSAGES.network);
  });
});
