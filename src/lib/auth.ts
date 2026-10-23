import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant Slug", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) {
          throw new Error("Missing credentials");
        }

        // 1. Find the tenant by slug (e.g., 'my-plumbing-co')
        const tenant = await prisma.tenant.findUnique({
          where: { slug: credentials.tenantSlug }
        });

        if (!tenant) throw new Error("Business not found");

        // 2. Find the user within that specific tenant
        const user = await prisma.user.findUnique({
          where: {
            tenantId_email: {
              tenantId: tenant.id,
              email: credentials.email
            }
          }
        });

        if (!user) throw new Error("Invalid email or password");

        // 3. Verify the password against the hash
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) throw new Error("Invalid email or password");

        // 4. Return the user object to be saved in the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When the user logs in, attach the tenant info to the token
      if (user) {
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the tenant info to the frontend session
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // We will build this page next
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};