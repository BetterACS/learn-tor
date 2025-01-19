import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    async authorize(credentials) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/trpc/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials?.email, password: credentials?.password })
          }
        );
        const query = await res.json();
        console.log("query", query);
        if (query.result.data.status !== 200) {
          throw new Error(query.result.data.data.message);
        }
        else{
          return query.result.data.data.user;
        }
      } catch (error) {
        console.log("error", error);
        throw new Error(String(error));
      }
    }
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // Set session and JWT lifetime to 7 days (in seconds)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Token lifetime (7 days)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  logger: {
    error: console.error,
    warn: console.warn,
    debug: console.log,
  },
  debug: true,
};

export default authOptions;
