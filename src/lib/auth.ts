import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { getAuthProviderAvailability } from "./auth-config";
import { trackServerEvent } from "./server-events";

const authAvailability = getAuthProviderAvailability(process.env);

const providers = [];

if (authAvailability.google) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

if (authAvailability.email) {
  providers.push(
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.AUTH_EMAIL_FROM!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers,
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await trackServerEvent("user_signup", user.id, {
          email_domain: user.email?.split("@")[1],
          method: user.email ? "email" : "oauth",
        });
      }
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
});
