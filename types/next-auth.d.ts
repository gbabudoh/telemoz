import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: "pro" | "client" | "admin";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType: "pro" | "client" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: "pro" | "client" | "admin";
  }
}
