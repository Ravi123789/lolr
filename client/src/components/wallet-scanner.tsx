import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Zap } from "lucide-react";
import { SiEthereum, SiFarcaster, SiX, SiDiscord, SiTelegram } from "react-icons/si";
import { useSearchUser, useUserProfile } from "@/hooks/use-ethos-api";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SearchSuggestions } from "@/components/search-suggestions";

const SEARCH_TYPES = [
  { 
    type: 'auto', 
    label: 'Auto', 
    icon: '🔍',
    description: 'Smart detection',
    placeholder: 'vitalik.eth, @cookedzera, 0x123...'
  },
  { 
    type: 'address', 
    label: 'Ethereum', 
    icon: 'Ξ',
    description: 'Addresses & ENS',
    placeholder: '0x123... or vitalik.eth'
  },
  { 
    type: 'farcaster', 
    label: 'Farcaster', 
    icon: 'FC',
    description: 'Usernames & IDs',
    placeholder: 'dwr.eth or fid:3'
  },
  { 
    type: 'twitter', 
    label: 'Twitter/X', 
    icon: '𝕏',
    description: 'Handles & IDs',
    placeholder: '@vitalikbuterin or ID'
  },
  { 
    type: 'discord', 
    label: 'Discord', 
    icon: 'DC',
    description: 'Users & Tags',
    placeholder: 'user#1234 or ID'
  },
  { 
    type: 'telegram', 
    label: 'Telegram', 
    icon: 'TG',
    description: 'Handles & IDs',
    placeholder: '@username or ID'
  },
];

