import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { events } from "./events";

export function useEventTracking() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      events.sessionStart({
        sessionId: session.user.id,
        deviceType: typeof window !== "undefined" ? "web" : "unknown",
      });
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      events.userSignup({
        user_id: session.user.id,
        email_domain: session.user.email?.split("@")[1],
      });
    }
  }, [status, session?.user?.id]);
}
