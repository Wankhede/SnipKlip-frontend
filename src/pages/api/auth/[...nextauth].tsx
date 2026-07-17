// next
import NextAuth, { Account, Profile, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { uninterceptedAxiosServices } from 'utils/axios';
import { AdapterUser } from 'next-auth/adapters';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        ...(googleClientId && googleClientSecret
            ? [
                  GoogleProvider({
                      name: 'Google',
                      clientId: googleClientId,
                      clientSecret: googleClientSecret,
                      authorization: {
                          params: {
                              prompt: 'consent',
                              access_type: 'offline',
                              response_type: 'code'
                          }
                      }
                  })
              ]
            : []),
        CredentialsProvider({
            id: 'login',
            name: 'Login',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Enter email' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter password' }
            },
            async authorize(credentials) {
                try {
                    const response = await uninterceptedAxiosServices.post('/api/v3/login/', {
                        password: credentials?.password,
                        username: credentials?.email
                    });
                    const user = response.data;

                    if (user?.data?.status && user?.data?.access_token) {
                        return { ...user, id: String(user.id) };
                    }

                    return null;
                } catch (error: any) {
                    const errorMessage = error?.response?.data?.message || error?.message || 'Unable to sign in';
                    throw new Error(errorMessage);
                }
            }
        })
    ],
    callbacks: {
        async signIn({
            user,
            account,
            profile
        }: {
            user: User | AdapterUser;
            account: Account | null;
            profile?: Profile;
        }): Promise<string | boolean> {
            if (account?.provider === 'google') {
                const { access_token, id_token } = account;
                try {
                    const response = await uninterceptedAxiosServices.post('/api/v3/login/', {
                        access_token,
                        id_token
                    });
                    account.access_token = response.data.access_token;
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        jwt: ({ token, user, account }) => {
            if (user) {
                token.id = user.id;
                token.provider = account?.provider;
                token.user = user;
                token.access_token = account?.access_token;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token) {
                session.id = token.id;
                session.provider = token.provider;
                session.token = token;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: Number(process.env.JWT_TIMEOUT!)
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    pages: {
        signIn: '/login',
        newUser: '/register'
    }
});
