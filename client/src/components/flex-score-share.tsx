import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Copy, MessageCircle, Twitter, Sparkles, TrendingUp, Award } from "lucide-react";
import { useUserProfile, useGenerateShareContent, useEnhancedProfile } from "@/hooks/use-ethos-api";
import { TrustScoreCard } from "@/components/trust-score-card";
import { miniAppManager } from "@/utils/miniapp-detection";
import { useToast } from "@/hooks/use-toast";
import { sdk as farcasterSdk } from '@farcaster/miniapp-sdk';

export function FlexScoreShare() {
  const { user } = useUserProfile();
  const { data: enhancedData } = useEnhancedProfile(user?.userkeys?.[0]);
  const generateShare = useGenerateShareContent();
  const { toast } = useToast();
  const [shareContent, setShareContent] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  
  // Get enhanced profile data for accurate metrics
  const enhancedProfile = (enhancedData as any)?.success ? (enhancedData as any).data : null;
  const xpTotal = enhancedProfile?.xpTotal || user?.xpTotal || 0;
  const weeklyXpGain = enhancedProfile?.weeklyXpGain || null;
  const leaderboardPosition = enhancedProfile?.leaderboardPosition || null;

  if (!user) return null;

  const handleGenerateContent = async (platform: 'farcaster' | 'twitter' | 'telegram') => {
    if (!user.userkeys?.[0]) return;

    const result = await generateShare.mutateAsync({
      userkey: user.userkeys[0],
      platform,
    });

    if (result.success && result.data) {
      setShareContent(result.data.content);
      return result.data.content;
    }
  };

  const handleCast = async () => {
    setIsSharing(true);
    try {
      const context = miniAppManager.getContext();
      
      if (context.platform === 'farcaster' || context.platform === 'base') {
        // Use Mini App SDK for Farcaster/Base
        const content = await handleGenerateContent('farcaster');
        if (content && user) {
          try {
            // Try Mini App SDK first
            await farcasterSdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(content)}`);
            toast({
              title: "🚀 Cast Ready!",
              description: "Opening Farcaster composer...",
            });
          } catch (sdkError) {
            // Fallback to sharing via Mini App manager
            await miniAppManager.shareTrustScore(user);
            toast({
              title: "🚀 Cast Shared!",
              description: "Successfully shared via Mini App...",
            });
          }
        }
      } else {
        // Fallback to traditional sharing
        const content = await handleGenerateContent('farcaster');
        if (content) {
          const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(content)}`;
          window.open(warpcastUrl, '_blank');
          toast({
            title: "🚀 Cast Ready!",
            description: "Opening Farcaster with your reputation flex content...",
          });
        }
      }
    } catch (error) {
      console.error('Cast sharing failed:', error);
      toast({
        title: "Error",
        description: "Failed to share cast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsSharing(false), 300);
    }
  };

  const handleTweet = async () => {
    setIsSharing(true);
    try {
      const context = miniAppManager.getContext();
      
      if (context.platform === 'farcaster' || context.platform === 'base') {
        // In Mini App, use openUrl action for Twitter
        const content = await handleGenerateContent('twitter');
        if (content) {
          try {
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
            await farcasterSdk.actions.openUrl(tweetUrl);
            toast({
              title: "🚀 Tweet Ready!",
              description: "Opening Twitter via Mini App...",
            });
          } catch (sdkError) {
            // Fallback to window.open
            const fallbackTweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
            window.open(fallbackTweetUrl, '_blank');
            toast({
              title: "🚀 Tweet Ready!",
              description: "Opening Twitter...",
            });
          }
        }
      } else if (context.platform === 'telegram') {
        // Use Telegram Mini App sharing
        if (user) {
          await miniAppManager.shareTrustScore(user);
          toast({
            title: "📱 Shared in Telegram!",
            description: "Successfully shared via Telegram Mini App...",
          });
        }
      } else {
        // Fallback to traditional Twitter/X sharing
        const content = await handleGenerateContent('twitter');
        if (content) {
          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
          window.open(tweetUrl, '_blank');
          
          toast({
            title: "🚀 Tweet Ready!",
            description: "Opening Twitter/X with your reputation flex content...",
          });
        }
      }
    } catch (error) {
      console.error('Tweet sharing failed:', error);
      toast({
        title: "Error",
        description: "Failed to share tweet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsSharing(false), 300);
    }
  };

  const handleCopy = async () => {
    setIsSharing(true);
    try {
      const content = shareContent || await handleGenerateContent('farcaster');
      if (content) {
        await navigator.clipboard.writeText(content);
        toast({
          title: "Copied!",
          description: "Share content copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsSharing(false), 300);
    }
  };

  const defaultContent = `🚀 REPUTATION FLEX ALERT 🚀

📊 Trust Score: ${user?.score || 0}
👤 Identity: ${user?.displayName || 'Anon'}
🏆 Powered by @ethos_network protocol

💎 Want to know YOUR web3 reputation?
🔍 Try Ethosradar.com - scans everything!

#TrustScore #Web3Reputation #EthosRadar #RepFlex`;

  return (
    <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Compact Mini App Card */}
      <div className="clay-card mobile-card relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/3 to-purple-600/5 animate-gradient-shift"></div>
        
        {/* Compact header with sparkle */}
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                <Share className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Flex Your Trust</h3>
                <p className="text-xs text-muted-foreground">Share your reputation</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-orange-500">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-bold">VIRAL</span>
            </div>
          </div>
          
          {/* Compact stats in horizontal layout */}
          <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between text-center">
              <div className="flex-1">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {user?.score || 0}
                </div>
                <div className="text-xs text-muted-foreground">Trust</div>
              </div>
              <div className="w-px h-8 bg-border mx-2"></div>
              <div className="flex-1">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  #{leaderboardPosition || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
              <div className="w-px h-8 bg-border mx-2"></div>
              <div className="flex-1">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {(xpTotal / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
            </div>
            
            {weeklyXpGain && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center space-x-1 px-2 py-1 bg-green-500/10 rounded-full border border-green-400/20">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">+{weeklyXpGain} XP this week</span>
                </div>
              </div>
            )}
          </div>
          
          {/* User Trust Card Preview */}
          {user && (
            <div className="mb-3">
              <TrustScoreCard compact={true} className="border-white/20 dark:border-gray-700/20" />
            </div>
          )}
          
          {/* Compact action buttons */}
          <div className="flex space-x-2 social-sharing-container mini-app-buttons">
            <Button
              onClick={handleCast}
              disabled={generateShare.isPending || isSharing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 h-9 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className={`h-3 w-3 mr-1 ${isSharing ? 'animate-spin' : ''}`} />
              {isSharing ? 'Casting...' : 'Cast'}
            </Button>
            <Button
              onClick={handleTweet}
              disabled={generateShare.isPending || isSharing}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-9 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Twitter className={`h-3 w-3 ${isSharing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={handleCopy}
              disabled={generateShare.isPending || isSharing}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 h-9 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Copy className={`h-3 w-3 ${isSharing ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Loading state */}
        {isSharing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Share className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">Sharing...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
