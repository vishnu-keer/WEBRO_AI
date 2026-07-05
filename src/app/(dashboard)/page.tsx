import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAgents } from "@/agents/core";
import "@/agents"; // ensure agents are registered so the count is accurate

export default function DashboardHome() {
  const agents = listAgents();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">WEBRO AI Marketing OS</h1>
        <p className="text-foreground/60">Phase 1 — Website Audit Agent is live.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Registered agents</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{agents.length}</CardContent>
        </Card>
        <Link href="/dashboard/audits">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardHeader>
              <CardTitle>Website Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/60">Run a UI/UX + conversion audit →</CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/60">Auth · DB · Queue · RAG wired.</CardContent>
        </Card>
      </div>
    </div>
  );
}
