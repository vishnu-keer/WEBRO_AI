# Marketing Report Generator (Phase 7 — built)

Combines a prospect's saved audit + SEO + competitor findings (plus a fresh homepage
scrape) into one polished, client-facing marketing report.

**Flow:** `gatherReportContext` scrapes the site and pulls the latest audit/SEO/competitor
rows for that URL → the Runner synthesizes them → saved to `public.reports`.

> Best results: run **Audit**, **SEO**, and **Competitors** on the URL first — the
> report weaves them together. It still works with none (from the site alone).

Trigger via `/dashboard/reports`.
