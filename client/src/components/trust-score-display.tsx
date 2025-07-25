import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, Shield, TrendingUp, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// ScorePulse moved to search results only
import { useUserProfile, useTrustScore, useUserStats, useEnhancedProfile } from "@/hooks/use-ethos-api";
import { getTrustLevelBadgeColor } from "@/lib/ethos-client";

export function TrustScoreDisplay() {
  const { user } = useUserProfile();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get real-time trust score and user statistics
  const { data: scoreData } = useTrustScore(
    user?.userkeys?.[0] || '', 
    !!user
  );
  
  const { data: statsData } = useUserStats(user?.userkeys?.[0]);
  const { data: enhancedData } = useEnhancedProfile(user?.userkeys?.[0]);

  const score = (scoreData as any)?.success ? (scoreData as any).data?.score || user?.score || 0 : user?.score || 0;
  const level = (scoreData as any)?.success ? (scoreData as any).data?.level || 'Unknown' : 'Unknown';
  
  // Use real stats if available, otherwise fallback to user stats
  const realStats = (statsData as any)?.success ? (statsData as any).data : user?.stats;
  
  // Use enhanced profile for XP and social data
  const enhancedProfile = (enhancedData as any)?.success ? (enhancedData as any).data : null;
  
  // Get real XP metrics from enhanced profile or fallback to user data
  const xpTotal = enhancedProfile?.xpTotal || user?.xpTotal || 0;
  const xpStreakDays = enhancedProfile?.xpStreakDays || user?.xpStreakDays || 0;
  const leaderboardPosition = enhancedProfile?.leaderboardPosition || (user as any)?.leaderboardPosition;
  const weeklyXpGain = enhancedProfile?.weeklyXpGain || null;
  
  // Determine user profile initialization status 
  const getProfileStatus = (): 'uninitialized' | 'active' | 'neutral' | 'inactive' => {
    // Check if profile is uninitialized (has score but no activity/vouches)
    const hasVouches = realStats?.vouch?.received?.count > 0 || realStats?.vouch?.given?.count > 0;
    const hasReviews = realStats?.review?.received?.positive > 0 || realStats?.review?.received?.negative > 0;
    const hasXP = xpTotal > 0;
    
    // If user has score but no meaningful activity, they're likely uninitialized
    if (score > 0 && !hasVouches && !hasReviews && !hasXP) {
      return 'uninitialized';
    }
    
    // Standard activity detection for initialized users
    if (xpStreakDays >= 7) return 'active'; // Active if 7+ day streak
    if (xpStreakDays >= 1) return 'neutral'; // Neutral if 1-6 day streak  
    return 'inactive'; // Inactive if no streak
  };
  
  const profileStatus = getProfileStatus();
  const statusColors = {
    uninitialized: { ring: '#9333ea', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    active: { ring: '#10b981', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    neutral: { ring: '#f59e0b', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
    inactive: { ring: '#ef4444', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' }
  };

  // Smooth score animation with loading effect
  useEffect(() => {
    if (score > 0) {
      setIsLoading(true);
      const duration = 1500; // Moderate animation duration
      const startTime = Date.now();
      const startScore = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth ease-out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(startScore + (score - startScore) * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsLoading(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [score]);

  if (!user) return null;

  const totalReviews = realStats?.review?.received?.positive + 
                      realStats?.review?.received?.neutral + 
                      realStats?.review?.received?.negative || 0;

  return (
    <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Modern Profile Card */}
      <div className="clay-card mobile-card p-4 mb-4 relative overflow-hidden backdrop-blur-sm">
        {/* Unique floating orbs for trust score display */}
        <div className="absolute top-3 right-4 w-6 h-6 bg-gradient-to-br from-orange-500/18 to-red-500/12 rounded-full blur-sm trust-orb-1"></div>
        <div className="absolute bottom-4 left-3 w-8 h-8 bg-gradient-to-br from-cyan-500/16 to-sky-500/11 rounded-full blur-sm trust-orb-2"></div>
        <div className="absolute top-1/2 left-2 w-3 h-3 bg-gradient-to-br from-lime-500/20 to-green-500/15 rounded-full blur-sm trust-orb-3"></div>
        
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/20 dark:from-orange-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        
        <div className="relative z-10">
          {/* Profile Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative group">
              {/* Animated Status Ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" 
                   style={{ 
                     background: `linear-gradient(45deg, ${statusColors[profileStatus].ring}, ${statusColors[profileStatus].ring}80)`
                   }}></div>
              <img 
                src={user.avatarUrl || '/placeholder-avatar.png'} 
                alt={user.displayName}
                className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 object-cover border-3 border-white dark:border-gray-800 relative transition-transform duration-300 group-hover:scale-105"
              />
              {/* Status Badge */}
              <div className="absolute -bottom-0.5 -right-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 ${statusColors[profileStatus].bg} shadow-sm transition-all duration-300`}>
                  <Badge className={`text-xs px-1 py-0 h-auto ${getTrustLevelBadgeColor(level)} border-none font-bold`} style={{ fontSize: '8px' }}>
                    {level.charAt(0)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-orange-500 opacity-80" />
                <h3 className="text-lg font-bold text-foreground truncate">
                  {user.displayName}
                </h3>
              </div>
              {user.username && (
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              )}
            </div>
          </div>

          {/* Score Display Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Trust Score</h4>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold transition-all duration-500 ${
                  isLoading ? 'animate-pulse text-orange-400' : 'text-orange-600 dark:text-orange-400'
                }`} style={{ 
                  textShadow: '0 2px 4px rgba(255, 101, 0, 0.2)'
                }}>
                  {animatedScore}
                </span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[profileStatus].bg} ${statusColors[profileStatus].text} transition-all duration-300`}>
                  {profileStatus === 'uninitialized' ? '● Needs Invite' : 
                   profileStatus === 'active' ? '● Active' : 
                   profileStatus === 'neutral' ? '● Neutral' : '● Inactive'}
                </div>
              </div>
            </div>
            
            {/* Animated Progress Ring */}
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                {/* Background Circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke={statusColors[profileStatus].ring}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 - (Math.min(animatedScore, 3000) / 3000) * (2 * Math.PI * 30)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 8px ${statusColors[profileStatus].ring}40)`
                  }}
                />
              </svg>
              {/* Center Percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">
                  {Math.round((Math.min(animatedScore, 3000) / 3000) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          {realStats && (
            <div className="flex justify-between items-center mb-4 bg-white/50 dark:bg-gray-800/30 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-1 flex-1">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground">RANK</span>
                </div>
                <span className="text-lg font-bold text-foreground">#{leaderboardPosition || 'N/A'}</span>
              </div>
              
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex flex-col items-center space-y-1 flex-1">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-muted-foreground">XP</span>
                </div>
                <span className="text-lg font-bold text-foreground">{(xpTotal / 1000).toFixed(1)}k</span>
                {weeklyXpGain && weeklyXpGain > 0 && (
                  <span className="text-xs font-medium text-green-500 animate-pulse">
                    +{weeklyXpGain} XP
                  </span>
                )}
              </div>
              
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex flex-col items-center space-y-1 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs font-medium text-muted-foreground">STREAK</span>
                </div>
                <span className="text-lg font-bold text-foreground">{xpStreakDays}d</span>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button 
            variant="default" 
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            onClick={() => {
              let username = user.username;
              if (!username && user.userkeys?.[0]) {
                const userkey = user.userkeys[0];
                if (userkey.includes('service:x.com:')) {
                  username = user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user';
                } else {
                  username = userkey.split(':').pop() || user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user';
                }
              }
              const profileUrl = `https://app.ethos.network/profile/x/${username || user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`;
              window.open(profileUrl, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Ethos
          </Button>

          {user.description && (
            <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.description}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Score Pulse removed - now only in search results */}
    </section>
  );
}