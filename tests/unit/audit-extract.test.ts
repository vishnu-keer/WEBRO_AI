import { describe, it, expect } from "vitest";
import { extractFromHtml } from "@/agents/website-audit/extract";

const HTML = `<html><head>
<title>Acme Studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="We build beautiful websites">
</head><body>
<nav><a href="/about">About</a><a href="/contact">Contact</a></nav>
<h1>Welcome to Acme</h1><h2>Our Services</h2>
<a class="btn" href="/signup">Get Started</a>
<form><input type="email" name="email"><button type="submit">Subscribe</button></form>
<img src="a.jpg"><img src="b.jpg" alt="b">
<a href="https://facebook.com/acme">Facebook</a>
<a href="tel:+15551234">Call us</a>
<p>Trusted by thousands. Read our testimonials and reviews.</p>
</body></html>`;

describe("extractFromHtml", () => {
  const s = extractFromHtml(HTML, "Welcome to Acme. Trusted by thousands.", "https://acme.com");

  it("extracts meta + headings", () => {
    expect(s.title).toBe("Acme Studio");
    expect(s.metaDescription).toContain("beautiful");
    expect(s.hasViewportMeta).toBe(true);
    expect(s.h1).toContain("Welcome to Acme");
    expect(s.h2).toContain("Our Services");
  });
  it("finds CTAs, forms, nav", () => {
    expect(s.ctas.length).toBeGreaterThan(0);
    expect(s.forms[0]?.hasEmail).toBe(true);
    expect(s.navLinks.length).toBe(2);
  });
  it("counts images + missing alt", () => {
    expect(s.imageCount).toBe(2);
    expect(s.imagesMissingAlt).toBe(1);
  });
  it("detects trust + social signals", () => {
    expect(s.detectedTrustSignals).toContain("Testimonials");
    expect(s.detectedTrustSignals).toContain("Phone number");
    expect(s.socialLinks.some((x) => x.includes("facebook"))).toBe(true);
  });
});
