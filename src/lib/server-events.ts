export async function trackServerEvent(
  eventName: string,
  properties: Record<string, unknown>
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn("PostHog key not configured for server-side events");
    return;
  }

  try {
    const response = await fetch("https://us.i.posthog.com/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        event: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      console.warn(`PostHog event tracking failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error tracking server event:", error);
  }
}
