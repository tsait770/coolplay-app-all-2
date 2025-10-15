import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // 檢查環境變數
  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL;
  
  if (baseUrl) {
    console.log('[tRPC] Using base URL:', baseUrl);
    return baseUrl;
  }

  // 開發環境的預設值
  if (typeof window !== 'undefined') {
    // 瀏覽器環境
    const defaultUrl = 'http://localhost:3000';
    console.warn('[tRPC] No base URL found in environment variables, using default:', defaultUrl);
    console.warn('[tRPC] Available env vars:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')));
    return defaultUrl;
  }

  // 其他環境（如 React Native）
  const defaultUrl = 'http://localhost:3000';
  console.warn('[tRPC] No base URL found in environment variables, using default:', defaultUrl);
  console.warn('[tRPC] Available env vars:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')));
  return defaultUrl;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
