/**
 * Website Audit Agent — the AgentSpec. It plugs into the shared Runner; the only
 * bespoke logic is the prompt, the schemas, and how the snapshot is rendered.
 */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { WEBSITE_AUDIT_SYSTEM_PROMPT } from "./prompt";
import {
  WebsiteAuditInputSchema,
  WebsiteAuditOutputSchema,
  type WebsiteAuditInput,
  type WebsiteAuditOutput,
} from "./schema";

function renderSnapshot(input: WebsiteAuditInput): string {
  const s = input.snapshot;
  return `Audit this website: ${input.url}

## Meta
Title: ${s.title ?? "(none)"}
Meta description: ${s.metaDescription ?? "(none)"}
Final URL: ${s.finalUrl ?? input.url}
HTTP status: ${s.statusCode ?? "unknown"}
Viewport meta present: ${s.hasViewportMeta}
Page speed measured: ${s.pageSpeedMeasured} (infer heuristically from asset counts)

## Structure
H1s: ${s.h1.join(" | ") || "(none)"}
H2s: ${s.h2.slice(0, 15).join(" | ") || "(none)"}
Nav links (${s.navLinks.length}): ${s.navLinks.map((l) => l.text).slice(0, 20).join(", ") || "(none)"}
Internal pages linked (${s.internalLinks.length}): ${s.internalLinks.slice(0, 25).join(", ") || "(none)"}
External links: ${s.externalLinkCount} | Scripts: ${s.scriptCount} | Words: ${s.wordCount}

## Conversion elements
CTAs (${s.ctas.length}): ${s.ctas.join(" | ") || "(none found)"}
Forms: ${s.forms.length ? s.forms.map((f) => `${f.fields} fields${f.hasEmail ? ", email" : ""}`).join("; ") : "(none)"}
Images: ${s.imageCount} (missing alt: ${s.imagesMissingAlt})
Social links: ${s.socialLinks.join(", ") || "(none)"}
Detected trust signals: ${s.detectedTrustSignals.join(", ") || "(none detected)"}

## Homepage content preview
${s.contentPreview}`;
}

export const websiteAuditAgent: AgentSpec<WebsiteAuditInput, WebsiteAuditOutput> = {
  name: "website-audit",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: WebsiteAuditInputSchema,
  output: WebsiteAuditOutputSchema,
  systemPrompt: WEBSITE_AUDIT_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderSnapshot,
};

registerAgent(websiteAuditAgent);
