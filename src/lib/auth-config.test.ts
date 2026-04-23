import {
  getAuthConfigurationErrors,
  getAuthProviderAvailability,
} from "./auth-config";

describe("auth-config", () => {
  it("enables both providers when complete credentials are present", () => {
    const env = {
      AUTH_GOOGLE_ID: "google-id",
      AUTH_GOOGLE_SECRET: "google-secret",
      AUTH_RESEND_KEY: "re_test",
      AUTH_EMAIL_FROM: "noreply@example.com",
    };

    expect(getAuthProviderAvailability(env)).toEqual({
      google: true,
      email: true,
    });
    expect(getAuthConfigurationErrors(env)).toEqual([]);
  });

  it("reports partial provider configuration", () => {
    const env = {
      AUTH_GOOGLE_ID: "google-id",
      AUTH_RESEND_KEY: "re_test",
    };

    expect(getAuthProviderAvailability(env)).toEqual({
      google: false,
      email: false,
    });
    expect(getAuthConfigurationErrors(env)).toEqual([
      "AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET must both be set to enable Google sign-in.",
      "AUTH_RESEND_KEY and AUTH_EMAIL_FROM must both be set to enable email sign-in.",
    ]);
  });

  it("requires at least one complete provider", () => {
    expect(getAuthConfigurationErrors({})).toEqual([
      "Configure at least one auth provider before deploying.",
    ]);
  });
});
