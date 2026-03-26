import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace with real database lookup + bcrypt comparison
        // Example: const user = await db.user.findUnique({ where: { email } })
        // if (!user || !await bcrypt.compare(password, user.hashedPassword)) return null
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return { id: '1', name: 'Demo User', email: credentials.email as string };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    // Protect routes that require authentication
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const protectedPaths = ['/watchlist', '/profile'];
      const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));

      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }
      return true;
    },

    // Attach user id to the session so it's available client-side
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  session: { strategy: 'jwt' },
});
