"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

export function PostHogIdentifier() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      posthog.reset();
    }
  }, [session]);

  return null;
}
