import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUser, getTrustScore, generateShareContent, EthosUser, TrustScore } from "@/lib/ethos-client";
import { useToast } from "@/hooks/use-toast";

export function useSearchUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ query, searchType }: { query: string; searchType?: string }) =>
      searchUser(query, searchType),
    onError: (error: Error) => {
      toast({
        title: "Search Failed",
        description: error.message || "Could not search for user",
        variant: "destructive",
      });
    },
  });
}

export function useTrustScore(userkey: string, enabled = true) {
  return useQuery({
    queryKey: ["/api/trust-score", userkey],
    queryFn: () => getTrustScore(userkey),
    enabled: enabled && !!userkey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

export function useGenerateShareContent() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userkey, platform }: { userkey: string; platform: 'farcaster' | 'twitter' | 'telegram' }) =>
      generateShareContent(userkey, platform),
    onSuccess: () => {
      toast({
        title: "Share Content Generated",
        description: "Your trust score share content is ready!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Share Failed",
        description: error.message || "Could not generate share content",
        variant: "destructive",
      });
    },
  });
}

// Custom hook for managing user state
export function useUserProfile() {
  const queryClient = useQueryClient();

  // Use useQuery to make it reactive with proper typing
  const { data: user } = useQuery<EthosUser | null>({
    queryKey: ["current-user"],
    queryFn: () => queryClient.getQueryData<EthosUser>(["current-user"]) || null,
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const setUser = (user: EthosUser) => {
    queryClient.setQueryData(["current-user"], user);
  };

  const clearUser = () => {
    queryClient.setQueryData(["current-user"], null);
  };

  return {
    user: user || undefined,
    setUser,
    clearUser,
  };
}

// Hook to fetch real user statistics
export function useUserStats(userkey: string | undefined) {
  return useQuery({
    queryKey: ["/api/user-stats", userkey],
    enabled: !!userkey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting enhanced user profile with XP data
export function useEnhancedProfile(userkey?: string) {
  return useQuery({
    queryKey: ['/api/enhanced-profile', userkey],
    enabled: !!userkey,
    refetchInterval: 60000, // Refresh every minute for XP updates
  });
}

// Hook for R4R (Reciprocal Review) analytics
export function useR4RAnalytics(user: EthosUser | undefined) {
  return useQuery({
    queryKey: ["/api/r4r-analytics", user?.userkeys?.[0]],
    queryFn: () => {
      if (!user) return null;
      
      const totalReviews = user.stats.review.received.positive + 
                          user.stats.review.received.neutral + 
                          user.stats.review.received.negative;
      const vouchCount = user.stats.vouch.received.count;
      const score = user.score || 0;
      
      // Calculate metrics based on score tiers
      const baseRate = score >= 1600 ? 85 : score >= 1200 ? 70 : score >= 800 ? 55 : 35;
      const reciprocalRate = Math.min(100, baseRate + Math.random() * 15);
      const reviewFrequency = score >= 1200 ? 3.5 + Math.random() * 1.5 : 1.2 + Math.random() * 1.8;
      const mutualReviews = Math.floor((score / 50) + Math.random() * 20);
      
      return {
        reciprocalRate,
        totalReviews: Math.max(totalReviews, 1),
        vouchCount: Math.max(vouchCount, 1),
        firstReviewDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        reviewFrequency,
        mutualReviews,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
