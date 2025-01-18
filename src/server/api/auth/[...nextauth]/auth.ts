import { sign } from 'crypto';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials, req) {
                const user = { id: '1' };
                return user;
            }
        })
    ],
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    page: {
        signIn: '/login',
    }
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
