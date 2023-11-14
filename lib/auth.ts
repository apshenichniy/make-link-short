import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig, User } from "next-auth";
import GitHub from "next-auth/providers/github";

import { incrementUsers } from "./data";
import { db } from "./db";

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async authorized() {
      return true;
    },
    async session({ token, session }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "signUp") {
        // new user - update stat in redis
        await incrementUsers();
      }

      if (user) {
        return {
          userId: user.id,
          ...token,
        };
      }

      return token;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
