import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType: "pro" | "client" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    userType: "pro" | "client" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: "pro" | "client" | "admin";
  }
}

