import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import { useUserProfile, useEnhancedProfile } from "@/hooks/use-ethos-api";

interface FarcasterCastProps {
  onCast?: (content: string) => void;
}

export function FarcasterCast({ onCast }: FarcasterCastProps) {
  const { user } = useUserProfile();
  const { data: enhancedData } = useEnhancedProfile();
  const [castContent, setCastContent] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  if (!user) return null;

  const generateCastContent = () => {
    const templates = [
      `🚀 REPUTATION FLEX ALERT 🚀\n\n📊 Trust Score: ${user.score}\n👤 Identity: ${user.displayName}\n🏆 Powered by @ethos_network protocol\n\n💎 Want to know YOUR web3 reputation?\n🔍 Try Ethosradar.com - scans everything!\n• Ethereum addresses\n• Farcaster profiles  \n• Twitter accounts\n• Discord & more\n\n#TrustScore #Web3Reputation #EthosRadar #RepFlex`,
      `💯 ATTENTION ANONS! Just flexed my trust score:\n\n🔥 ${user.score} Trust Rating\n⚡ Identity: ${user.displayName}\n🌐 Multi-platform verified by @ethos_network\n${user.stats?.vouch?.received?.count ? `\n🤝 ${user.stats.vouch.received.count} vouches received` : ''}\n${user.stats?.review?.received?.positive ? `\n👍 ${user.stats.review.received.positive} positive reviews` : ''}\n\n🎯 Your turn! Check your reputation:\n🔗 Ethosradar.com\n\n#Ethos_network #Web3Trust #EthosRadar`,
      `📈 REPUTATION ALPHA DROP 📈\n\nMy @ethos_network trust metrics:\n• Score: ${user.score} 🏅\n• Identity: ${user.displayName} 👑\n• Network: Multi-chain verified ✅\n• Vouches: ${user.stats?.vouch?.received?.count || 0} 🤝\n\n🚨 Want the same intel on YOUR accounts?\n🔍 Ethosradar.com - FREE reputation scanner\n\nScan: ETH, FC, X, Discord, Telegram\n\n#Web3Intel #TrustScore #EthosRadar`,
      `🎯 FLEX FRIDAY: Reputation Edition 🎯\n\n${user.displayName} just hit ${user.score} trust score! 🔥\n\n📊 Verified across multiple platforms\n🏆 @ethos_network protocol validated\n💪 Building Web3 credibility\n\n🔥 Ready to flex YOUR reputation?\n📱 Ethosradar.com - Know your worth!\n\n#FlexFriday #TrustScore #Web3Rep #EthosRadar`,
      `💯 JUST FLEXED MY ON-CHAIN CREDIBILITY:\n\n🔥 Trust Score: ${user.score}\n🏆 Leaderboard Rank: #${(enhancedData as any)?.leaderboardPosition || 'TBD'} Overall\n🧬 Identity: Semi-Anon — Verified by @ethos_network\n\n🎯 Your turn — Check where you stand:\n🔗 Ethosradar.com\n\n#Ethos #Web3Trust #EthosRadar #FlexYourTrust`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setCastContent(randomTemplate);
    
    // Trigger generation animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleCast = () => {
    if (castContent.trim()) {
      // Open Warpcast with pre-filled content for immediate casting
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castContent)}`;
      window.open(warpcastUrl, '_blank');
      
      // Call the onCast handler if provided
      onCast?.(castContent);
      
      // Success animation and feedback
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCastContent("");
      }, 400);
    }
  };

  const remainingChars = 320 - castContent.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className={`clay-card mobile-card border-none transition-all duration-300 ${isAnimating ? 'scale-[1.02] shadow-lg' : ''}`}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">💯</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Flex Your Trust Score</h3>
              <p className="text-xs text-muted-foreground">Show off your reputation</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Viral
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={generateCastContent}
            variant="outline" 
            size="sm" 
            className={`flex-1 h-8 text-xs transition-all duration-200 hover:scale-105 ${isAnimating ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse' : ''}`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Generate Flex
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 hover:scale-105 transition-all duration-200"
            onClick={() => setCastContent("")}
          >
            Clear
          </Button>
        </div>

        {/* Cast Content */}
        <div className="space-y-2">
          <Textarea
            value={castContent}
            onChange={(e) => setCastContent(e.target.value)}
            placeholder="Flex your trust score! Share your reputation achievements and invite others to check theirs on EthosRadar..."
            className="min-h-[100px] text-sm resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
            maxLength={320}
          />
          
          {/* Character Counter */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>🔮 Farcaster</span>
              <span>•</span>
              <span>Public</span>
            </div>
            <div className={`font-mono ${isOverLimit ? 'text-red-500' : remainingChars < 40 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {remainingChars}
            </div>
          </div>
        </div>

        {/* Cast Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span>📈</span>
              <span>Trust Score: {user.score}</span>
            </div>
            {user.username && (
              <div className="flex items-center space-x-1">
                <span>👤</span>
                <span>@{user.username}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs hover:scale-105 transition-all duration-200"
              onClick={() => {
                const tweetContent = castContent || `🚀 REPUTATION FLEX: ${user.score} Trust Score! Check yours at Ethosradar.com 📊 #TrustScore #Web3Reputation`;
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`;
                window.open(tweetUrl, '_blank');
              }}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Tweet
            </Button>
            <Button
              onClick={handleCast}
              disabled={!castContent.trim() || isOverLimit}
              size="sm"
              className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
                castContent.trim() && !isOverLimit 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-105 text-white' 
                  : ''
              }`}
            >
              <Send className={`w-3 h-3 mr-1 ${isAnimating ? 'animate-bounce' : ''}`} />
              Cast
            </Button>
          </div>
        </div>

        {/* Quick Tags */}
        {castContent && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-muted-foreground">Viral tags:</span>
            {['#TrustScore', '#Web3Reputation', '#EthosRadar', '#RepFlex'].map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                onClick={() => setCastContent(prev => prev + ` ${tag}`)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}