export function WalletScanner() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("auto");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const searchMutation = useSearchUser();
  const { user, setUser } = useUserProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Show compact version when user data is loaded
  const isCompactMode = !!user;

  const selectedTypeInfo = SEARCH_TYPES.find(t => t.type === selectedType) || SEARCH_TYPES[0];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setShowSuggestions(false);

    const result = await searchMutation.mutateAsync({
      query: query.trim(),
      searchType: selectedType === 'auto' ? undefined : selectedType,
    });

    if (result.success && result.data) {
      setUser(result.data);
    }
  };

  const handleSuggestionSelect = async (suggestion: { userkey: string; displayName: string; username: string; avatarUrl?: string; score?: number; description?: string }) => {
    setQuery(suggestion.displayName || suggestion.username || suggestion.userkey);
    setShowSuggestions(false);
    
    // Convert suggestion directly to user object with basic data, stats will be fetched separately
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
    // Delay hiding suggestions to allow for clicks
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
        <div className="modern-compact-search relative overflow-hidden">
          {/* Subtle background elements for compact search */}
          <div className="absolute top-1 right-2 w-4 h-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-sm"></div>
          
          <div className="search-input-wrapper">
            <div className="search-icon-container">
              {searchMutation.isPending ? (
                <div className="loading-spinner"></div>
              ) : (
                <Search className="search-icon" />
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
                className="modern-search-input"
                style={{ 
                  fontSize: '15px',
                  color: 'white',
                  textShadow: '0 0 2px rgba(255, 255, 255, 0.3)'
                }}
              />            <Button
              onClick={handleSearch}
              disabled={!query.trim() || searchMutation.isPending}
              className="modern-search-btn"
              size="sm"
            >
              <Zap className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Hint text for compact mode - only shown when search box is empty and not focused */}
          {!query && !isFocused && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
              <span>Enter any wallet or handle to check trust score</span>
            </div>
          )}
          
          {/* Compact suggestions */}
          <div className="relative">
            <SearchSuggestions
              query={query}
              onSelect={handleSuggestionSelect}
              isVisible={showSuggestions}
              onVisibilityChange={setShowSuggestions}
            />
          </div>
        </div>
        <LoadingOverlay 
          isVisible={searchMutation.isPending} 
          message="Scanning trust network..."
        />
      </>
    );
  }

  // Full search interface with responsive design - Enhanced for desktop, original for mobile
  return (
    <>
      <section className="py-3 md:py-4 animate-fade-in">
        <div className="clay-card p-3 md:p-4 lg:p-4 mb-3 md:mb-4 relative overflow-hidden w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          {/* Subtle background elements */}
          <div className="absolute top-3 right-4 w-6 h-6 md:top-8 md:right-12 md:w-12 md:h-12 bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-full blur-sm md:blur-md"></div>
          <div className="absolute bottom-3 left-5 w-4 h-4 md:bottom-8 md:left-10 md:w-8 md:h-8 bg-gradient-to-br from-amber-500/8 to-yellow-500/5 rounded-full blur-sm md:blur-md"></div>
          
          {/* Responsive header - simple on mobile, handwritten comic style on desktop */}
          <div className="md:text-center mb-2 md:mb-1 relative z-10">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-2 md:hidden">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white heading">
                  Trust Scanner
                </h2>
              </div>
            </div>
            
            {/* Desktop header - redesigned with perfect spacing and 2D handwritten style */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-1 w-full px-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg logo-pulse-animation">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap tracking-tight heading">
                    Trust Scanner
                  </h2>
                </div>
                <div className="relative handwritten-badge-container">
                  <div className="px-2 py-1 bg-black rounded-md handwritten-badge flex-shrink-0 shadow-lg border border-gray-700/30">
                    <span className="text-[10px] text-white font-medium whitespace-nowrap">All platforms unified!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Responsive Search Bar - compact on mobile, large on desktop */}
          <div className="relative mb-2 md:mb-1.5 z-10 desktop-search-wrapper">
            <div className={`relative clay-input-container desktop-search-container ${isFocused ? 'focused' : ''} ${isHovered ? 'hovered' : ''} ${!query ? 'empty-search-highlight' : ''}`}>
              {/* Search icon - responsive sizing */}
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                {searchMutation.isPending ? (
                  <div className="w-3.5 h-3.5 md:w-6 md:h-6 border-2 md:border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-colors duration-200 md:duration-300 text-white`} />
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
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full h-8 lg:h-12 xl:h-14 pl-10 lg:pl-16 pr-10 lg:pr-16 bg-transparent border-none text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm lg:text-base xl:text-lg font-medium text-center desktop-search-input"
                style={{
                  textDecoration: 'none',
                  textDecorationLine: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  letterSpacing: '0.03em',
                  caretColor: '#ff6500',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  color: 'white',
                  textShadow: '0 0 3px rgba(255, 255, 255, 0.4)'
                }}
              />
              
              {/* Responsive search button - small on mobile, large on desktop */}
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || searchMutation.isPending}
                className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-6 h-6 md:w-6 md:h-6 px-0 rounded-md md:rounded-lg border-0 transition-all duration-200 md:duration-300 ${
                  !query.trim() 
                    ? 'bg-gray-200 dark:bg-zinc-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 md:bg-gradient-to-r md:from-orange-500 md:to-red-500 md:hover:from-orange-600 md:hover:to-red-600 text-white shadow-sm md:shadow-lg hover:scale-105 md:hover:scale-110 active:scale-95 md:hover:shadow-xl'
                }`}
                size="sm"
              >
                <Zap className="h-3 w-3 md:h-3 md:w-3" />
              </Button>
            </div>
            
          </div>
          
          {/* Subtle hint text for new users - only shown when search box is empty and not focused */}
          {!query && !isFocused && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
              <span>Enter any wallet address or social handle to check trust score</span>
            </div>
          )}
          
          {/* Mobile-optimized suggestions */}
          <SearchSuggestions
            query={query}
            onSelect={handleSuggestionSelect}
            isVisible={showSuggestions}
            onVisibilityChange={setShowSuggestions}
          />
            
          {/* Modern Platform Support Indicators - redesigned with smooth animations */}
          {!showSuggestions && (
            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 relative z-[1] mt-2 md:mt-2 lg:mt-3">
              <div className="modern-platform-indicator ethereum-indicator group" title="Ethereum Addresses & ENS">
                <div className="platform-glow ethereum-glow"></div>
                <div className="platform-content">
                  <div className="platform-icon-modern">
                    <SiEthereum className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  <span className="platform-text">ETH</span>
                </div>
              </div>
              
              <div className="modern-platform-indicator farcaster-indicator group" title="Farcaster Profiles">
                <div className="platform-glow farcaster-glow"></div>
                <div className="platform-content">
                  <div className="platform-icon-modern">
                    <SiFarcaster className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  <span className="platform-text">FAR</span>
                </div>
              </div>
              
              <div className="modern-platform-indicator twitter-indicator group" title="Twitter/X Handles">
                <div className="platform-glow twitter-glow"></div>
                <div className="platform-content">
                  <div className="platform-icon-modern">
                    <SiX className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  <span className="platform-text">TW</span>
                </div>
              </div>
              
              <div className="modern-platform-indicator discord-indicator group" title="Discord Users">
                <div className="platform-glow discord-glow"></div>
                <div className="platform-content">
                  <div className="platform-icon-modern">
                    <SiDiscord className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  <span className="platform-text">DIS</span>
                </div>
              </div>
              
              <div className="modern-platform-indicator telegram-indicator group" title="Telegram Users">
                <div className="platform-glow telegram-glow"></div>
                <div className="platform-content">
                  <div className="platform-icon-modern">
                    <SiTelegram className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  <span className="platform-text">TEL</span>
                </div>
              </div>
            </div>
          )}

          {searchMutation.error && (
            <div className="mt-3 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/50 p-2 rounded-md border border-red-200 dark:border-red-800">
              {searchMutation.error.message}
            </div>
          )}
        </div>
      </section>
      <LoadingOverlay 
        isVisible={searchMutation.isPending} 
        message="Scanning trust network..."
      />
    </>
  );
}
