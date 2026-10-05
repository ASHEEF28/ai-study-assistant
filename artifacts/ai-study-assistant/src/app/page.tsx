import { LandingView } from "@/components/study-ui";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { config } = getSupabasePublicConfig();
  let signedIn = false;
  let email: string | null = null;

  if (config) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getClaims();
      const claimEmail = data?.claims?.email;
      if (!error && typeof data?.claims?.sub === "string") {
        signedIn = true;
        if (typeof claimEmail === "string") email = claimEmail;
      }
    } catch {
      // Keep the public landing page available if session lookup is temporarily unavailable.
    }
  }

  return <LandingView signedIn={signedIn} email={email} />;
}
