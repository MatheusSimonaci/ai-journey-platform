type AuthEnv = {
  [key: string]: string | undefined;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  AUTH_RESEND_KEY?: string;
  AUTH_EMAIL_FROM?: string;
};

export type AuthProviderAvailability = {
  google: boolean;
  email: boolean;
};

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getAuthProviderAvailability(env: AuthEnv): AuthProviderAvailability {
  return {
    google: hasValue(env.AUTH_GOOGLE_ID) && hasValue(env.AUTH_GOOGLE_SECRET),
    email: hasValue(env.AUTH_RESEND_KEY) && hasValue(env.AUTH_EMAIL_FROM),
  };
}

export function getAuthConfigurationErrors(env: AuthEnv): string[] {
  const errors: string[] = [];
  const hasGoogleId = hasValue(env.AUTH_GOOGLE_ID);
  const hasGoogleSecret = hasValue(env.AUTH_GOOGLE_SECRET);
  const hasResendKey = hasValue(env.AUTH_RESEND_KEY);
  const hasEmailFrom = hasValue(env.AUTH_EMAIL_FROM);

  if (hasGoogleId !== hasGoogleSecret) {
    errors.push("AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET must both be set to enable Google sign-in.");
  }

  if (hasResendKey !== hasEmailFrom) {
    errors.push("AUTH_RESEND_KEY and AUTH_EMAIL_FROM must both be set to enable email sign-in.");
  }

  if (!hasGoogleId && !hasGoogleSecret && !hasResendKey && !hasEmailFrom) {
    errors.push("Configure at least one auth provider before deploying.");
  }

  return errors;
}
