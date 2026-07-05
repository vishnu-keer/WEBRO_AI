import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Entry point: send authenticated users to the dashboard, others to login. */
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  redirect(data?.claims ? "/dashboard" : "/login");
}
