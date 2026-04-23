import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import {
  getAuthConfigurationErrors,
  getAuthProviderAvailability,
} from "./auth-config";

const authAvailability = getAuthProviderAvailability(process.env);
const authConfigErrors = getAuthConfigurationErrors(process.env);

if (authConfigErrors.length > 0 && process.env.NEXT_PHASE !== "phase-production-build") {
  throw new Error(`Invalid auth configuration: ${authConfigErrors.join(" ")}`);
}

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
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
});
