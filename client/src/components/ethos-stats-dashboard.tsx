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
    <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 w-80 z-10">
      {/* Modern Aesthetic Dashboard */}
      <div className="modern-ethos-panel">
        {/* Header with Brand */}
        <div className="panel-header">
          <div className="header-content">
            <div className="brand-section">
              <div className="rotating-logo">
                <SimpleRadarLogo className="w-8 h-8" />
              </div>
              <div className="brand-info">
                <h3 className="brand-name">Ethos Protocol</h3>
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span className="live-text">Live Network</span>
                </div>
              </div>
            </div>
          </div>
          <div className="header-accent"></div>
        </div>

        {/* Stats Section */}
        <div className="stats-container">
          <div className="stats-title">REAL-TIME DATA</div>
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div
                key={stat.label}
                className="modern-stat-card"
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className="stat-card-inner">
                  <div className={`stat-icon-container bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="stat-icon" />
                  </div>
                  <div className="stat-details">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-number">{stat.value}</div>
                  </div>
                  <div className={`stat-glow-effect bg-gradient-to-r ${stat.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating orbs for aesthetic */}
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>
    </div>
  );
}