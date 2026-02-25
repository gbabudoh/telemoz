import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

// Hash password using SHA-256 (same as registration)
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
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
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const hashedPassword = hashPassword(credentials.password);
          if (user.password !== hashedPassword) {
            return null;
          }

          // Return user object for NextAuth
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

