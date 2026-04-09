import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      sessionId?: string;
      accountId?: number;
    } & DefaultSession['user'];
  }

  interface User {
    sessionId?: string;
    accountId?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sessionId?: string;
    accountId?: number;
  }
}
