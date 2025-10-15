import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL;
  
  if (baseUrl) {
    console.log('[tRPC] Using base URL:', baseUrl);
    return baseUrl;
  }

  console.error('[tRPC] No base URL found in environment variables');
  console.error('[tRPC] Available env vars:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')));
  
  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL or EXPO_PUBLIC_API_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});