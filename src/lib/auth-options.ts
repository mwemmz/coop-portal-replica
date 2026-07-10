import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      id: "app-login",
      name: "Coop",
      credentials: {
        identifier: { label: "Phone or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const identifier = (credentials.identifier as string).trim();

        // Try member login (by phone)
        const member = await prisma.member.findFirst({
          where: { phone: identifier },
        });
        if (member && member.status === "ACTIVE") {
          const valid = await bcrypt.compare(
            credentials.password as string,
            member.passwordHash
          );
          if (valid) {
            return {
              id: member.id,
              name: member.name,
              phone: member.phone,
              email: member.email ?? undefined,
              role: "member",
            };
          }
        }

        // Try admin login (by email)
        const admin = await prisma.adminUser.findUnique({
          where: { email: identifier },
        });
        if (admin) {
          const valid = await bcrypt.compare(
            credentials.password as string,
            admin.passwordHash
          );
          if (valid) {
            await prisma.adminUser.update({
              where: { id: admin.id },
              data: { lastLogin: new Date() },
            });
            return {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
            };
          }
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: "member-login",
      name: "Member",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        const member = await prisma.member.findUnique({
          where: { phone: credentials.phone as string },
        });
        if (!member || member.status !== "ACTIVE") return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          member.passwordHash
        );
        if (!valid) return null;
        return { id: member.id, name: member.name, phone: member.phone, role: "member" };
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
        });
        if (!admin) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          admin.passwordHash
        );
        if (!valid) return null;
        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() },
        });
        return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
};
