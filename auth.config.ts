import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/types";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? "USER";
      }
      return session;
    },
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isCheckout = request.nextUrl.pathname === "/checkout";
      
      // Protect /checkout untuk authenticated users
      if (isCheckout) {
        if (!auth?.user) {
          return false;
        }
        return true;
      }
      
      // Protect /admin untuk ADMIN role
      if (isAdmin) {
        if (!auth?.user) return false;
        if (auth.user.role !== "ADMIN") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }
      
      return true;
    },
  },
  providers: [], // Required by NextAuthConfig, providers added in auth.ts
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
