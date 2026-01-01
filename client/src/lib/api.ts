/**
 * API utility for making authenticated requests with Clerk tokens
 * Import this in components that need to make API calls
 */

import { useAuth } from "@clerk/clerk-react";

export function useApiRequest() {
  const { getToken } = useAuth();

  const apiRequest = async (
    method: string,
    url: string,
    data?: unknown
  ): Promise<Response> => {
    const token = await getToken();

    const res = await fetch(url, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }

    return res;
  };

  return { apiRequest };
}
