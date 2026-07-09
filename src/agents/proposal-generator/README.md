# Proposal Generator Agent (Phase 6 — built)

Writes a tailored sales proposal for a prospect, grounded in the prospect's site,
WEBRO's knowledge base, and (if present) the prospect's latest audit findings.

**Flow:** `gatherProposalContext` scrapes the prospect + loads `knowledge-base/*.md` →
`run.ts` also pulls the latest audit for that URL → the Runner writes a structured
proposal → saved to `public.proposals`.

> Tip: fill in `knowledge-base/company_info.md`, `pricing.md`, `portfolio.md` for
> real pricing/proof. It works with the starter placeholders too, just less specific.

Trigger via `/dashboard/proposals`.
