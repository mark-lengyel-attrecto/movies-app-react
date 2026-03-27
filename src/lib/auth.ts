import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'tmdb',
      name: 'TMDB',
      credentials: {
        username: { label: 'TMDB Username', type: 'text' },
        password: { label: 'TMDB Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const headers = {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        };

        // Step 1: Get a short-lived request token
        const tokenRes = await fetch(`${TMDB_BASE}/authentication/token/new`, {
          headers,
          cache: 'no-store',
        });
        if (!tokenRes.ok) return null;
        const { request_token } = (await tokenRes.json()) as { request_token: string };

        // Step 2: Validate the token with the user's TMDB username + password
        const validateRes = await fetch(`${TMDB_BASE}/authentication/token/validate_with_login`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ username, password, request_token }),
          cache: 'no-store',
        });
        if (!validateRes.ok) return null;

        // Step 3: Exchange the approved token for a session ID
        const sessionRes = await fetch(`${TMDB_BASE}/authentication/session/new`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ request_token }),
          cache: 'no-store',
        });
        if (!sessionRes.ok) return null;
        const { session_id } = (await sessionRes.json()) as { session_id: string };

        // Step 4: Fetch account details
        const accountRes = await fetch(`${TMDB_BASE}/account?session_id=${session_id}`, {
          headers,
          cache: 'no-store',
        });
        if (!accountRes.ok) return null;
        const account = (await accountRes.json()) as { id: number; name: string; username: string };

        return {
          id: `tmdb:${account.id}`,
          name: account.name || account.username,
          // TMDB has no email — placeholder so NextAuth's User type is satisfied
          email: `${account.username}@tmdb.local`,
        };
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
