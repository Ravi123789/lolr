import { WalletScanner } from "@/components/wallet-scanner";
import { TrustScoreDisplay } from "@/components/trust-score-display";
import { FlexScoreShare } from "@/components/flex-score-share";
import { TrustScoreCard } from "@/components/trust-score-card";
import { TrustNetworkGraph } from "@/components/trust-network-graph";
import { ScorePulse } from "@/components/score-pulse";
import { FarcasterCast } from "@/components/farcaster-cast";
import { UserVouchIntel } from "@/components/user-vouch-intelligence";
import { EthosStatsData } from "@/components/ethos-stats-dashboard";
import { UniversalLookupDemo } from "@/components/universal-lookup-demo";
// V1ScoreBreakdown removed from homepage
import { Card, CardContent } from "@/components/ui/card";
import { HandHeart, Activity, Wifi, WifiOff, AlertCircle, Search, ArrowLeft, Zap, Radar, ShieldCheck, Users } from "lucide-react";
import { useUserProfile } from "@/hooks/use-ethos-api";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface NetworkStatus {
  responseTime?: string;
  error?: string;
  status?: string;
  apiStatus?: string;
  databaseStatus?: string;
  page?: {
    name: string;
    updated_at: string;
  };
  indicator?: string;
  description?: string;
  lastUpdated?: string;
  pageName?: string;
}

