/**
 * Crawl + extract. Turns a live URL into a deterministic WebsiteSnapshot the
 * agent reasons over. `extractFromHtml` is pure (no network) so it can be
 * unit-tested with fixture HTML.
 */
import * as cheerio from "cheerio";
import type { WebsiteSnapshot } from "./schema";

const CTA_WORDS = [
  "get started", "sign up", "signup", "buy", "shop", "contact", "book", "subscribe",
  "learn more", "request", "get quote", "get a quote", "call", "order", "download",
  "try", "demo", "start", "join", "register", "enquire", "inquire", "get in touch",
];

const TRUST_KEYWORDS: Record<string, string> = {
  testimonial: "Testimonials",
  review: "Reviews",
  rated: "Ratings",
  guarantee: "Guarantee",
  "money-back": "Money-back guarantee",
  refund: "Refund policy",
  certified: "Certifications",
  award: "Awards",
  secure: "Security cues",
  ssl: "SSL/Security",
  "privacy policy": "Privacy policy",
  clients: "Client logos",
  trusted: "Trust language",
};

const SOCIAL_DOMAINS = ["facebook.com", "instagram.com", "twitter.com", "x.com", "linkedin.com", "youtube.com", "tiktok.com"];

const CTA_RE = new RegExp(
  "\\b(" + CTA_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "i",
);

function isCta(text: string): boolean {
  const t = text.trim();
  if (!t || t.length > 40) return false;
  return CTA_RE.test(t); // word-boundary match avoids e.g. "Facebook" matching "book"
}

/** Pure extraction from raw HTML — unit-testable. */
export function extractFromHtml(
  html: string,
  markdown: string,
  url: string,
  meta?: { title?: string; description?: string; statusCode?: number; finalUrl?: string },
): WebsiteSnapshot {
  const $ = cheerio.load(html);
  let base: URL | null = null;
  try {
    base = new URL(meta?.finalUrl ?? url);
  } catch {
    base = null;
  }

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 10);
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 20);

  // Navigation links (prefer <nav>/<header>)
  const navLinks = $("nav a, header a")
    .map((_, el) => ({ text: $(el).text().trim(), href: $(el).attr("href") ?? "" }))
    .get()
    .filter((l) => l.text && l.href)
    .slice(0, 30);

  // CTAs from buttons + action links
  const ctaSet = new Set<string>();
  $("button, a, input[type=submit]").each((_, el) => {
    const text = $(el).attr("value") ?? $(el).text();
    if (text && isCta(text)) ctaSet.add(text.trim());
  });
  const ctas = [...ctaSet].slice(0, 20);

  // Forms
  const forms = $("form")
    .map((_, form) => {
      const fields = $(form).find("input, textarea, select").length;
      const hasEmail = $(form).find('input[type=email], input[name*=email i]').length > 0;
      return { fields, hasEmail };
    })
    .get()
    .slice(0, 10);

  // Images
  const imgs = $("img");
  const imageCount = imgs.length;
  const imagesMissingAlt = imgs.filter((_, el) => !($(el).attr("alt") ?? "").trim()).length;

  // Links (internal vs external) + social
  const internalSet = new Set<string>();
  const socialSet = new Set<string>();
  let externalLinkCount = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const u = base ? new URL(href, base) : new URL(href);
      if (base && u.hostname === base.hostname) {
        internalSet.add(u.pathname);
      } else {
        externalLinkCount++;
        if (SOCIAL_DOMAINS.some((d) => u.hostname.includes(d))) socialSet.add(u.hostname);
      }
    } catch {
      /* ignore malformed */
    }
  });

  const scriptCount = $("script").length;
  const hasViewportMeta = $('meta[name=viewport]').length > 0;
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  // Trust signals (text + structural)
  const lowerText = `${markdown} ${bodyText}`.toLowerCase();
  const detected = new Set<string>();
  for (const [kw, label] of Object.entries(TRUST_KEYWORDS)) {
    if (lowerText.includes(kw)) detected.add(label);
  }
  if ($('a[href^="tel:"]').length) detected.add("Phone number");
  if ($('a[href^="mailto:"]').length) detected.add("Email contact");
  if ((base?.protocol ?? "https:") === "https:") detected.add("HTTPS");
  if (/\b\d{1,4}\s+\w+\s+(street|st|road|rd|ave|avenue|blvd|lane|ln)\b/i.test(bodyText)) {
    detected.add("Physical address");
  }

  const title = meta?.title ?? ($("title").first().text().trim() || undefined);
  const metaDescription =
    meta?.description ?? $('meta[name=description]').attr("content")?.trim() ?? undefined;

  return {
    url,
    finalUrl: meta?.finalUrl,
    statusCode: meta?.statusCode,
    title,
    metaDescription,
    hasViewportMeta,
    h1,
    h2,
    navLinks,
    ctas,
    forms,
    imageCount,
    imagesMissingAlt,
    internalLinks: [...internalSet].slice(0, 40),
    externalLinkCount,
    scriptCount,
    wordCount,
    socialLinks: [...socialSet],
    detectedTrustSignals: [...detected],
    pageSpeedMeasured: false,
    contentPreview: (markdown || bodyText).slice(0, 6000),
  };
}

/** Normalize the Firecrawl result across possible SDK response shapes. */
function normalizeScrape(res: any): {
  html: string;
  markdown: string;
  metadata: { title?: string; description?: string; statusCode?: number; finalUrl?: string };
} {
  const doc = res?.data ?? res ?? {};
  const md = doc.metadata ?? {};
  return {
    html: doc.html ?? "",
    markdown: doc.markdown ?? "",
    metadata: {
      title: md.title ?? md.ogTitle,
      description: md.description ?? md.ogDescription,
      statusCode: md.statusCode,
      finalUrl: md.url ?? md.sourceURL,
    },
  };
}

/** Scrape a URL and build the snapshot. */
export async function crawlAndExtract(url: string): Promise<WebsiteSnapshot> {
  const { scrapePage } = await import("@/lib/firecrawl/client");
  const raw = await scrapePage(url, ["markdown", "html"]);
  const { html, markdown, metadata } = normalizeScrape(raw);

  if (!html && !markdown) {
    throw new Error(`Firecrawl returned no content for ${url}. Is the URL reachable?`);
  }
  // If HTML is missing, cheerio still parses markdown-as-text gracefully.
  return extractFromHtml(html || `<body>${markdown}</body>`, markdown, url, metadata);
}
