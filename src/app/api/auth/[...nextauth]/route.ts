import NextAuth, { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/services/prisma";
import bcrypt from "bcrypt";
import { ErrorHandlerAdapter } from "@/presentation/adapters";

const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        site: { label: "site", type: "text" },
        role: { label: "role", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password)
            throw new Error("Email and password are required");

          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });
          if (!user) throw new Error("User not found");
          const passwordMatch = await bcrypt.compare(
            credentials!.password,
            user.password,
          );
          if (!passwordMatch) throw new Error("Invalid password");
          return user as unknown as User;
        } catch (error) {
          const errorAdapter = new ErrorHandlerAdapter();
          errorAdapter.handle(error);

          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        (token.username = user.username),
          (token.role = user.role),
          (token.site = user.site);
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session && token) {
        session.user = {
          ...session.user,
          username: token.username as string,
          role: token.role as string,
          site: token.site as string,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hora
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
