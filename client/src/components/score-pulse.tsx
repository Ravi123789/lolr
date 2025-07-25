import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, Zap, Calendar, BarChart3, Eye } from "lucide-react";
import { useUserProfile } from "@/hooks/use-ethos-api";

interface ScoreHistory {
  timestamp: string;
  score: number;
  change: number;
  reason?: string;
  activity?: string;
}

interface ScorePulseProps {
  className?: string;
}

export function ScorePulse({ className = "" }: ScorePulseProps) {
  const { user } = useUserProfile();
  const [scoreHistory, setScoreHistory] = useState<{
    data: ScoreHistory[];
    loading: boolean;
    currentStreak: number;
    totalChanges: number;
  }>({
    data: [],
    loading: true,
    currentStreak: 0,
    totalChanges: 0,
  });
  const [viewMode, setViewMode] = useState<'timeline' | 'stats'>('timeline');
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.userkeys?.[0]) {
      fetchScoreHistory();
    }
  }, [user]);

  const fetchScoreHistory = async () => {
    if (!user?.userkeys?.[0]) return;

    setScoreHistory(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/score-history/${encodeURIComponent(user.userkeys[0])}`);
      const data = await response.json();

      if (data.success && data.data?.length > 0) {
        // V1 API returns direct array of history entries
        const historyEntries = data.data.map((entry: any, index: number) => ({
          timestamp: entry.timestamp || new Date().toISOString(),
          score: entry.score || 0,
          change: index > 0 ? entry.score - data.data[index - 1].score : 0,
          activity: entry.activity || 'score_update'
        }));

        setScoreHistory({
          data: historyEntries,
          loading: false,
          currentStreak: calculateStreakFromHistory(historyEntries),
          totalChanges: historyEntries.length,
        });
      } else {
        console.log('No V1 score history data available');
        setScoreHistory({
          data: [],
          loading: false,
          currentStreak: 0,
          totalChanges: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch V1 score history:', error);
      setScoreHistory({
        data: [],
        loading: false,
        currentStreak: 0,
        totalChanges: 0,
      });
    }
  };

  const calculateStreakFromHistory = (history: ScoreHistory[]) => {
    if (!history.length) return 0;
    
    let streak = 0;
    const now = new Date();
    
    for (let i = history.length - 1; i >= 0; i--) {
      const entryDate = new Date(history[i].timestamp);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return Math.min(streak, 30);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const scoreStats = {
    totalIncrease: scoreHistory.data.reduce((sum, item) => sum + Math.max(0, item.change), 0),
    totalDecrease: Math.abs(scoreHistory.data.reduce((sum, item) => sum + Math.min(0, item.change), 0)),
    averageChange: scoreHistory.data.length > 0 
      ? Math.round(scoreHistory.data.reduce((sum, item) => sum + item.change, 0) / scoreHistory.data.length)
      : 0,
    biggestGain: Math.max(0, ...scoreHistory.data.map(item => item.change)),
  };

  if (!user) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center py-4">
          <Activity className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <div className="text-xs text-muted-foreground">
            Search for a user to view score pulse
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 animate-slide-up ${className}`} style={{ animationDelay: '0.6s' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-semibold text-foreground">Score Pulse</span>
        </div>
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="h-6 px-2 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'stats' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('stats')}
            className="h-6 px-2 text-xs"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Stats
          </Button>
        </div>
      </div>

      {/* Current Score with Pulse Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-red-500/10 rounded-2xl blur animate-pulse-slow"></div>
        <div className="relative bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-3 border border-white/20 dark:border-gray-700/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {user.score}
            </div>
            <div className="text-xs text-muted-foreground mb-2">Current Trust Score</div>
            {scoreHistory.data.length > 0 ? (
              <div className="flex items-center justify-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400">+{scoreStats.totalIncrease} gains</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-muted-foreground">{scoreHistory.totalChanges} changes</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Score tracking begins with first network activity
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div className="space-y-1.5">
          {scoreHistory.loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-xs text-muted-foreground">Loading score pulse...</span>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {scoreHistory.data.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-xs text-muted-foreground">No score changes yet</div>
                  <div className="text-xs text-gray-500 mt-1">Start building trust to see score pulse</div>
                </div>
              ) : (
                scoreHistory.data.slice(0, 10).map((item, index) => (
                  <div key={index} className="bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getChangeIcon(item.change)}
                        <div className="text-xs font-medium text-foreground">
                          Score: {item.score}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-1.5 py-0.5 ${getChangeColor(item.change)}`}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center space-x-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{formatDate(item.timestamp)}</span>
                      </span>
                      {item.activity && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {item.activity}
                        </Badge>
                      )}
                    </div>
                    {item.reason && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                        {item.reason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Stats View */
        scoreHistory.data.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-200 to-orange-300 dark:from-yellow-700 dark:to-orange-600 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Score Activity Tracking
              </div>
              <div className="text-xs text-muted-foreground">
                Your score pulse will appear here as you engage with the Ethos community
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-center p-2 bg-white/20 dark:bg-gray-700/20 rounded-lg">
                <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Ready</div>
                <div className="text-xs text-muted-foreground">Tracking</div>
              </div>
              <div className="text-center p-2 bg-white/20 dark:bg-gray-700/20 rounded-lg">
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{user.score}</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>

            <div className="text-xs text-center text-muted-foreground mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
              💡 Score changes are tracked automatically as you build trust on Ethos
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
                <div className="text-center">
                  <div className="text-base font-bold text-green-600 dark:text-green-400">
                    +{scoreStats.totalIncrease}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Gains (30d)</div>
                </div>
              </div>
              <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
                <div className="text-center">
                  <div className="text-base font-bold text-red-600 dark:text-red-400">
                    -{scoreStats.totalDecrease}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Drops (30d)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
                <div className="text-center">
                  <div className="text-base font-bold text-yellow-600 dark:text-yellow-400">
                    +{scoreStats.biggestGain}
                  </div>
                  <div className="text-xs text-muted-foreground">Biggest Single Gain</div>
                </div>
              </div>
              <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
                <div className="text-center">
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {scoreHistory.totalChanges}
                  </div>
                  <div className="text-xs text-muted-foreground">Score Updates (30d)</div>
                </div>
              </div>
            </div>

            {/* Score Pulse Insights */}
            <div className="bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>
                    {scoreStats.averageChange > 0 ? 'Positive' : scoreStats.averageChange < 0 ? 'Negative' : 'Neutral'} trend detected (30 days)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Score tracked from {scoreHistory.totalChanges} authentic Ethos activities
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}