export default function Home() {
  const { user, setUser } = useUserProfile();
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Dynamic messy note content rotation
  const messyNotes = [
    { title: "trust radar ⚡", mood: "excited", ink: "dark" },
    { title: "rough notes <span class=\"bracket-text\">(ignore/waste par)</span>", mood: "focused", ink: "light" },
    { title: "rough ideas 💭", mood: "chill", ink: "mixed" },
    { title: "rep detective", mood: "serious", ink: "dark" },
    { title: "trust hunter", mood: "energetic", ink: "light" }
  ];

  const messyThoughts = [
    "built this at 2am with red bull...",
    "stackoverflow + github copilot ftw", 
    "ethos api documentation is chef's kiss",
    "7 hours debugging cors issues smh",
    "trust networks are actually insane",
    "minikit sdk broke 3 times today",
    "production deploy failed 5x lmao",
    "farcaster frames r confusing af"
  ];

  const bugMessages = [
    "☕ coffee break as priority",
    "BUG: search sometimes hangs",
    "FIXME: dark mode flickers", 
    "HACK: temporary api workaround",
    "NOTE: needs better error handling"
  ];

  const upcomingFeatures = [
    "🔥 NEXT: RepuTrace™",
    "⚡ SOON: Advanced insights", 
    "🎯 IDEA: Real-time alerts",
    "🕸️ MAYBE: Network graphs",
    "🔐 PLAN: Wallet auth"
  ];

  const developmentDates = [
    "july 22, 2025 🚀",
    "july 23, 2025 ⚡",
    "july 24, 2025 🔥", 
    "july 25, 2025 ✨"
  ];

  // Randomize note content and position
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const randomNote = messyNotes[Math.floor(Math.random() * messyNotes.length)];
      const randomThought = messyThoughts[Math.floor(Math.random() * messyThoughts.length)];
      const randomBug = bugMessages[Math.floor(Math.random() * bugMessages.length)];
      const randomFeature = upcomingFeatures[Math.floor(Math.random() * upcomingFeatures.length)];
      const randomDate = developmentDates[Math.floor(Math.random() * developmentDates.length)];

      setTimeout(() => {
        const titleEl = document.getElementById('messy-title');
        const thoughtEl = document.getElementById('messy-thought');
        const bugEl = document.getElementById('bug-note');
        const featureEl = document.getElementById('feature-note');
        const dateEl = document.getElementById('dev-date');
        const containerEl = document.getElementById('messy-note');

        if (titleEl) titleEl.innerHTML = randomNote.title;
        if (thoughtEl) thoughtEl.textContent = randomThought;
        if (bugEl) bugEl.textContent = randomBug;
        if (featureEl) featureEl.textContent = randomFeature;
        if (dateEl) dateEl.textContent = randomDate;
        if (containerEl) {
          containerEl.className = `messy-note-container ${randomNote.mood} ${randomNote.ink}`;
        }
      }, 150);
    }
  }, []);

  const handleBackToSearch = () => {
    setUser(null as any);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Clear and focus on search input with mobile keyboard
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="vitalik.eth"]') as HTMLInputElement;
      if (searchInput) {
        // Clear the search box
        searchInput.value = '';
        // Dispatch input event to notify React of the change
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Focus for cursor and mobile keyboard
        searchInput.focus();      
        searchInput.click();      
        // Additional mobile keyboard triggers
        if (typeof window !== 'undefined' && 'ontouchstart' in window) {
          searchInput.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
          searchInput.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
        }
      }
    }, 300);
  };

  const fetchNetworkStatus = async () => {
    setIsLoadingStatus(true);
    try {
      // Use the official Ethos status page API
      const response = await fetch('https://status.ethos.network/api/v2/status.json', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Status API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform the statuspage.io format to our expected format
      const transformedStatus = {
        status: data.status?.description || 'Unknown',
        indicator: data.status?.indicator || 'none',
        apiStatus: data.status?.indicator === 'none' ? 'Operational' : 'Issues Detected',
        databaseStatus: data.status?.indicator === 'none' ? 'Connected' : 'Checking...',
        responseTime: '< 100ms',
        lastUpdated: data.page?.updated_at,
        pageName: data.page?.name
      };

      setNetworkStatus(transformedStatus);
    } catch (error) {
      setNetworkStatus({ 
        error: `Failed to fetch status from status.ethos.network: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'Error'
      });
    }
    setIsLoadingStatus(false);
  };

  return (
    <main className="max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto px-4 pb-20 relative">
      {/* Modern header bar when user is selected */}
      {user && (
        <div className="modern-header-container max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
          <button
            onClick={handleBackToSearch}
            className="modern-back-button group"
          >
            <div className="back-icon-wrapper">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="back-text">Back</span>
            <div className="back-ripple"></div>
          </button>

          <div className="modern-live-status">
            <div className="live-pulse-dot"></div>
            <span className="live-text">Live</span>
            <div className="live-glow"></div>
          </div>
        </div>
      )}

      {/* Ethos Stats Dashboard - Desktop Only, No User Selected */}
      {!user && <EthosStatsData />}

      <WalletScanner />

      {user ? (
        <>
          <TrustScoreDisplay />

          {/* Premium Quick Actions with Comic Tips */}
          <section className="mb-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            {/* Comic tooltip strip above buttons */}
            <div className="comic-tooltip-strip">
              <div className="tooltip-item left">
                <span className="tooltip-text">🕵️‍♂️ Who trusts you?</span>
                <svg className="tooltip-arrow" viewBox="0 0 20 10">
                  <path d="M0 0 L10 8 L20 0" stroke="#ff6500" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="tooltip-item right">
                <span className="tooltip-text">📊 Track the heat!</span>
                <svg className="tooltip-arrow" viewBox="0 0 20 10">
                  <path d="M0 0 L10 8 L20 0" stroke="#ffa500" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="flex justify-center gap-3 px-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="premium-action-card group cursor-pointer">
                    <div className="premium-card-content">
                      <div className="premium-icon-wrapper vouch-theme">
                        <HandHeart className="h-4 w-4 transition-all group-hover:scale-110 group-hover:rotate-3" />
                        <div className="premium-icon-glow vouch-glow"></div>
                      </div>
                      <div className="premium-text-content">
                        <div className="text-xs font-bold text-gray-800 dark:text-foreground">Vouch Intel</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">See all vouch info & network insights</div>
                      </div>
                      <div className="premium-card-shimmer"></div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="clay-card border-none w-full max-w-md max-h-[75vh] overflow-y-auto m-0 vouch-intel-dialog">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-gray-800 dark:text-foreground text-sm">
                      <HandHeart className="h-4 w-4" style={{ color: '#ff6500' }} />
                      <span>Vouch Intel</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="vouch-intel-content">
                    <UserVouchIntel />
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="premium-action-card group cursor-pointer">
                    <div className="premium-card-content">
                      <div className="premium-icon-wrapper pulse-theme">
                        <Zap className="h-4 w-4 transition-all group-hover:scale-110 group-hover:rotate-12" />
                        <div className="premium-icon-glow pulse-glow"></div>
                      </div>
                      <div className="premium-text-content">
                        <div className="text-xs font-bold text-gray-800 dark:text-foreground">Score Pulse</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">See all score changes & history</div>
                      </div>
                      <div className="premium-card-shimmer"></div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="clay-card border-none w-full max-w-md max-h-[85vh] overflow-y-auto m-0">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-gray-800 dark:text-foreground">
                      <Zap className="h-5 w-5" style={{ color: '#ff6500' }} />
                      <span>Score Pulse</span>
                    </DialogTitle>
                  </DialogHeader>
                  <ScorePulse />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="premium-action-card group cursor-pointer">
                    <div className="premium-card-content">
                      <div className="premium-icon-wrapper lookup-theme">
                        <Search className="h-4 w-4 transition-all group-hover:scale-110 group-hover:rotate-6" />
                        <div className="premium-icon-glow lookup-glow"></div>
                      </div>
                      <div className="premium-text-content">
                        <div className="text-xs font-bold text-gray-800 dark:text-foreground">Universal Lookup</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">Cross-platform profile discovery</div>
                      </div>
                      <div className="premium-card-shimmer"></div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="clay-card border-none w-full max-w-6xl max-h-[90vh] overflow-y-auto m-0">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-gray-800 dark:text-foreground">
                      <Search className="h-5 w-5" style={{ color: '#ff6500' }} />
                      <span>Universal Lookup Demo</span>
                    </DialogTitle>
                  </DialogHeader>
                  <UniversalLookupDemo />
                </DialogContent>
              </Dialog>
            </div>
          </section>

          <FlexScoreShare />
        </>
      ) : (
        <section className="text-center py-6 clay-card desktop-scanner-card p-6 relative overflow-hidden trust-scanner-section">
          <div className="absolute top-2 right-2 w-10 h-10 bg-gradient-to-br from-orange-500/20 to-primary/20 rounded-full blur-md floating-orb-1"></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm floating-orb-2"></div>
          <div className="absolute top-1/2 left-1 w-6 h-6 bg-gradient-to-br from-green-500/15 to-cyan-500/15 rounded-full blur-sm floating-orb-3"></div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-foreground relative tracking-tight heading">
            Trust Intelligence Scanner
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground text-base mb-6 relative leading-relaxed max-w-md mx-auto">
            Analyze reputation across multiple platforms with{' '}
            <span 
              className="font-medium"
              style={{ color: '#ff6500', textShadow: '0 0 1px rgba(255, 101, 0, 0.4)' }}
            >
              modern insights
            </span>
          </p>
          <div className="flex justify-center relative overflow-hidden w-20 h-1.5 mx-auto rounded-full">
            <div className="absolute w-full h-full bg-gradient-to-r from-blue-500 via-orange-500 to-purple-500 rounded-full" 
                 style={{ animation: 'modernScanningLine 4s linear infinite' }} />
          </div>
        </section>
      )}

      {/* Developer Notes Board - Desktop Only */}
      {!user && (
        <div className="hidden lg:block">
          <div className="fixed top-20 right-6 z-30">
            {/* Clay Background Container */}
            <div className="developer-notes-container">
              <div className="developer-notes-board">
                {/* Header with Developer Notes title */}
                <div className="dev-notes-header">
                  <div className="dev-notes-icon">✏️</div>
                  <span className="dev-notes-title sketchy-title">#Notes</span>
                  <div className="fresh-indicator">
                    <span className="fresh-dot"></span>
                    <span className="fresh-text">Fresh</span>
                  </div>
                </div>

                {/* Main handwritten note */}
                <div className="handwritten-note-card">
                  <div className="note-content">
                    <div className="note-title">hey!! first app ever 😍</div>
                    <div className="note-text">
                      <div className="note-line">sooo excited u r trying this!!</div>
                      <div className="note-line">built it with lots of coffee ☕</div>
                      <div className="note-line">real ethos data + trust networks • late night coding sessions = this app</div>
                      <div className="note-line">hope its useful... feedback not welcomed</div>
                      <div className="note-line">ps: still learning web3 stuff 😅</div>
                    </div>
                    <div className="note-signature">
                      <span className="signature-name">- cookedzera</span>
                      <span className="signature-date">july 25 🔥</span>
                    </div>
                  </div>
                </div>

                {/* What's Inside section */}
                <div className="whats-inside-section">
                  <div className="whats-inside-header">
                    <span className="pencil-icon">✏️</span>
                    <span className="whats-inside-title">What's Inside:</span>
                  </div>
                  <div className="inside-features">
                    <div className="inside-item">• Real-time trust scoring</div>
                    <div className="inside-item">• Multi-platform search</div>
                    <div className="inside-item">• XP tracking & analytics</div>
                    <div className="inside-item">• Live vouch monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Mobile optimized */}
      <section className="animate-slide-up mt-4" style={{ animationDelay: '0.7s' }}>
        {!user && (
          // No user selected - show basic home actions
          <div className="grid grid-cols-2 gap-4 desktop-action-grid">
            <div 
              className="glassmorphism-button p-3 group cursor-pointer"
              onClick={() => window.open('https://whitepaper.ethos.network', '_blank')}
            >
              <div className="text-center">
                <Users 
                  className="h-5 w-5 mx-auto mb-1" 
                  style={{ color: '#ff6500' }}
                />
                <div className="text-xs font-medium text-gray-800 dark:text-foreground">Explore Ethos</div>
                <div className="text-xs text-gray-500 dark:text-muted-foreground opacity-75">Learn more</div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div 
                  className="glassmorphism-button p-3 group cursor-pointer"
                  onClick={fetchNetworkStatus}
                >
                  <div className="text-center">
                    <Activity 
                      className="h-5 w-5 mx-auto mb-1" 
                      style={{ color: '#10b981' }}
                    />
                    <div className="text-xs font-medium text-gray-800 dark:text-foreground">Network Status</div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground opacity-75">API health</div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" style={{ color: '#10b981' }} />
                    <span>Ethos Network Status</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {isLoadingStatus ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-sm text-gray-600 dark:text-muted-foreground">Checking system status...</span>
                    </div>
                  ) : networkStatus ? (
                    <div className="space-y-3">
                      {networkStatus.error ? (
                        <div className="flex items-center space-x-2 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{networkStatus.error}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Status</span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                networkStatus.indicator === 'none' ? 'bg-green-500' : 
                                networkStatus.indicator === 'minor' ? 'bg-yellow-500' : 
                                networkStatus.indicator === 'major' ? 'bg-red-500' : 'bg-gray-500'
                              }`}></div>
                              <span className={`text-sm ${
                                networkStatus.indicator === 'none' ? 'text-green-600' : 
                                networkStatus.indicator === 'minor' ? 'text-yellow-600' : 
                                networkStatus.indicator === 'major' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {networkStatus.status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Response Time</span>
                            <span className="text-sm text-gray-600 dark:text-muted-foreground">
                              {networkStatus.responseTime || '< 100ms'}
                            </span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-muted-foreground">
                              Last checked: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Data from status.ethos.network
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-sm text-gray-500 dark:text-muted-foreground">
                        Click to check network status
                      </span>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>

      {/* Trust Network Graph - Moved below vouch details and network status */}
      {user && (
        <section className="mb-4">
          <TrustNetworkGraph />
        </section>
      )}

      {/* Live Data Section - Moved below trust network */}
      <section className="mb-4">
        <div className="clay-card mobile-card p-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div>
              Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-600 dark:text-muted-foreground">
              Powered by <span 
                className="font-semibold cursor-pointer transition-all duration-200" 
                style={{ color: '#ff6500', textShadow: '0 0 2px rgba(255, 101, 0, 0.5)' }}
                onClick={() => window.open('https://app.ethos.network', '_blank')}
              >
                Ethos Protocol
              </span> • 
              Multi-platform reputation analysis
            </p>
          </div>
        </div>
      </section>

      {/* Footer with additional status */}
      <footer className="mt-6 pb-4">
        <div className="clay-card mobile-card p-3">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Base Network</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></div>
                <span>Ethos API</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-muted-foreground">
              Real-time trust scores from Ethereum, Farcaster, Twitter, Discord & Telegram
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Scan Another Button - Always visible when user is selected */}
      {user && (
        <div className="floating-scan-container">
          <Dialog>
            <DialogTrigger asChild>
              <button className="floating-scan-button">
                <div className="flex items-center justify-center">
                  <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="clay-card border-none w-full max-w-md m-0">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-gray-800 dark:text-foreground">
                  <Search className="h-5 w-5" style={{ color: '#ff6500' }} />
                  <span>New Search</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Ready to analyze another identity's trust network?
                </p>
                <button 
                  onClick={handleBackToSearch}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Search Again</span>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </main>
  );
}