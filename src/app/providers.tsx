"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug();
      }
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRouteChange = () => {
      posthog?.capture("$pageview");
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SessionProvider>{children}</SessionProvider>
    </PostHogProvider>
  );
}
