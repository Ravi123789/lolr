import { SimpleRadarLogo } from "@/components/holographic-logo";
import { Users, MessageSquare, Coins, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface EthosStats {
  totalProfiles: number;
  totalReviews: number;
  totalVouchedAmount: string;
  averageScore: number;
}

export function EthosStatsData() {
  const [stats, setStats] = useState<EthosStats>({
    totalProfiles: 0,
    totalReviews: 0,
    totalVouchedAmount: "0",
    averageScore: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will be replaced with real API
    const mockStats = {
      totalProfiles: 127450,
      totalReviews: 342156,
      totalVouchedAmount: "2,847.23 ETH",
      averageScore: 1456
    };

    // Immediate loading for fast performance
    setStats(mockStats);
    setIsLoading(false);
  }, []);

  const statsData = [
    {
      icon: Users,
      label: "PROFILES",
      value: isLoading ? "..." : stats.totalProfiles.toLocaleString(),
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: MessageSquare,
      label: "REVIEWS",
      value: isLoading ? "..." : stats.totalReviews.toLocaleString(),
      color: "from-green-500 to-emerald-500",
      delay: 50
    },
    {
      icon: Coins,
      label: "VOUCHED",
      value: isLoading ? "..." : stats.totalVouchedAmount,
      color: "from-orange-500 to-red-500",
      delay: 100
    },
    {
      icon: Target,
      label: "AVG SCORE",
      value: isLoading ? "..." : stats.averageScore.toLocaleString(),
      color: "from-purple-500 to-pink-500",
      delay: 150
    }
  ];

  return (
    <div className="hidden xl:block fixed left-6 top-1/2 transform -translate-y-1/2 w-72 z-10">
      {/* Ultra Modern Stats Dashboard */}
      <div className="ultra-modern-stats-panel">
        {/* Sleek Header */}
        <div className="stats-header">
          <div className="header-content">
            <div className="brand-section">
              <div className="modern-logo-wrapper">
                <SimpleRadarLogo className="w-8 h-8" />
              </div>
              <div className="stats-title">Ethos Protocol</div>
              <div className="stats-subtitle">Live Network</div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-item"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <div className={`stat-icon-wrapper bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}