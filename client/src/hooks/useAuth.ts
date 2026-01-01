import { useQuery } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import type { User } from "@shared/schema";

export function useAuth() {
  const { isSignedIn, isLoaded, getToken } = useClerkAuth();

  // Only fetch user data if Clerk auth is loaded and user is signed in
  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
  });

  return {
    user,
    isLoading: !isLoaded || isUserLoading,
    isAuthenticated: isSignedIn && !!user,
  };
}
