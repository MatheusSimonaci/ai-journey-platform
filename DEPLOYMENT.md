# Production Deployment

This app is deployable to Vercel with a Neon Postgres database. The repo is now set up so the remaining work is mostly external account configuration.

## 1. Provision Neon

1. Create a Neon project in the target region.
2. Copy the pooled connection string and set it as `DATABASE_URL`.
3. Ensure `sslmode=require` is present in the connection string.
4. Run the schema against Neon before the first production deploy:

```bash
npm ci
set DATABASE_URL=postgresql://...
npm run db:push
npm run db:seed
```

`db:seed` is optional for the first deploy, but required if you want the dashboard to show the curated MAT-9 resources.

## 2. Configure Vercel

1. Import the repo into Vercel.
2. Set the framework preset to Next.js.
3. Use the build command `npm run vercel-build`.
4. Use Node.js 20.

## 3. Required Environment Variables

Set these in Vercel Production and Preview:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Neon pooled Postgres URL with `sslmode=require` |
| `ANTHROPIC_API_KEY` | optional | Enables AI-generated personalization; onboarding falls back to a deterministic path builder when omitted |
| `AUTH_SECRET` | yes | Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | yes | Set to `true` on Vercel |
| `NEXT_PUBLIC_APP_URL` | yes | Your production URL, e.g. `https://app.example.com` |
| `AUTH_GOOGLE_ID` | conditionally | Required for Google sign-in |
| `AUTH_GOOGLE_SECRET` | conditionally | Required for Google sign-in |
| `AUTH_RESEND_KEY` | conditionally | Required for email magic-link sign-in |
| `AUTH_EMAIL_FROM` | conditionally | Required for email magic-link sign-in |

At least one auth provider must be fully configured:

- Google requires both `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
- Email login requires both `AUTH_RESEND_KEY` and `AUTH_EMAIL_FROM`

## 4. First Production Validation

After the first Vercel deploy:

1. Open the production URL.
2. Sign in with a configured provider.
3. Complete onboarding.
4. Confirm `/dashboard` loads and shows either seeded resources or an empty state if seed data was not applied yet.

## 5. Known External Dependencies

The remaining non-repo work cannot be completed from this checkout alone:

- Neon project creation
- Vercel project creation
- Vercel environment variable entry
- Google OAuth console configuration
- Optional Resend sender/domain setup

Once those credentials are available, the commands and env list above are sufficient to complete the production launch. Anthropic access is now optional for deployability.
