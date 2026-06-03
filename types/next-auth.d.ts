import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: "pro" | "client" | "admin";
      agencyId: string | null;   // set when user is a staff member of an agency
      teamRole: string | null;   // "manager" | "contributor" when agencyId is set
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
    agencyId?: string | null;
    teamRole?: string | null;
  }
}
