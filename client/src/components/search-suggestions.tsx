import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Shield, AlertTriangle, Minus, Star, Gem } from "lucide-react";

interface SearchSuggestion {
  userkey: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  score: number;
  description: string;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: SearchSuggestion) => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  selectedPlatform?: string;
}

// Official Ethos tier system with icons for quick visual recognition
const getTierIcon = (score: number) => {
  if (score >= 2000) return { icon: Gem, color: 'text-purple-500 dark:text-purple-400', tier: 'Exemplary' };
  if (score >= 1600) return { icon: Star, color: 'text-orange-500 dark:text-orange-400', tier: 'Reputable' };
  if (score >= 1200) return { icon: Minus, color: 'text-blue-500 dark:text-blue-400', tier: 'Neutral' };
  if (score >= 800) return { icon: AlertTriangle, color: 'text-yellow-500 dark:text-yellow-400', tier: 'Questionable' };
  return { icon: Shield, color: 'text-gray-500 dark:text-gray-400', tier: 'Untrusted' };
};

interface SearchResponse {
  success: boolean;
  data: SearchSuggestion[];
  total: number;
}

export function SearchSuggestions({ 
  query, 
  onSelect, 
  isVisible, 
  onVisibilityChange, 
  selectedPlatform = 'auto' 
}: SearchSuggestionsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['/api/search-suggestions', query],
    queryFn: async () => {
      const params = new URLSearchParams({ query });
      const response = await fetch(`/api/search-suggestions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      return response.json();
    },
    enabled: isVisible && query.length > 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onVisibilityChange(false);
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onVisibilityChange]);

  if (!isVisible || query.length <= 1) {
    return null;
  }

  const handleSelect = (suggestion: SearchSuggestion) => {
    onSelect(suggestion);
    onVisibilityChange(false);
  };

  const suggestions = data?.data || [];

  return (
    <div
      ref={dropdownRef}
      className="relative z-[2000] clay-card max-h-64 overflow-y-auto suggestion-dropdown"
      style={{ zIndex: 2000 }}
    >
      {isLoading && (
        <div className="flex items-center justify-center p-3">
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-2 text-orange-500" />
          <span className="text-xs text-gray-600 dark:text-gray-300">Searching...</span>
        </div>
      )}

      {error && (
        <div className="p-3 text-xs text-red-600 dark:text-red-400 text-center">
          Error loading suggestions
        </div>
      )}

      {!isLoading && !error && suggestions.length === 0 && (
        <div className="p-3 text-xs text-gray-600 dark:text-gray-300 text-center">
          No results found for "{query}"
        </div>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <div className="py-0">
          {suggestions.slice(0, 6).map((suggestion: SearchSuggestion, index: number) => (
            <div
              key={suggestion.userkey}
              onClick={() => handleSelect(suggestion)}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50/60 hover:to-amber-50/40 dark:hover:from-orange-950/30 dark:hover:to-amber-950/20 transition-all duration-300 suggestion-item border-b border-gray-100/50 dark:border-gray-700/30 last:border-b-0 hover:scale-[1.02] hover:shadow-sm"
            >
              <Avatar className="h-7 w-7 flex-shrink-0 ring-1 ring-gray-200/60 dark:ring-gray-700/50">
                <AvatarImage src={suggestion.avatarUrl} alt={suggestion.displayName} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-750">
                  <User className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {suggestion.displayName}
                    </div>
                    {(() => {
                      const tierInfo = getTierIcon(suggestion.score);
                      const IconComponent = tierInfo.icon;
                      return (
                        <div className="flex items-center gap-1" title={`${tierInfo.tier} (${suggestion.score})`}>
                          <IconComponent className={`h-3.5 w-3.5 ${tierInfo.color}`} />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-right flex flex-col items-end">
                    {(() => {
                      const tierInfo = getTierIcon(suggestion.score);
                      const getScoreCardStyle = (score: number) => {
                        if (score >= 2000) return {
                          bg: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50',
                          border: 'border-purple-200/60 dark:border-purple-700/50',
                          scoreColor: 'text-purple-700 dark:text-purple-300',
                          divider: 'bg-purple-300 dark:bg-purple-600',
                          tierColor: 'text-purple-600 dark:text-purple-400'
                        };
                        if (score >= 1600) return {
                          bg: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50',
                          border: 'border-orange-200/60 dark:border-orange-700/50',
                          scoreColor: 'text-orange-700 dark:text-orange-300',
                          divider: 'bg-orange-300 dark:bg-orange-600',
                          tierColor: 'text-orange-600 dark:text-orange-400'
                        };
                        if (score >= 1200) return {
                          bg: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50',
                          border: 'border-blue-200/60 dark:border-blue-700/50',
                          scoreColor: 'text-blue-700 dark:text-blue-300',
                          divider: 'bg-blue-300 dark:bg-blue-600',
                          tierColor: 'text-blue-600 dark:text-blue-400'
                        };
                        if (score >= 800) return {
                          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50',
                          border: 'border-yellow-200/60 dark:border-yellow-700/50',
                          scoreColor: 'text-yellow-700 dark:text-yellow-300',
                          divider: 'bg-yellow-300 dark:bg-yellow-600',
                          tierColor: 'text-yellow-600 dark:text-yellow-400'
                        };
                        return {
                          bg: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50',
                          border: 'border-gray-200/60 dark:border-gray-700/50',
                          scoreColor: 'text-gray-700 dark:text-gray-300',
                          divider: 'bg-gray-300 dark:bg-gray-600',
                          tierColor: 'text-gray-600 dark:text-gray-400'
                        };
                      };
                      
                      const cardStyle = getScoreCardStyle(suggestion.score);
                      
                      return (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shadow-sm ${cardStyle.bg} ${cardStyle.border}`}>
                          <div className={`text-sm font-bold ${cardStyle.scoreColor}`}>
                            {suggestion.score}
                          </div>
                          <div className={`w-px h-3 ${cardStyle.divider}`}></div>
                          <div className={`text-xs font-semibold ${cardStyle.tierColor} uppercase tracking-wider`}>
                            {tierInfo.tier}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
                  @{suggestion.username}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}