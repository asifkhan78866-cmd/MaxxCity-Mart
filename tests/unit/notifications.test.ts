import { afterEach, describe, expect, it, vi } from "vitest";
import { notificationFields } from "@/lib/forms/define-form";
import { forms } from "@/lib/forms/registry";
import { notifyBusiness } from "@/lib/email/notify-business";
import { validPayloads } from "../support/fixtures";

describe("notification email content", () => {
  it("shows the option labels the visitor chose, not internal codes", () => {
    const data = forms.franchise.schema.parse(validPayloads.franchise);
    const rows = Object.fromEntries(notificationFields(forms.franchise, data));
    expect(rows["Commercial property"]).toBe("Yes — I have a property I can lease or rent");
    expect(rows["Investment readiness"]).toMatch(/exploring/i);
    expect(rows["Investment readiness"]).not.toBe("exploring");
  });

  it("names the collection branch", () => {
    const rows = Object.fromEntries(
      notificationFields(forms["product-request"], { branch: "adilabad-mavala", quantity: 1 }),
    );
    expect(rows["Collection branch"]).toMatch(/^MaxxCity Mart Adilabad/);
  });
});

describe("notifyBusiness", () => {
  const message = {
    subject: "Test",
    reference: "GE-261029-ABCDE",
    formLabel: "New website enquiry",
    fields: [["Message", "<b>hello</b> & bye"]] as [string, unknown][],
  };

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const configure = () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("NOTIFY_EMAIL_TO", "team@example.com, owner@example.com");
    vi.stubEnv("NOTIFY_EMAIL_FROM", "Website <website@example.com>");
  };

  it("does nothing and says so when email is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await notifyBusiness(message)).toBe("not-configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports 'sent' only when Resend accepts the message, and escapes visitor input", async () => {
    configure();
    const fetchSpy = vi.fn(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    expect(await notifyBusiness(message)).toBe("sent");
    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const payload = JSON.parse(String(init.body)) as { to: string[]; html: string };
    expect(payload.to).toEqual(["team@example.com", "owner@example.com"]);
    expect(payload.html).toContain("&lt;b&gt;hello&lt;/b&gt; &amp; bye");
    expect(payload.html).not.toContain("<b>hello</b>");
  });

  it("reports 'failed' when Resend rejects the message", async () => {
    configure();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("domain not verified", { status: 403 })));
    expect(await notifyBusiness(message)).toBe("failed");
  });

  it("reports 'failed' when Resend cannot be reached", async () => {
    configure();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    expect(await notifyBusiness(message)).toBe("failed");
  });
});
