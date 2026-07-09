/** Gather context: scrape the site + pull the latest audit/SEO/competitor summaries. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BusinessContext } from "./schema";

export interface ReportContext {
  business: BusinessContext;
  auditSummary?: string;
  seoSummary?: string;
  competitorSummary?: string;
}

export async function gatherReportContext(url: string, supabase: SupabaseClient): Promise<ReportContext> {
  const { scrapePage } = await import("@/lib/firecrawl/client");
  const raw: any = await scrapePage(url, ["markdown"]);
  const doc = raw?.data ?? raw ?? {};
  const md = doc.metadata ?? {};
  const business: BusinessContext = {
    url,
    title: md.title ?? md.ogTitle,
    description: md.description ?? md.ogDescription,
    content: (doc.markdown ?? "").slice(0, 2500),
  };

  const ctx: ReportContext = { business };

  const { data: audit } = await supabase
    .from("audits")
    .select("summary, overall_score, data")
    .eq("url", url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (audit?.data) {
    const a = audit.data as { summary?: string; overallScore?: number; criticalIssues?: { title: string }[] };
    ctx.auditSummary = `Website audit score ${a.overallScore ?? audit.overall_score ?? "?"} /100. ${a.summary ?? ""} Top issues: ${(a.criticalIssues ?? []).map((i) => i.title).slice(0, 5).join("; ")}`;
  }

  const { data: seo } = await supabase
    .from("seo_reports")
    .select("score, data")
    .eq("url", url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (seo?.data) {
    const s = seo.data as { overallScore?: number; criticalIssues?: { title: string }[] };
    ctx.seoSummary = `SEO score ${s.overallScore ?? seo.score ?? "?"} /100. Top issues: ${(s.criticalIssues ?? []).map((i) => i.title).slice(0, 5).join("; ")}`;
  }

  const { data: comp } = await supabase
    .from("competitors")
    .select("data")
    .eq("website", url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (comp?.data) {
    const c = comp.data as { positioning?: string; competitors?: { name: string }[]; opportunities?: string[] };
    ctx.competitorSummary = `Positioning: ${c.positioning ?? ""} Competitors: ${(c.competitors ?? []).map((x) => x.name).slice(0, 5).join(", ")}. Opportunities: ${(c.opportunities ?? []).slice(0, 4).join("; ")}`;
  }

  return ctx;
}
