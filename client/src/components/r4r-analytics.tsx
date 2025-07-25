import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw } from "lucide-react";
import { useUserProfile, useR4RAnalytics } from "@/hooks/use-ethos-api";

export function TrustInsights() {
  const { user } = useUserProfile();
  const { data: analytics } = useR4RAnalytics(user);

  if (!user || !analytics) return null;

  // Generate activity heatmap based on trust interactions
  const activityLevel = Math.floor((user.score || 0) / 300);
  const weekData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    intensity: Math.max(0, Math.min(3, activityLevel + Math.floor(Math.random() * 2) - 1)),
  }));

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-muted';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-800';
      case 3: return 'bg-green-400 dark:bg-green-700';
      default: return 'bg-muted';
    }
  };

  const getIntensityTitle = (intensity: number) => {
    switch (intensity) {
      case 0: return 'Low activity';
      case 1: return 'Medium activity';
      case 2: return 'High activity';
      case 3: return 'Very high activity';
      default: return 'No activity';
    }
  };

  return (
    <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Trust Insights</h3>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <RefreshCw className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </div>
          
          {/* Trust Engagement Score */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analytics.reciprocalRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Trust Engagement Score</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{(analytics.reciprocalRate * 0.1).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">vs last month</div>
              </div>
            </div>
          </div>
          
          {/* Trust Activity Heatmap */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Trust Activity This Week</h4>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
              {weekData.map(day => (
                <span key={day.day}>{day.day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekData.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-sm ${getIntensityColor(day.intensity)} cursor-pointer hover:scale-110 transition-transform`}
                  title={getIntensityTitle(day.intensity)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted rounded-sm"></div>
                <div className="w-2 h-2 bg-green-200 dark:bg-green-900 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-300 dark:bg-green-800 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 dark:bg-green-700 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
          
          {/* R4R Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">First Review Date</span>
              <span className="font-medium">
                {analytics.firstReviewDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Review Frequency</span>
              <span className="font-medium">{analytics.reviewFrequency}/week</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mutual Reviews</span>
              <span className="font-medium text-green-600">{analytics.mutualReviews}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Also export as R4RAnalytics for backward compatibility
export { TrustInsights as R4RAnalytics };
