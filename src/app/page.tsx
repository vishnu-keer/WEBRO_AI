import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Entry point: authenticated users go to the dashboard, others to login. */
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  redirect(data.user ? "/dashboard" : "/login");
}
