import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { events } from "./events";

export function useEventTracking() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      events.sessionStart({
        sessionId: session.user.id,
        deviceType: typeof window !== "undefined" ? "web" : "unknown",
      });
    }
  }, [status, session?.user?.id]);
}
