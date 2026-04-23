import LoginClient from "./LoginClient";
import { getAuthProviderAvailability } from "@/lib/auth-config";

export default function LoginPage() {
  const availability = getAuthProviderAvailability(process.env);

  return (
    <LoginClient
      emailEnabled={availability.email}
      googleEnabled={availability.google}
    />
  );
}
