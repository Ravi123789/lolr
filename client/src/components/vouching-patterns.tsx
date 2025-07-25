import { useState, useEffect } from "react";
import { HandHeart, Coins, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VouchData {
  voucher: string;
  vouchee: string;
  amount: number;
  timestamp: string;
  mutual: boolean;
}

interface VouchingSummary {
  totalVouchAmount: number;
  mutualVouches: number;
  topVouchersWeek: Array<{ address: string; amount: number }>;
  topVouchersMonth: Array<{ address: string; amount: number }>;
  recentVouches: VouchData[];
  error?: string;
}

export function VouchingPatterns() {
  const [vouchData, setVouchData] = useState<VouchingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVouchingData = async () => {
    setIsLoading(true);
    try {
      // Fetch real vouching data from Ethos V1 API using POST method as per documentation
      const response = await fetch('https://api.ethos.network/api/v1/vouches', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          limit: 50,
          offset: 0,
          orderBy: {
            vouchedAt: "desc"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Vouches API returned ${response.status}: ${response.statusText}`);
      }

      const vouchesResponse = await response.json();
      console.log('Vouches API response:', vouchesResponse);

      if (!vouchesResponse.ok || !vouchesResponse.data) {
        throw new Error('Invalid API response format');
      }

      // Transform API response to our expected format
      const processedData = processVouchingData(vouchesResponse.data.values || []);
      setVouchData(processedData);
    } catch (error) {
      console.error('Failed to fetch vouching data:', error);
      // Show error state but still provide structure
      setVouchData({
        totalVouchAmount: 0,
        mutualVouches: 0,
        topVouchersWeek: [],
        topVouchersMonth: [],
        recentVouches: [],
        error: `API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
    setIsLoading(false);
  };

  const processVouchingData = (apiData: any[]): VouchingSummary => {
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return {
        totalVouchAmount: 0,
        mutualVouches: 0,
        topVouchersWeek: [],
        topVouchersMonth: [],
        recentVouches: []
      };
    }

    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Calculate total ETH vouched (convert from wei to ETH)
    const totalVouchAmount = apiData.reduce((sum: number, vouch: any) => {
      const weiAmount = parseFloat(vouch.staked || vouch.balance || '0');
      const ethAmount = weiAmount / 1e18; // Convert wei to ETH
      return sum + ethAmount;
    }, 0);

    // Find mutual vouches using mutualId field from API
    const mutualVouches = apiData.filter(vouch => vouch.mutualId).length;

    // Filter vouches by time periods
    const weekVouches = apiData.filter(vouch => {
      const vouchTime = (vouch.activityCheckpoints?.vouchedAt || vouch.vouchedAt || 0) * 1000;
      return vouchTime >= weekAgo;
    });

    const monthVouches = apiData.filter(vouch => {
      const vouchTime = (vouch.activityCheckpoints?.vouchedAt || vouch.vouchedAt || 0) * 1000;
      return vouchTime >= monthAgo;
    });

    // Calculate top vouchers for week
    const weekVoucherTotals = new Map<number, { total: number, address: string }>();
    weekVouches.forEach((vouch: any) => {
      const profileId = vouch.authorProfileId;
      const weiAmount = parseFloat(vouch.staked || vouch.balance || '0');
      const ethAmount = weiAmount / 1e18;
      
      if (profileId && ethAmount > 0) {
        const current = weekVoucherTotals.get(profileId) || { total: 0, address: `Profile ${profileId}` };
        current.total += ethAmount;
        if (vouch.authorAddress && !current.address.includes('0x')) {
          current.address = vouch.authorAddress;
        }
        weekVoucherTotals.set(profileId, current);
      }
    });

    // Calculate top vouchers for month  
    const monthVoucherTotals = new Map<number, { total: number, address: string }>();
    monthVouches.forEach((vouch: any) => {
      const profileId = vouch.authorProfileId;
      const weiAmount = parseFloat(vouch.staked || vouch.balance || '0');
      const ethAmount = weiAmount / 1e18;
      
      if (profileId && ethAmount > 0) {
        const current = monthVoucherTotals.get(profileId) || { total: 0, address: `Profile ${profileId}` };
        current.total += ethAmount;
        if (vouch.authorAddress && !current.address.includes('0x')) {
          current.address = vouch.authorAddress;
        }
        monthVoucherTotals.set(profileId, current);
      }
    });

    const topVouchersWeek = Array.from(weekVoucherTotals.entries())
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5)
      .map(([profileId, data]) => ({ 
        address: data.address.length > 20 ? `${data.address.slice(0, 6)}...${data.address.slice(-4)}` : data.address,
        amount: parseFloat(data.total.toFixed(4)) 
      }));

    const topVouchersMonth = Array.from(monthVoucherTotals.entries())
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5)
      .map(([profileId, data]) => ({ 
        address: data.address.length > 20 ? `${data.address.slice(0, 6)}...${data.address.slice(-4)}` : data.address,
        amount: parseFloat(data.total.toFixed(4)) 
      }));

    // Get recent vouches (sorted by vouchedAt timestamp)
    const recentVouches = apiData
      .sort((a: any, b: any) => (b.vouchedAt || 0) - (a.vouchedAt || 0))
      .slice(0, 5)
      .map((vouch: any) => {
        const weiAmount = parseFloat(vouch.staked || vouch.balance || '0');
        const ethAmount = weiAmount / 1e18;
        
        return {
          voucher: vouch.authorProfileId ? `Profile ${vouch.authorProfileId}` : 'Unknown',
          vouchee: vouch.subjectAddress 
            ? `${vouch.subjectAddress.slice(0, 6)}...${vouch.subjectAddress.slice(-4)}`
            : vouch.subjectProfileId 
              ? `Profile ${vouch.subjectProfileId}`
              : 'Unknown',
          amount: parseFloat(ethAmount.toFixed(4)),
          timestamp: new Date((vouch.vouchedAt || Date.now() / 1000) * 1000).toISOString(),
          mutual: !!vouch.mutualId
        };
      });

    return {
      totalVouchAmount: parseFloat(totalVouchAmount.toFixed(4)),
      mutualVouches,
      topVouchersWeek,
      topVouchersMonth,
      recentVouches
    };
  };

  useEffect(() => {
    fetchVouchingData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (!vouchData) {
    return (
      <div className="text-center py-6">
        <HandHeart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 dark:text-muted-foreground">
          No vouching data available
        </p>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    if (address === "Current User") return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="clay-card border-none">
          <CardContent className="p-3 text-center">
            <Coins className="h-5 w-5 mx-auto mb-1" style={{ color: '#ff6500' }} />
            <div className="text-lg font-bold text-gray-800 dark:text-foreground">
              {vouchData.totalVouchAmount} ETH
            </div>
            <div className="text-xs text-gray-600 dark:text-muted-foreground">
              Total Vouched
            </div>
          </CardContent>
        </Card>
        
        <Card className="clay-card border-none">
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 mx-auto mb-1" style={{ color: '#ff6500' }} />
            <div className="text-lg font-bold text-gray-800 dark:text-foreground">
              {vouchData.mutualVouches}
            </div>
            <div className="text-xs text-gray-600 dark:text-muted-foreground">
              Mutual Vouches
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vouchers This Week */}
      <Card className="clay-card border-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4" style={{ color: '#ff6500' }} />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-foreground">
              Top Vouchers This Week
            </h3>
          </div>
          {vouchData.topVouchersWeek.length > 0 ? (
            <div className="space-y-2">
              {vouchData.topVouchersWeek.map((voucher, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-mono text-gray-700 dark:text-muted-foreground">
                      {formatAddress(voucher.address)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#ff6500' }}>
                    {voucher.amount} ETH
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                No vouches this week
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Vouchers This Month */}
      <Card className="clay-card border-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4" style={{ color: '#ff6500' }} />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-foreground">
              Top Vouchers This Month
            </h3>
          </div>
          {vouchData.topVouchersMonth.length > 0 ? (
            <div className="space-y-2">
              {vouchData.topVouchersMonth.map((voucher, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-mono text-gray-700 dark:text-muted-foreground">
                      {formatAddress(voucher.address)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#ff6500' }}>
                    {voucher.amount} ETH
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                No vouches this month
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Vouching Activity */}
      <Card className="clay-card border-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <HandHeart className="h-4 w-4" style={{ color: '#ff6500' }} />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-foreground">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {vouchData.recentVouches.map((vouch, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="font-mono text-gray-700 dark:text-muted-foreground">
                      {formatAddress(vouch.voucher)}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="font-mono text-gray-700 dark:text-muted-foreground">
                      {formatAddress(vouch.vouchee)}
                    </span>
                    {vouch.mutual && (
                      <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-1 rounded text-green-700 dark:text-green-400">
                        <HandHeart className="h-3 w-3" />
                        <span className="text-xs">Mutual</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimeAgo(vouch.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: '#ff6500' }}>
                    {vouch.amount} ETH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-2">
        <button
          onClick={fetchVouchingData}
          disabled={isLoading}
          className="text-xs px-3 py-1 bg-gradient-to-r from-orange-500/10 to-primary/10 text-orange-600 dark:text-orange-400 rounded-full hover:from-orange-500/20 hover:to-primary/20 transition-all duration-200"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {vouchData?.error ? 'Demo mode • API issue detected' : 'Live from Ethos Protocol'}
        </div>
      </div>
    </div>
  );
}