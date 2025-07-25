// Mini App Platform Detection and Setup
import { sdk as farcasterSdk } from '@farcaster/miniapp-sdk';

export interface MiniAppContext {
  platform: 'farcaster' | 'base' | 'telegram' | 'web';
  user?: any;
  initialized: boolean;
}

export class MiniAppManager {
  private context: MiniAppContext = {
    platform: 'web',
    initialized: false
  };

  async initialize(): Promise<MiniAppContext> {
    try {
      // Detect Farcaster Mini App
      if (this.isFarcasterMiniApp()) {
        console.log('Initializing Farcaster Mini App...');
        await this.initializeFarcaster();
        this.context.platform = 'farcaster';
      }
      // Detect Base/Coinbase Mini App
      else if (this.isBaseMiniApp()) {
        console.log('Initializing Base Mini App...');
        await this.initializeBase();
        this.context.platform = 'base';
      }
      // Detect Telegram Mini App
      else if (this.isTelegramMiniApp()) {
        console.log('Initializing Telegram Mini App...');
        await this.initializeTelegram();
        this.context.platform = 'telegram';
      }
      // Default to web
      else {
        console.log('Running as web application');
        this.context.platform = 'web';
      }

      this.context.initialized = true;
      return this.context;
    } catch (error) {
      console.error('Mini App initialization failed:', error);
      this.context.platform = 'web';
      this.context.initialized = true;
      return this.context;
    }
  }

  private isFarcasterMiniApp(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for explicit Mini App URL patterns (recommended by Farcaster docs)
    const url = new URL(window.location.href);
    const isMiniAppPath = url.pathname.startsWith('/miniapp') || 
                          url.searchParams.get('miniApp') === 'true';
    
    // Check for Farcaster Mini App environment
    return (
      isMiniAppPath ||
      window.location.href.includes('farcaster') ||
      window.navigator.userAgent.includes('Farcaster') ||
      window.parent !== window // iframe detection
    );
  }

  private isBaseMiniApp(): boolean {
    // Check for Base/Coinbase Mini App environment  
    return (
      typeof window !== 'undefined' &&
      (window.location.href.includes('base.app') ||
        window.location.href.includes('coinbase') ||
        window.navigator.userAgent.includes('Base') ||
        window.navigator.userAgent.includes('Coinbase'))
    );
  }

  private isTelegramMiniApp(): boolean {
    // Check for Telegram Mini App environment
    return (
      typeof window !== 'undefined' &&
      (window.location.href.includes('telegram') ||
        window.navigator.userAgent.includes('Telegram') ||
        !!(window as any).Telegram?.WebApp)
    );
  }

  private async initializeFarcaster(): Promise<void> {
    try {
      // Initialize Farcaster SDK
      await farcasterSdk.actions.ready();
      console.log('Farcaster SDK initialized successfully');
      
      // Get user context if available
      try {
        const context = farcasterSdk.context;
        this.context.user = context;
        console.log('Farcaster user context:', context);
      } catch (userError) {
        console.log('No Farcaster user context available');
      }
    } catch (error) {
      console.error('Farcaster initialization error:', error);
      throw error;
    }
  }

  private async initializeBase(): Promise<void> {
    try {
      // Base/Coinbase Mini App uses same SDK as Farcaster
      await farcasterSdk.actions.ready();
      console.log('Base Mini App SDK initialized successfully');
      
      // Get user context if available
      try {
        const context = farcasterSdk.context;
        this.context.user = context;
        console.log('Base user context:', context);
      } catch (userError) {
        console.log('No Base user context available');
      }
    } catch (error) {
      console.error('Base initialization error:', error);
      throw error;
    }
  }

  private async initializeTelegram(): Promise<void> {
    try {
      // Initialize Telegram WebApp SDK
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        console.log('Telegram WebApp SDK initialized successfully');
        
        // Get user info from Telegram
        if (tg.initDataUnsafe?.user) {
          this.context.user = tg.initDataUnsafe.user;
          console.log('Telegram user:', this.context.user);
        }
      }
    } catch (error) {
      console.error('Telegram initialization error:', error);
      throw error;
    }
  }

  getContext(): MiniAppContext {
    return this.context;
  }

  async shareTrustScore(userProfile: any): Promise<void> {
    try {
      if (this.context.platform === 'farcaster') {
        await this.shareFarcasterCast(userProfile);
      } else if (this.context.platform === 'base') {
        await this.shareBaseCast(userProfile);
      } else if (this.context.platform === 'telegram') {
        await this.shareTelegramMessage(userProfile);
      } else {
        // Fallback to Web Share API
        await this.shareWeb(userProfile);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  private async shareFarcasterCast(userProfile: any): Promise<void> {
    const castText = `Just scanned ${userProfile.username || userProfile.address} on @ethosprotocol 🛡️\n\nTrust Score: ${userProfile.score}\nVouches: ${userProfile.vouchCount || 0}\n\nCheck your trust score: https://ethosradar.replit.app`;
    
    await farcasterSdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
  }

  private async shareBaseCast(userProfile: any): Promise<void> {
    const castText = `Trust network analysis complete 📊\n\n${userProfile.username || userProfile.address}\nScore: ${userProfile.score}\nNetwork: Base\n\nScan yours: https://ethosradar.replit.app`;
    
    await farcasterSdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
  }

  private async shareTelegramMessage(userProfile: any): Promise<void> {
    const shareText = `Trust Score Analysis 🔍\n\nUser: ${userProfile.username || userProfile.address}\nScore: ${userProfile.score}\n\nAnalyze your trust network: https://ethosradar.replit.app`;
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink(`https://t.me/share/url?url=https://ethosradar.replit.app&text=${encodeURIComponent(shareText)}`);
    }
  }

  private async shareWeb(userProfile: any): Promise<void> {
    if (navigator.share) {
      await navigator.share({
        title: 'EthosRadar Trust Score',
        text: `Trust Score for ${userProfile.username || userProfile.address}: ${userProfile.score}`,
        url: 'https://ethosradar.replit.app'
      });
    } else {
      // Fallback to clipboard
      const shareText = `Trust Score for ${userProfile.username || userProfile.address}: ${userProfile.score}\n\nhttps://ethosradar.replit.app`;
      await navigator.clipboard.writeText(shareText);
      console.log('Share text copied to clipboard');
    }
  }
}

export const miniAppManager = new MiniAppManager();