import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Search, Users, ExternalLink, Hash, CheckCircle } from 'lucide-react';
import { SiX, SiDiscord, SiTelegram } from 'react-icons/si';

interface UniversalLookupResult {
  success: boolean;
  query: string;
  profileId: number;
  summary: {
    displayName: string;
    username: string;
    score: number;
    primaryAddress: string;
  };
  attestations: any[];
  platformIds: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    farcaster: string | null;
  };
  detailedPlatformData: {
    twitter?: any;
    discord?: any;
    telegram?: any;
    farcaster?: any;
  };
  platformSummary: {
    [key: string]: {
      id: string;
      username: string;
      hasDetailedData: boolean;
      attestationHash: string;
    };
  };
  totalPlatforms: number;
  attestationCount: number;
}

export function UniversalLookupDemo() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<UniversalLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/universal-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Failed to perform lookup');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <SiX className="w-4 h-4" />;
      case 'discord': return <SiDiscord className="w-4 h-4 text-violet-500" />;
      case 'telegram': return <SiTelegram className="w-4 h-4 text-blue-500" />;
      case 'farcaster': return <div className="w-4 h-4 bg-purple-500 rounded-full" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const getTierInfo = (score: number) => {
    if (score >= 2000) return { tier: 'Exemplary', color: 'bg-purple-500', emoji: '💎' };
    if (score >= 1600) return { tier: 'Reputable', color: 'bg-green-500', emoji: '⭐' };
    if (score >= 1200) return { tier: 'Neutral', color: 'bg-blue-500', emoji: '⚖️' };
    if (score >= 800) return { tier: 'Questionable', color: 'bg-yellow-500', emoji: '⚠️' };
    return { tier: 'Untrusted', color: 'bg-red-500', emoji: '🛡️' };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Universal Ethos Lookup
          </CardTitle>
          <CardDescription>
            Search any username to discover all connected platforms and get comprehensive profile data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Try these examples:</span>
            {['cookedzera', 'degenkid4'].map(example => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter any username from Twitter, Discord, Telegram, or Farcaster"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              className="flex-1"
            />
            <Button 
              onClick={handleLookup} 
              disabled={loading || !query.trim()}
              className="px-6"
            >
              {loading ? 'Searching...' : 'Lookup'}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Profile Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={result.detailedPlatformData.twitter?.avatarUrl} 
                    alt={result.summary.displayName} 
                  />
                  <AvatarFallback>{result.summary.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{result.summary.displayName}</h3>
                  <p className="text-muted-foreground">@{result.summary.username}</p>
                </div>
                <div className="ml-auto">
                  {(() => {
                    const tier = getTierInfo(result.summary.score);
                    return (
                      <Badge className={`${tier.color} text-white`}>
                        {tier.emoji} {tier.tier} ({result.summary.score})
                      </Badge>
                    );
                  })()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Profile ID</p>
                  <p className="font-mono font-medium">{result.profileId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Connected Platforms</p>
                  <p className="font-medium">{result.totalPlatforms} platforms</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attestations</p>
                  <p className="font-medium">{result.attestationCount} verified</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Primary Address</p>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {result.summary.primaryAddress}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Platform Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.platformSummary).map(([platform, data]) => (
              <Card key={platform}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getPlatformIcon(platform)}
                    <span className="capitalize">{platform}</span>
                    {data.hasDetailedData && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="font-mono text-sm">{data.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Username:</span>
                      <span className="font-medium">@{data.username}</span>
                    </div>
                  </div>
                  
                  {data.hasDetailedData && result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData] && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">XP:</span>
                          <span className="ml-1 font-medium">
                            {result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData]?.xpTotal?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Streak:</span>
                          <span className="ml-1 font-medium">
                            {result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData]?.xpStreakDays || 0}d
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reviews:</span>
                          <span className="ml-1 font-medium">
                            {result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData]?.stats?.review?.received?.positive || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vouches:</span>
                          <span className="ml-1 font-medium">
                            {result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData]?.stats?.vouch?.received?.count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a 
                        href={`https://etherscan.io/tx/${data.attestationHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Attestation
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Raw Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">API Response Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-40">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}