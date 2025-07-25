import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, TrendingUp, Clock, Heart, Award, Zap } from "lucide-react";
import { useUserProfile, useUserStats } from "@/hooks/use-ethos-api";

export function RecentActivity() {
  const { user } = useUserProfile();
  const { data: statsData } = useUserStats(user?.userkeys?.[0]);

  if (!user) return null;

  // Real usernames from Ethos network
  const ethosUsers = [
    { username: 'kmickey313', name: 'TheRock.lvl ⌘', avatar: 'https://pbs.twimg.com/profile_images/1944713754786267137/LLlHlISZ.jpg' },
    { username: '0x_rizz', name: 'rizzzz.eth', avatar: 'https://pbs.twimg.com/profile_images/1943552485064343553/VqdEBuWJ.jpg' },
    { username: 'DegenKid4', name: 'Degen Kid', avatar: 'https://pbs.twimg.com/profile_images/1938955751155793920/S5eKehYw.jpg' },
    { username: 'SajibDeb_bd', name: 'sajibdeb.eth 🏴‍☠️', avatar: 'https://pbs.twimg.com/profile_images/1908209885575294976/YuO6ITMY.jpg' },
    { username: '0xEthRupesh', name: 'Rupesh', avatar: 'https://pbs.twimg.com/profile_images/1878084787891503104/HorVbIBN.jpg' },
    { username: 'badrionchain', name: 'badri', avatar: 'https://pbs.twimg.com/profile_images/1894053168834596864/molPA49i.jpg' },
    { username: 'Nixeorbin', name: 'Nixeorbin 🐋', avatar: 'https://pbs.twimg.com/profile_images/1875164644270292992/PjtbV3oG.jpg' }
  ];

  // Use 100% real API data now that we have working endpoints
  const realStats = (statsData as any)?.success ? (statsData as any).data : user?.stats;
  
  // Get real data from API stats or user object (now contains accurate data from Ethos V2 API)
  const totalPositiveReviews = realStats?.review?.received?.positive || user?.stats?.review?.received?.positive || 0;
  const totalVouches = realStats?.vouch?.received?.count || user?.stats?.vouch?.received?.count || 0;
  const vouchAmountWei = realStats?.vouch?.received?.amountWeiTotal || user?.stats?.vouch?.received?.amountWeiTotal || 0;
  const vouchAmount = typeof vouchAmountWei === 'string' ? 
    parseFloat(vouchAmountWei) / 1e18 : 
    vouchAmountWei / 1e18;
  const userXP = user?.xpTotal || 0;

  const generateActivities = () => {
    const activities = [];
    
    // XP Activity
    if (userXP > 0) {
      activities.push({
        id: 'xp-total',
        type: 'xp',
        value: userXP,
        label: 'Total XP Earned',
        timestamp: 'Current',
        verified: true
      });
    }

    // Positive Reviews
    if (totalPositiveReviews > 0) {
      activities.push({
        id: 'reviews-total',
        type: 'reviews',
        value: totalPositiveReviews,
        label: 'Total Positive Reviews',
        timestamp: 'All Time',
        verified: true
      });
    }

    // Vouches with amount
    if (totalVouches > 0) {
      const amountInEth = vouchAmount.toFixed(4);
      activities.push({
        id: 'vouches-total',
        type: 'vouches',
        value: totalVouches,
        amount: amountInEth,
        label: `Total Vouches (${amountInEth} ETH)`,
        timestamp: 'All Time',
        verified: true
      });
    }

    // Trust Score
    if (user?.score && user.score > 0) {
      activities.push({
        id: 'trust-score',
        type: 'score',
        value: user?.score || 0,
        label: 'Current Trust Score',
        timestamp: 'Live',
        verified: true
      });
    }

    // Account connections
    const accountCount = user?.userkeys?.length || 1;
    activities.push({
      id: 'accounts',
      type: 'accounts',
      value: accountCount,
      label: 'Connected Accounts',
      timestamp: 'Current',
      verified: true
    });

    return activities;
  };

  const activities = generateActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'xp': return Award;
      case 'reviews': return MessageSquare;
      case 'vouches': return Star;
      case 'score': return TrendingUp;
      case 'accounts': return Clock;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'xp': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'reviews': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'vouches': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'score': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'accounts': return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Recent Activity
            <Badge variant="outline" className="ml-auto text-xs">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = getActivityIcon((activity as any).type);
              const colorClasses = getActivityColor((activity as any).type);
              
              return (
                <div key={(activity as any).id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-200 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{(activity as any).label}</div>
                      <div className="text-xs text-muted-foreground">{(activity as any).timestamp}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{(activity as any).value?.toLocaleString() || '0'}</div>
                      {(activity as any).type === 'vouches' && (activity as any).amount && (
                        <div className="text-xs text-green-600 font-medium">{(activity as any).amount} ETH</div>
                      )}
                    </div>
                    {(activity as any).verified && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        ✓ Live
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Start building your trust network!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}