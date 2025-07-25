import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Users, TrendingUp, Eye, BarChart3, Sparkles, Activity } from "lucide-react";
import { useUserProfile } from "@/hooks/use-ethos-api";
import { useQuery } from "@tanstack/react-query";

interface NetworkNode {
  id: string;
  label: string;
  trustScore: number;
  userkey: string;
  avatarUrl?: string;
  connections: number;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  weight: number;
  type: string;
  color?: string;
}

interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  stats: {
    totalNodes: number;
    totalConnections: number;
    averageTrustScore: number;
    networkStrength: number;
  };
}

export function TrustNetworkGraph() {
  const { user } = useUserProfile();
  const [viewMode, setViewMode] = useState<'network' | 'stats'>('network');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [positionedNodes, setPositionedNodes] = useState<(NetworkNode & { x: number; y: number })[]>([]);

  // Fetch real network data
  const { data: networkData, isLoading, error } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/user-network', user?.userkeys?.[0]],
    queryFn: async () => {
      if (!user?.userkeys?.[0]) throw new Error('No userkey available');
      const response = await fetch(`/api/user-network/${encodeURIComponent(user.userkeys[0])}`);
      if (!response.ok) throw new Error('Failed to fetch network data');
      return response.json();
    },
    enabled: !!user?.userkeys?.[0],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Smooth animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Calculate non-colliding node positions using force-directed layout
  useEffect(() => {
    if (networkData?.success && networkData.data?.connections && Array.isArray(networkData.data.connections)) {
      // Convert connections to nodes format for visualization
      const nodes: NetworkNode[] = [
        {
          id: 'center',
          label: user?.displayName || 'You',
          trustScore: user?.score || 1000,
          userkey: user?.userkeys?.[0] || '',
          connections: networkData.data.connections.length
        },
        ...networkData.data.connections.slice(0, 12).map((conn: any, index: number) => ({
          id: conn.userkey || `node-${index}`,
          label: conn.displayName || conn.username || `User ${index + 1}`,
          trustScore: conn.score || 1000,
          userkey: conn.userkey || `user-${index}`,
          connections: conn.totalInteractions || 1
        }))
      ];
      
      const positioned = calculateNodePositions(nodes);
      setPositionedNodes(positioned);
    } else {
      setPositionedNodes([]);
    }
  }, [networkData, user]);

  if (!user) {
    return (
      <div className="space-y-3">
        <div className="text-center py-4">
          <Network className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <div className="text-xs text-muted-foreground">
            Search for a user to view trust network
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-foreground">Trust Network</span>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-xs text-muted-foreground">Loading network connections...</div>
        </div>
      </div>
    );
  }

  if (error || !networkData?.success) {
    // Show an informative visualization even when no network data exists
    return (
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Network className="h-4 w-4 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Trust Network
            </span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={viewMode === 'network' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('network')}
              className="h-6 px-2 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
              Graph
            </Button>
            <Button
              variant={viewMode === 'stats' ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode('stats')}
              className="h-6 px-2 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Stats
            </Button>
          </div>
        </div>

        {/* Building Network State */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 rounded-2xl blur animate-pulse-slow"></div>
          
          <div className="relative bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-gray-700/30">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-blue-700 dark:to-indigo-600 rounded-full flex items-center justify-center">
                <Network className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Building Your Trust Network
                </div>
                <div className="text-xs text-muted-foreground">
                  Start engaging with the Ethos community to build connections
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-white/20 dark:bg-gray-700/20 rounded-lg">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">0</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center p-2 bg-white/20 dark:bg-gray-700/20 rounded-lg">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">0</div>
                  <div className="text-xs text-muted-foreground">Vouches</div>
                </div>
                <div className="text-center p-2 bg-white/20 dark:bg-gray-700/20 rounded-lg">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">0</div>
                  <div className="text-xs text-muted-foreground">Connections</div>
                </div>
              </div>

              <div className="text-xs text-center text-muted-foreground mt-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                💡 Your trust network will appear here as you interact with others on Ethos Protocol
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  function calculateNodePositions(networkNodes: NetworkNode[]): (NetworkNode & { x: number; y: number })[] {
    const positioned: (NetworkNode & { x: number; y: number })[] = [];
    const svgWidth = 280;
    const svgHeight = 160;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const minDistance = 45; // Minimum distance between nodes to prevent collision

    networkNodes.forEach((node, index) => {
      let x: number, y: number;
      
      if (node.id === 'center') {
        // Center node in the middle
        x = centerX;
        y = centerY;
      } else {
        // Position other nodes in a circle around center with collision avoidance
        const angle = (index * 2 * Math.PI) / (networkNodes.length - 1);
        const radius = Math.min(60, 40 + (networkNodes.length * 3)); // Dynamic radius
        
        let attempts = 0;
        do {
          x = centerX + Math.cos(angle + (attempts * 0.5)) * (radius + (attempts * 10));
          y = centerY + Math.sin(angle + (attempts * 0.5)) * (radius + (attempts * 10));
          attempts++;
        } while (attempts < 10 && positioned.some(existing => 
          Math.sqrt(Math.pow(x - existing.x, 2) + Math.pow(y - existing.y, 2)) < minDistance
        ));

        // Ensure nodes stay within bounds
        x = Math.max(25, Math.min(svgWidth - 25, x));
        y = Math.max(25, Math.min(svgHeight - 25, y));
      }

      positioned.push({
        ...node,
        x,
        y,
        size: node.id === 'center' ? 20 : Math.max(12, 16 - (index * 0.5)),
        color: node.id === 'center' ? '#ff6500' : getTrustScoreColor(node.trustScore)
      });
    });

    return positioned;
  }

  function getTrustScoreColor(score: number): string {
    if (score >= 800) return '#22c55e'; // Green for high trust
    if (score >= 600) return '#3b82f6'; // Blue for good trust
    if (score >= 400) return '#f59e0b'; // Orange for medium trust
    if (score >= 200) return '#8b5cf6'; // Purple for low trust
    return '#ef4444'; // Red for very low trust
  }

  function getEdgeColor(type: string, weight: number): string {
    const alpha = Math.max(0.3, Math.min(1.0, weight * 10)); // Scale alpha based on weight
    switch (type) {
      case 'vouch':
        return `rgba(34, 197, 94, ${alpha})`; // Green with alpha
      case 'review':
        return `rgba(59, 130, 246, ${alpha})`; // Blue with alpha
      default:
        return `rgba(100, 116, 139, ${alpha})`; // Gray with alpha
    }
  }

  // Use real network data or create edges from connections
  const nodes = positionedNodes;
  const edges = networkData?.data?.connections ? 
    networkData.data.connections.slice(0, 12).map((conn: any, index: number) => ({
      from: 'center',
      to: conn.userkey || `node-${index}`,
      type: conn.isReciprocal ? 'mutual' : (conn.receivedReviews > 0 ? 'incoming' : 'outgoing'),
      weight: Math.min(conn.totalInteractions, 5),
      color: getEdgeColor(conn.isReciprocal ? 'mutual' : (conn.receivedReviews > 0 ? 'incoming' : 'outgoing'), conn.totalInteractions)
    })) : [];

  const getNodePosition = (node: NetworkNode & { x: number; y: number }) => {
    const pulse = Math.sin(animationPhase * 0.5) * 2;
    return {
      x: node.x + (node.id === 'center' ? pulse : pulse * 0.3),
      y: node.y + (node.id === 'center' ? pulse * 0.5 : pulse * 0.2)
    };
  };

  const networkStats = networkData?.data ? {
    totalNodes: (networkData.data.connections?.length || 0) + 1, // +1 for center node
    totalConnections: networkData.data.totalConnections || 0,
    averageTrustScore: networkData.data.connections?.length > 0 ? 
      Math.round(networkData.data.connections.reduce((sum: number, conn: any) => sum + (conn.score || 1000), 0) / networkData.data.connections.length) : 1000,
    networkStrength: networkData.data.strongConnections || 0,
    strongConnections: networkData.data.strongConnections || 0, // Make sure this field exists
    reciprocalConnections: networkData.data.reciprocalConnections || 0,
    avgTrustScore: networkData.data.connections?.length > 0 ? 
      Math.round(networkData.data.connections.reduce((sum: number, conn: any) => sum + (conn.score || 1000), 0) / networkData.data.connections.length) : 1000,
    networkDensity: networkData.data.connections?.length > 0 ? 
      Math.round((networkData.data.reciprocalConnections || 0) / networkData.data.connections.length * 100) : 0
  } : {
    totalNodes: 0,
    totalConnections: 0,
    averageTrustScore: 0,
    networkStrength: 0,
    strongConnections: 0,
    reciprocalConnections: 0,
    avgTrustScore: 1000,
    networkDensity: 0
  };

  return (
    <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Network className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm font-semibold text-foreground">Trust Network</span>
          <Sparkles className="h-3 w-3 text-orange-500 animate-pulse" />
        </div>
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'network' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('network')}
            className="h-6 px-2 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Graph
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

      {viewMode === 'network' ? (
        <div className="relative">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-orange-500/5 rounded-2xl blur animate-pulse-slow"></div>
          
          {/* Network visualization */}
          <div className="relative bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <svg
              width="280"
              height="160"
              className="w-full h-full"
              viewBox="0 0 280 160"
            >
              {/* Animated background grid */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-300/20 dark:text-gray-600/20"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Edges with animation */}
              {edges.map((edge: any, index: number) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const fromPos = getNodePosition(fromNode);
                const toPos = getNodePosition(toNode);
                const opacity = 0.6 + Math.sin(animationPhase + index) * 0.3;

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      stroke={edge.color}
                      strokeWidth={2 + (edge.weight || 0) * 3}
                      strokeOpacity={opacity}
                      className="transition-all duration-1000"
                    />
                    {/* Connection strength indicator */}
                    <circle
                      cx={(fromPos.x + toPos.x) / 2}
                      cy={(fromPos.y + toPos.y) / 2}
                      r={1 + (edge.weight || 0) * 2}
                      fill={edge.color}
                      fillOpacity={opacity}
                      className="animate-pulse"
                    />
                  </g>
                );
              })}

              {/* Nodes with enhanced animation */}
              {nodes.map((node, index) => {
                const pos = getNodePosition(node);
                const isSelected = selectedNode === node.id;
                const scale = isSelected ? 1.2 : 1;
                const pulseIntensity = node.id === 'center' ? 1.3 : 1.1;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-110"
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    {/* Glow effect */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={(node.size || 10) * scale * pulseIntensity}
                      fill={node.color}
                      fillOpacity={0.1}
                      className="animate-pulse"
                    />
                    
                    {/* Main node */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={(node.size || 10) * scale}
                      fill={node.color}
                      fillOpacity={0.9}
                      stroke="white"
                      strokeWidth={node.id === 'center' ? 3 : 2}
                      className="transition-all duration-300 drop-shadow-lg"
                    />
                    
                    {/* Trust score indicator */}
                    <text
                      x={pos.x}
                      y={pos.y + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fill="white"
                      className="pointer-events-none"
                    >
                      {node.trustScore}
                    </text>

                    {/* Node label */}
                    <text
                      x={pos.x}
                      y={pos.y + (node.size || 10) + 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="medium"
                      className="fill-current text-foreground pointer-events-none"
                    >
                      {(node.label || 'Unknown').length > 8 ? `${(node.label || 'Unknown').slice(0, 8)}...` : (node.label || 'Unknown')}
                    </text>

                    {/* Connection count badge */}
                    <circle
                      cx={pos.x + (node.size || 10) * 0.7}
                      cy={pos.y - (node.size || 10) * 0.7}
                      r="6"
                      fill="#22c55e"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x + (node.size || 10) * 0.7}
                      y={pos.y - (node.size || 10) * 0.7 + 2}
                      textAnchor="middle"
                      fontSize="6"
                      fontWeight="bold"
                      fill="white"
                      className="pointer-events-none"
                    >
                      {node.connections}
                    </text>
                  </g>
                );
              })}

              {/* Animated particles for effect */}
              {[...Array(3)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 80 + Math.sin(animationPhase + i) * 20}
                  cy={30 + Math.cos(animationPhase + i) * 10}
                  r="1"
                  fill="#ff6500"
                  fillOpacity={0.5}
                  className="animate-bounce"
                />
              ))}
            </svg>

            {/* Node details popup */}
            {selectedNode && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 border border-white/30 dark:border-gray-700/30">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode);
                    return node ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-foreground">{node.label}</div>
                          <div className="text-xs text-muted-foreground">Trust: {node.trustScore}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            <Users className="w-2.5 h-2.5 mr-0.5" />
                            {node.connections}
                          </Badge>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Stats View */
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {networkStats.totalConnections}
                </div>
                <div className="text-xs text-muted-foreground">Total Links</div>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="text-base font-bold text-green-600 dark:text-green-400">
                  {networkStats.strongConnections}
                </div>
                <div className="text-xs text-muted-foreground">Strong Links</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="text-base font-bold text-orange-600 dark:text-orange-400">
                  {networkStats.avgTrustScore}
                </div>
                <div className="text-xs text-muted-foreground">Avg Trust</div>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="text-base font-bold text-purple-600 dark:text-purple-400">
                  {networkStats.networkDensity}%
                </div>
                <div className="text-xs text-muted-foreground">Density</div>
              </div>
            </div>
          </div>

          {/* Network insights */}
          <div className="bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 dark:border-gray-700/20">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Network growth: Strong connections detected</span>
              </div>
              <div className="text-xs text-gray-500">
                Your trust network spans {nodes.length} verified profiles
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}