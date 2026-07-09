import Link from "next/link";
import { LayoutDashboard, Gauge, Search, Swords, Megaphone, Mail, Users, FileText, BarChart3, Workflow } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/audits", label: "Audits", icon: Gauge },
  { href: "/dashboard/seo", label: "SEO", icon: Search },
  { href: "/dashboard/competitors", label: "Competitors", icon: Swords },
  { href: "/dashboard/ads", label: "Ads", icon: Megaphone },
  { href: "/dashboard/emails", label: "Emails", icon: Mail },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/workflows", label: "Workflows", icon: Workflow },
] as const;

/** Left nav for the authenticated app. */
export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border p-4">
      <div className="mb-6 px-2 text-sm font-semibold tracking-tight">WEBRO&nbsp;AI</div>
      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
