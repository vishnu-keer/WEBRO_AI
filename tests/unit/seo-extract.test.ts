import { describe, it, expect } from "vitest";
import { extractFromHtml, parseRobots } from "@/agents/seo/extract";

const HTML = `<html lang="en"><head>
<title>Acme — Web Studio</title>
<meta name="description" content="We build fast, modern websites for local businesses.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://acme.com/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Acme">
<script type="application/ld+json">{"@type":"Organization","name":"Acme"}</script>
<script type="application/ld+json">{"@type":"FAQPage"}</script>
</head><body>
<h1>Acme Web Studio</h1><h2>Services</h2>
<a href="/about">About</a><a href="https://twitter.com/acme">Twitter</a>
<img src="a.jpg"><img src="b.jpg" alt="b">
</body></html>`;

describe("seo extractFromHtml", () => {
  const s = extractFromHtml(HTML, "Acme content", "https://acme.com");
  it("reads metadata + canonical + lang", () => {
    expect(s.title).toContain("Acme");
    expect(s.metaRobots).toBe("index,follow");
    expect(s.canonical).toBe("https://acme.com/");
    expect(s.lang).toBe("en");
    expect(s.hasViewportMeta).toBe(true);
    expect(s.isHttps).toBe(true);
  });
  it("detects structured data + FAQ", () => {
    expect(s.jsonLdCount).toBe(2);
    expect(s.schemaTypes).toContain("Organization");
    expect(s.hasFaqSchema).toBe(true);
  });
  it("counts headings, links, images", () => {
    expect(s.h1Count).toBe(1);
    expect(s.internalLinkCount).toBe(1);
    expect(s.externalLinkCount).toBe(1);
    expect(s.imagesMissingAlt).toBe(1);
  });
});

describe("parseRobots", () => {
  const r = parseRobots("User-agent: *\nDisallow: /private\nUser-agent: GPTBot\nDisallow: /\nSitemap: https://acme.com/sitemap.xml");
  it("finds sitemap directive", () => {
    expect(r.hasSitemap).toBe(true);
  });
  it("detects a blocked AI crawler", () => {
    expect(r.aiCrawlers.find((c) => c.bot === "GPTBot")?.allowed).toBe(false);
    expect(r.aiCrawlers.find((c) => c.bot === "ClaudeBot")?.allowed).toBe(true);
  });
});
