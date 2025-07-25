import React from 'react';
import { useUserProfile } from '@/hooks/use-ethos-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, TrendingUp, Shield, Users, MessageSquare } from 'lucide-react';

interface TrustScoreCardProps {
  className?: string;
  compact?: boolean;
}

// Official Ethos tier system from developers.ethos.network API documentation
const getTierInfo = (score: number) => {
  if (score >= 2000) return { tier: 'Exemplary', emoji: '', style: 'from-purple-500 to-purple-700' };
  if (score >= 1600) return { tier: 'Reputable', emoji: '', style: 'from-orange-500 to-red-600' };
  if (score >= 1200) return { tier: 'Neutral', emoji: '', style: 'from-blue-500 to-blue-700' };
  if (score >= 800) return { tier: 'Questionable', emoji: '', style: 'from-yellow-500 to-yellow-700' };
  return { tier: 'Untrusted', emoji: '', style: 'from-gray-500 to-gray-700' };
};

export function TrustScoreCard({ className = '', compact = false }: TrustScoreCardProps) {
  const { user } = useUserProfile();

  if (!user) return null;

  const tierInfo = getTierInfo(user.score);

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'from-purple-500 to-purple-700';
    if (score >= 1600) return 'from-orange-500 to-red-600'; 
    if (score >= 1200) return 'from-blue-500 to-blue-700';
    if (score >= 900) return 'from-green-500 to-green-700';
    if (score >= 600) return 'from-teal-500 to-teal-700';
    if (score >= 300) return 'from-cyan-500 to-cyan-700';
    return 'from-gray-500 to-gray-700';
  };

  if (compact) {
    return (
      <Card className={`clay-card border-none bg-gradient-to-br ${getScoreColor(user.score)}/10 ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-white/20">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground truncate">
                {user.displayName}
              </div>
              <div className="text-xs text-muted-foreground">
                Trust Score: {user.score}
              </div>
            </div>
            
            <Badge 
              className={`bg-gradient-to-r ${tierInfo.style} text-white font-bold text-xs px-2 py-1`}
            >
              {tierInfo.tier}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`clay-card border-none bg-gradient-to-br ${getScoreColor(user.score)}/10 ${className}`}>
      <CardContent className="p-4">
        {/* Header with avatar and name */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-white/20">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg text-foreground">
              {user.displayName}
            </div>
            {user.username && (
              <div className="text-sm text-muted-foreground">
                @{user.username}
              </div>
            )}
          </div>
          
          <Badge 
            className={`bg-gradient-to-r ${tierInfo.style} text-white font-bold px-3 py-1`}
          >
            {tierInfo.tier}
          </Badge>
        </div>

        {/* Trust Score Display */}
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(user.score)} bg-clip-text text-transparent`}>
            {user.score}
          </div>
          <div className="text-lg font-medium text-muted-foreground">
            {tierInfo.tier} Trust Score
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              {user.stats?.vouch?.received?.count || 0}
            </div>
            <div className="text-xs text-muted-foreground">Vouches</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              {user.stats?.review?.received?.positive || 0}
            </div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              {user.xpTotal || Math.floor(user.score * 12)}
            </div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Verified by Ethos</span>
          </div>
          <div>
            EthosRadar.app
          </div>
        </div>
      </CardContent>
    </Card>
  );
}