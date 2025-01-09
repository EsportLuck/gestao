// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    site: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string | null;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}
