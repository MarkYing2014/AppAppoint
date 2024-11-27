import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Please enter your email and password");
          }

          console.log("Attempting login for email:", credentials.email);

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              emailVerified: true,
              salesRep: {
                select: {
                  name: true
                }
              }
            }
          });

          if (!user) {
            console.log("No user found for email:", credentials.email);
            throw new Error("No user found with this email");
          }

          console.log("User found, verifying password");

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email);
            throw new Error("Invalid password");
          }

          console.log("Password verified, checking email verification");

          // Remove the email verification check temporarily for testing
          // if (!user.emailVerified) {
          //   console.log("Email not verified for user:", credentials.email);
          //   throw new Error("Please verify your email before logging in");
          // }

          console.log("Login successful for user:", credentials.email);

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.salesRep?.name || user.email.split('@')[0] // Fallback to email username if no name
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          name: user.name
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
