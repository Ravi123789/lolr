import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Zap, Radar } from "lucide-react";
import { SiEthereum, SiFarcaster, SiX, SiDiscord, SiTelegram } from "react-icons/si";
import { useSearchUser, useUserProfile } from "@/hooks/use-ethos-api";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SearchSuggestions } from "@/components/search-suggestions";

export function TrustScannerRedesigned() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const searchMutation = useSearchUser();
  const { user, setUser } = useUserProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Show compact version when user data is loaded
  const isCompactMode = !!user;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setShowSuggestions(false);

    const result = await searchMutation.mutateAsync({
      query: query.trim(),
      searchType: 'auto',
    });

    if (result.success && result.data) {
      setUser(result.data);
    }
  };

  const handleSuggestionSelect = async (suggestion: { userkey: string; displayName: string; username: string; avatarUrl?: string; score?: number; description?: string }) => {
    setQuery(suggestion.displayName || suggestion.username || suggestion.userkey);
    setShowSuggestions(false);
    
    const userData = {
      id: 0,
      profileId: 0,
      displayName: suggestion.displayName,
      username: suggestion.username,
      avatarUrl: suggestion.avatarUrl || '',
      description: suggestion.description || '',
      score: suggestion.score || 0,
      status: "ACTIVE",
      userkeys: [suggestion.userkey],
      xpTotal: Math.floor((suggestion.score || 0) * 1.2),
      xpStreakDays: Math.floor(Math.random() * 30),
      links: {
        profile: `https://app.ethos.network/profile/${suggestion.userkey}`,
        scoreBreakdown: `https://app.ethos.network/profile/${suggestion.userkey}/score`
      },
      stats: {
        review: {
          received: { positive: 0, neutral: 0, negative: 0 }
        },
        vouch: {
          given: { amountWeiTotal: 0, count: 0 },
          received: { amountWeiTotal: 0, count: 0 }
        }
      }
    };

    setUser(userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 1);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (query.length > 1) setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Compact search bar for when user is loaded
  if (isCompactMode) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {searchMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search any wallet, ENS, or social handle..."
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="flex-1 bg-transparent border-none text-gray-800 dark:text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium"
              />
              
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || searchMutation.isPending}
                className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative mt-2">
              <SearchSuggestions
                query={query}
                onSelect={handleSuggestionSelect}
                isVisible={showSuggestions}
                onVisibilityChange={setShowSuggestions}
              />
            </div>
          </div>
        </div>
        <LoadingOverlay 
          isVisible={searchMutation.isPending} 
          message="Scanning trust network..."
        />
      </>
    );
  }

  // Full scanner interface - completely redesigned for maximum width
  return (
    <>
      <div className="w-full px-2 py-4">
        {/* Ultra-wide container with no max-width constraints */}
        <div 
          className="w-full relative overflow-hidden rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            minWidth: '100%',
            maxWidth: 'none',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)'
          }}
        >
          {/* Dark mode background */}
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 dark:opacity-95 rounded-3xl"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-4 right-8 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-6 left-12 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-green-500/15 to-cyan-500/15 rounded-full blur-md animate-pulse delay-2000"></div>
          
          <div className="relative z-10 p-8">
            {/* Header with cool logo and text */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {/* Animated radar logo */}
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-orange-500/30"
                    style={{
                      background: 'linear-gradient(135deg, #ff6500 0%, #ff8533 50%, #ff6500 100%)',
                      animation: 'radarSpin 3s linear infinite'
                    }}
                  >
                    <Radar className="h-8 w-8 text-white drop-shadow-lg" />
                    
                    {/* Radar sweep effect */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 255, 255, 0.3) 60deg, transparent 120deg)',
                        animation: 'radarSweep 2s linear infinite'
                      }}
                    ></div>
                  </div>
                  
                  {/* Glowing rings */}
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-orange-400/40 animate-ping"></div>
                  <div className="absolute inset-[-8px] w-20 h-20 rounded-full border border-orange-300/20 animate-pulse"></div>
                </div>
                
                {/* Cool text logo */}
                <div>
                  <h1 
                    className="text-5xl font-black tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #ff6500 0%, #ff8533 25%, #ffaa66 50%, #ff6500 75%, #e55a00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 4px 8px rgba(255, 101, 0, 0.3)',
                      fontFamily: '"Orbitron", "Exo 2", "Rajdhani", monospace, sans-serif',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    TRUST
                  </h1>
                  <div 
                    className="text-2xl font-bold tracking-widest -mt-2"
                    style={{
                      background: 'linear-gradient(90deg, #666 0%, #333 50%, #666 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: '"Rajdhani", "Exo 2", sans-serif',
                      letterSpacing: '0.3em'
                    }}
                  >
                    SCANNER
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium max-w-2xl mx-auto">
                Analyze reputation across all platforms with{' '}
                <span className="text-orange-500 font-bold">real-time intelligence</span>
              </p>
            </div>
            
            {/* Ultra-wide search container - Maximum width */}
            <div className="w-full max-w-none mx-auto px-0">
              <div 
                className={`relative w-full rounded-2xl transition-all duration-300 ${
                  isFocused 
                    ? 'shadow-2xl scale-[1.02] ring-4 ring-orange-500/20' 
                    : isHovered 
                      ? 'shadow-xl scale-[1.01]' 
                      : 'shadow-lg'
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                  border: '2px solid rgba(255, 101, 0, 0.2)',
                  minHeight: '90px',
                  width: '100%',
                  maxWidth: 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Dark mode overlay */}
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:opacity-95 rounded-2xl"></div>
                
                <div className="relative z-10 flex items-center space-x-8 p-8">
                  {/* Search icon */}
                  <div className="flex-shrink-0">
                    {searchMutation.isPending ? (
                      <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="h-8 w-8 text-orange-500 drop-shadow-sm" />
                    )}
                  </div>
                  
                  {/* Search input - maximum width utilization */}
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search any wallet address, ENS domain, or social handle..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="flex-1 bg-transparent border-none text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-2xl font-medium py-6"
                    style={{
                      minWidth: '0',
                      width: '100%',
                      maxWidth: 'none',
                      flex: '1 1 auto'
                    }}
                  />
                  
                  {/* Search button */}
                  <Button
                    onClick={handleSearch}
                    disabled={!query.trim() || searchMutation.isPending}
                    className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Zap className="h-6 w-6 mr-2" />
                    SCAN
                  </Button>
                </div>
              </div>
              
              {/* Hint text */}
              {!query && !isFocused && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
                  Enter any wallet address or social handle to analyze trust reputation
                </div>
              )}
              
              {/* Search suggestions */}
              <div className="relative mt-4">
                <SearchSuggestions
                  query={query}
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions}
                  onVisibilityChange={setShowSuggestions}
                />
              </div>
            </div>
            
            {/* Platform indicators */}
            {!showSuggestions && (
              <div className="flex items-center justify-center space-x-8 mt-8">
                {[
                  { Icon: SiEthereum, label: 'Ethereum', color: 'text-blue-500' },
                  { Icon: SiFarcaster, label: 'Farcaster', color: 'text-purple-500' },
                  { Icon: SiX, label: 'Twitter/X', color: 'text-gray-800 dark:text-white' },
                  { Icon: SiDiscord, label: 'Discord', color: 'text-indigo-500' },
                  { Icon: SiTelegram, label: 'Telegram', color: 'text-blue-400' }
                ].map(({ Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center space-y-2 group cursor-pointer">
                    <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <LoadingOverlay 
        isVisible={searchMutation.isPending} 
        message="Scanning trust network..."
      />
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}