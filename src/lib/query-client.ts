import { QueryClient } from '@tanstack/react-query';

// Factory used by QueryProvider — creates a fresh client per request in RSC
// and a shared client for the browser singleton.
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes — no background refetch during that window
        staleTime: 1000 * 60 * 5,
        // Keep unused cache entries for 10 minutes before garbage collecting
        gcTime: 1000 * 60 * 10,
        // Retry failed requests once before surfacing an error
        retry: 1,
        // Don't refetch when the window regains focus (TMDB data doesn't change that fast)
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Browser singleton — reuse the same client across the session
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new client to avoid sharing state between requests
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
