import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

/**
 * Live migration helper.
 * Old accounts have a 64-char lowercase hex SHA-256 hash.
 * On first successful login we transparently re-hash with bcrypt and save.
 */
function isLegacySha256(hash: string): boolean {
  return /^[a-f0-9]{64}$/.test(hash);
}
function sha256(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) return null;

          let passwordValid = false;

          if (isLegacySha256(user.password)) {
            // Legacy account — verify with SHA-256
            if (sha256(credentials.password) === user.password) {
              passwordValid = true;
              // Silently migrate to bcrypt
              const bcryptHash = await bcrypt.hash(credentials.password, 12);
              await prisma.user.update({
                where: { id: user.id },
                data: { password: bcryptHash },
              });
            }
          } else {
            // Modern bcrypt hash
            passwordValid = await bcrypt.compare(credentials.password, user.password);
          }

          if (!passwordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = (user as { userType: "pro" | "client" | "admin" }).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as "pro" | "client" | "admin";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting to a relative URL, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If redirecting to the same origin, allow it
      if (new URL(url).origin === baseUrl) return url;
      // Otherwise, redirect to baseUrl
      return baseUrl;
    },
  },
};

