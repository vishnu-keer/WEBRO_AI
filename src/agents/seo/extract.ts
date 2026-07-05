/**
 * SEO crawl + extraction. Builds a deterministic SeoSnapshot from the homepage
 * (Firecrawl + cheerio) plus robots.txt and sitemap.xml (plain fetch — they're
 * public text/xml, no rendering needed). `extractFromHtml` is pure + unit-testable.
 */
import * as cheerio from "cheerio";
import type { SeoSnapshot } from "./schema";

const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot", "Google-Extended"];

/** Pure homepage extraction (no network). robots/sitemap/AI fields default here. */
export function extractFromHtml(
  html: string,
  markdown: string,
  url: string,
  meta?: { title?: string; description?: string; statusCode?: number; finalUrl?: string },
): SeoSnapshot {
  const $ = cheerio.load(html);
  let base: URL | null = null;
  try {
    base = new URL(meta?.finalUrl ?? url);
  } catch {
    base = null;
  }

  const title = meta?.title ?? ($("title").first().text().trim() || undefined);
  const metaDescription =
    meta?.description ?? ($('meta[name="description"]').attr("content")?.trim() || undefined);
  const metaRobots = $('meta[name="robots"]').attr("content")?.trim() || undefined;
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || undefined;
  const lang = $("html").attr("lang")?.trim() || undefined;

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 10);
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;

  const imgs = $("img");
  const imageCount = imgs.length;
  const imagesMissingAlt = imgs.filter((_, el) => !($(el).attr("alt") ?? "").trim()).length;

  let internalLinkCount = 0;
  let externalLinkCount = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const u = base ? new URL(href, base) : new URL(href);
      if (base && u.hostname === base.hostname) internalLinkCount++;
      else externalLinkCount++;
    } catch {
      /* ignore */
    }
  });

  const openGraphCount = $('meta[property^="og:"]').length;
  const hasTwitterCard = $('meta[name^="twitter:"]').length > 0;

  // Structured data (JSON-LD)
  const schemaTypes = new Set<string>();
  let jsonLdCount = 0;
  $('script[type="application/ld+json"]').each((_, el) => {
    jsonLdCount++;
    try {
      const json = JSON.parse($(el).text());
      collectTypes(json, schemaTypes);
    } catch {
      /* invalid JSON-LD */
    }
  });

  const hasViewportMeta = $('meta[name="viewport"]').length > 0;
  const isHttps = (base?.protocol ?? "https:") === "https:";
  let mixedContentCount = 0;
  if (isHttps) {
    $("img[src], script[src], link[href]").each((_, el) => {
      const v = $(el).attr("src") ?? $(el).attr("href") ?? "";
      if (v.startsWith("http://")) mixedContentCount++;
    });
  }

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  return {
    url,
    finalUrl: meta?.finalUrl,
    statusCode: meta?.statusCode,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    metaRobots,
    canonical,
    lang,
    h1,
    h1Count,
    h2Count,
    h3Count,
    wordCount,
    imageCount,
    imagesMissingAlt,
    internalLinkCount,
    externalLinkCount,
    openGraphCount,
    hasTwitterCard,
    jsonLdCount,
    schemaTypes: [...schemaTypes],
    hasFaqSchema: [...schemaTypes].some((t) => t.toLowerCase() === "faqpage"),
    hasViewportMeta,
    isHttps,
    mixedContentCount,
    // network-derived fields — filled by crawlAndExtractSeo:
    robotsTxtFound: false,
    robotsTxtHasSitemap: false,
    sitemapFound: false,
    aiCrawlers: [],
    scriptCount: $("script").length,
    stylesheetCount: $('link[rel="stylesheet"]').length,
    pageSpeedMeasured: false,
    contentPreview: (markdown || bodyText).slice(0, 5000),
  };
}

function collectTypes(node: unknown, out: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectTypes(n, out));
    return;
  }
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && out.add(x));
  if (Array.isArray(obj["@graph"])) collectTypes(obj["@graph"], out);
}

/** Fetch plain text with a timeout and a browser-like UA. Returns null on error. */
async function fetchText(target: string, timeoutMs = 8000): Promise<{ status: number; text: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(target, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (compatible; WebroSEOBot/1.0)" },
      redirect: "follow",
    });
    const text = await res.text();
    return { status: res.status, text };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Parse robots.txt: which AI crawlers are allowed + sitemap directive. */
export function parseRobots(text: string): {
  hasSitemap: boolean;
  sitemapUrl?: string;
  aiCrawlers: { bot: string; allowed: boolean }[];
} {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const groups: Record<string, string[]> = {};
  let current: string[] = [];
  let sitemapUrl: string | undefined;

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).toLowerCase().trim();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      const ua = value.toLowerCase();
      current = groups[ua] = groups[ua] ?? [];
    } else if (key === "disallow") {
      current.push(value);
    } else if (key === "sitemap") {
      sitemapUrl = value;
    }
  }

  const aiCrawlers = AI_CRAWLERS.map((bot) => {
    const group = groups[bot.toLowerCase()] ?? groups["*"];
    const blocked = group?.some((d) => d === "/") ?? false;
    return { bot, allowed: !blocked };
  });

  return { hasSitemap: Boolean(sitemapUrl), sitemapUrl, aiCrawlers };
}

/** Full SEO snapshot: homepage (Firecrawl) + robots.txt + sitemap.xml. */
export async function crawlAndExtractSeo(url: string): Promise<SeoSnapshot> {
  const { scrapePage } = await import("@/lib/firecrawl/client");
  const raw: any = await scrapePage(url, ["markdown", "html"]);
  const doc = raw?.data ?? raw ?? {};
  const md = doc.metadata ?? {};
  const html: string = doc.html ?? "";
  const markdown: string = doc.markdown ?? "";
  if (!html && !markdown) throw new Error(`Firecrawl returned no content for ${url}.`);

  const snapshot = extractFromHtml(html || `<body>${markdown}</body>`, markdown, url, {
    title: md.title ?? md.ogTitle,
    description: md.description ?? md.ogDescription,
    statusCode: md.statusCode,
    finalUrl: md.url ?? md.sourceURL,
  });

  // robots.txt + sitemap.xml
  let origin: string;
  try {
    origin = new URL(snapshot.finalUrl ?? url).origin;
  } catch {
    return snapshot;
  }

  const robots = await fetchText(`${origin}/robots.txt`);
  if (robots && robots.status === 200 && robots.text && !/<html/i.test(robots.text)) {
    snapshot.robotsTxtFound = true;
    const parsed = parseRobots(robots.text);
    snapshot.robotsTxtHasSitemap = parsed.hasSitemap;
    snapshot.aiCrawlers = parsed.aiCrawlers;

    const sitemapUrl = parsed.sitemapUrl ?? `${origin}/sitemap.xml`;
    const sitemap = await fetchText(sitemapUrl);
    if (sitemap && sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(sitemap.text)) {
      snapshot.sitemapFound = true;
      snapshot.sitemapUrlCount = (sitemap.text.match(/<loc>/g) ?? []).length;
    }
  } else {
    // no robots.txt → default all AI crawlers allowed
    snapshot.aiCrawlers = AI_CRAWLERS.map((bot) => ({ bot, allowed: true }));
    const sitemap = await fetchText(`${origin}/sitemap.xml`);
    if (sitemap && sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(sitemap.text)) {
      snapshot.sitemapFound = true;
      snapshot.sitemapUrlCount = (sitemap.text.match(/<loc>/g) ?? []).length;
    }
  }

  return snapshot;
}
