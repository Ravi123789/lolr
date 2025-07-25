import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HandHeart, TrendingUp, Users, Coins } from "lucide-react";
import { useUserProfile, useUserStats } from "@/hooks/use-ethos-api";

interface VouchDetail {
  voucher: string;
  vouchee: string;
  amount: string;
  amountEth: string;
  timestamp: string;
  comment?: string;
  platform?: string;
}

interface UserVouchIntelligenceProps {
  className?: string;
}

export function UserVouchIntel({ className = "" }: UserVouchIntelligenceProps) {
  const { user } = useUserProfile();
  const { data: userStats } = useUserStats(user?.userkeys?.[0]);
  const [vouchDetails, setVouchDetails] = useState<{
    received: VouchDetail[];
    given: VouchDetail[];
    loading: boolean;
    ethUsdRate?: number;
  }>({
    received: [],
    given: [],
    loading: true,
  });
  const [showGiven, setShowGiven] = useState(false);

  useEffect(() => {
    if (user?.userkeys?.[0]) {
      fetchUserVouches();
    }
  }, [user]);

  const fetchUserVouches = async () => {
    if (!user?.userkeys?.[0]) return;

    setVouchDetails(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/user-vouch-activities/${encodeURIComponent(user.userkeys[0])}`);
      const data = await response.json();

      if (data.success) {
        setVouchDetails({
          received: data.data.received || [],
          given: data.data.given || [],
          loading: false,
          ethUsdRate: data.data.ethUsdRate || 3400,
        });
      } else {
        console.error('Failed to fetch vouch activities:', data.error);
        setVouchDetails({
          received: [],
          given: [],
          loading: false,
          ethUsdRate: 3400,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user vouch details:', error);
      setVouchDetails({
        received: [],
        given: [],
        loading: false,
        ethUsdRate: 3400,
      });
    }
  };

  const formatAmount = (weiAmount: string | number) => {
    const amount = typeof weiAmount === 'string' ? weiAmount : weiAmount.toString();
    if (!amount || amount === '0') return '0.000';
    const eth = parseFloat(amount) / 1e18;
    return eth < 0.001 ? '<0.001' : eth.toFixed(3);
  };

  const formatTimestamp = (timestamp: string | number) => {
    let date: Date;
    if (typeof timestamp === 'string') {
      if (timestamp.includes('T')) {
        date = new Date(timestamp);
      } else {
        date = new Date(parseInt(timestamp) * 1000);
      }
    } else {
      date = new Date(timestamp * 1000);
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center py-4">
          <HandHeart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <div className="text-sm text-muted-foreground">
            Search for a user first to view their vouch intel
          </div>
        </div>
      </div>
    );
  }

  const receivedStats = (userStats as any)?.data?.vouch?.received || user?.stats?.vouch?.received;
  const givenStats = (userStats as any)?.data?.vouch?.given || user?.stats?.vouch?.given;

  return (
    <div className={`space-y-3 animate-slide-up miniapp-optimized ${className}`} style={{ animationDelay: '0.6s' }}>
      {/* Modern Header with Gradient - Mobile Optimized */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <HandHeart className="h-3 w-3 text-pink-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-xs font-semibold bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
            Vouch Intel
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Glassmorphism Summary Cards */}
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-orange-500/10 rounded-2xl blur animate-pulse-slow"></div>
        
        <div className="relative grid grid-cols-2 gap-2 p-2 bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/30 dark:border-gray-700/30">
          <div className="text-center space-y-1">
            <div className="relative">
              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                {receivedStats?.count || 0}
              </div>
              <div className="text-xs font-medium text-green-600/70 dark:text-green-400/70">
                Received
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-foreground">
                {receivedStats?.amountWeiTotal ? formatAmount(receivedStats.amountWeiTotal) : '0.000'} ETH
              </div>
              {vouchDetails.ethUsdRate && receivedStats?.amountWeiTotal && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ${(parseFloat(formatAmount(receivedStats.amountWeiTotal).replace('<', '')) * vouchDetails.ethUsdRate).toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-l border-white/20 dark:border-gray-700/30 pl-2">
            <div className="text-center space-y-1">
              <div className="relative">
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {givenStats?.count || 0}
                </div>
                <div className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70">
                  Given
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">
                  {givenStats?.amountWeiTotal ? formatAmount(givenStats.amountWeiTotal) : '0.000'} ETH
                </div>
                {vouchDetails.ethUsdRate && givenStats?.amountWeiTotal && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    ${(parseFloat(formatAmount(givenStats.amountWeiTotal).replace('<', '')) * vouchDetails.ethUsdRate).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Toggle Pills */}
      <div className="flex items-center justify-center p-1 bg-white/20 dark:bg-gray-800/30 rounded-full backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGiven(false)}
          className={`h-7 px-3 text-xs rounded-full transition-all duration-300 ${
            !showGiven 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Received ({receivedStats?.count || 0})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGiven(true)}
          className={`h-7 px-3 text-xs rounded-full transition-all duration-300 ${
            showGiven 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-3 h-3 mr-1" />
          Given ({givenStats?.count || 0})
        </Button>
      </div>

      {/* Premium Vouch Details */}
      <div className="relative">
        {vouchDetails.loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-xs text-muted-foreground">Loading vouches...</span>
          </div>
        ) : (
          <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-pink-700">
            {(showGiven ? vouchDetails.given : vouchDetails.received).length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-8 h-8 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <HandHeart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  {showGiven ? 'No vouches given' : 'No vouches received yet'}
                </div>
                <div className="text-xs text-gray-500">
                  {showGiven ? 'No vouches given on Ethos' : 'Build reputation to earn vouches'}
                </div>
              </div>
            ) : (
              (showGiven ? vouchDetails.given : vouchDetails.received).map((vouch, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2 border border-white/30 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${showGiven ? 'bg-blue-400' : 'bg-green-400'} animate-pulse`}></div>
                        <div className="text-xs font-semibold text-foreground truncate">
                          {showGiven ? 
                            `To: ${(vouch.vouchee || '').slice(0, 14)}${vouch.vouchee?.length > 14 ? '...' : ''}` : 
                            `From: ${(vouch.voucher || '').slice(0, 14)}${vouch.voucher?.length > 14 ? '...' : ''}`
                          }
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="px-1.5 py-0.5 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full">
                          <div className="flex items-center space-x-1">
                            <Coins className="w-2 h-2 text-white" />
                            <span className="text-xs font-bold text-white">
                              {parseFloat(vouch.amountEth).toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatTimestamp(vouch.timestamp)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {vouchDetails.ethUsdRate && (
                          <span className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            ${(parseFloat(vouch.amountEth) * vouchDetails.ethUsdRate).toFixed(2)}
                          </span>
                        )}
                        {vouch.platform && (
                          <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                            {vouch.platform === 'x.com' ? '𝕏' : vouch.platform}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {vouch.comment && vouch.comment.trim() && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-1.5 rounded-lg border border-gray-200/50 dark:border-gray-600/50 italic">
                        "{vouch.comment.slice(0, 80)}{vouch.comment.length > 80 ? '...' : ''}"
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Premium Trust Insights */}
      <div className="relative mt-3">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur"></div>
        <div className="relative p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/30">
          {receivedStats?.count && givenStats?.count ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <span className="text-xs font-medium text-foreground">Trust Ratio</span>
                </div>
                <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {Math.round((receivedStats.count / (givenStats.count + receivedStats.count)) * 100)}% received
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500"></div>
                  <span className="text-xs font-medium text-foreground">Avg Amount</span>
                </div>
                <span className="text-xs font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                  {formatAmount(((parseFloat((receivedStats.amountWeiTotal || 0).toString()) + parseFloat((givenStats.amountWeiTotal || 0).toString())) / (receivedStats.count + givenStats.count)).toString())} ETH
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Building trust network on Ethos Protocol
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Start vouching to grow your network
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}