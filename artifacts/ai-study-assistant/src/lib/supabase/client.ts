"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

export function createClient() {
  const { config, missing } = getSupabasePublicConfig();
  if (!config) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}.`);
  }

  return createBrowserClient(config.url, config.publishableKey);
}
