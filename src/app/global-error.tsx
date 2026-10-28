"use client"; // Error boundaries must be Client Components.

import { contact } from "@/content/contact";

/**
 * Last-resort page for errors in the root layout itself. It replaces the
 * whole document, so it brings its own <html>, <body> and inline styles.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#121c1f", background: "#ffffff" }}>
        <title>Something went wrong | MaxxCity Mart</title>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 16px" }}>
          <p style={{ color: "#0b8245", fontWeight: 700, letterSpacing: "0.12em", fontSize: 13, textTransform: "uppercase" }}>
            MaxxCity Mart
          </p>
          <h1 style={{ fontSize: 34, lineHeight: 1.15, margin: "12px 0 16px" }}>Something went wrong</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#46524f" }}>
            Please try again. You can also call or WhatsApp us on{" "}
            <a href={`tel:${contact.phoneE164}`} style={{ color: "#0155a8", fontWeight: 600 }}>
              {contact.phoneDisplay}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              minHeight: 48,
              padding: "0 24px",
              borderRadius: 999,
              border: 0,
              background: "#0155a8",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
