import { sdk } from '@farcaster/miniapp-sdk';

// Initialize Farcaster SDK
export const initializeFarcasterSDK = async () => {
  try {
    // Check if we're in a Farcaster Mini App environment
    if (typeof window !== 'undefined') {
      // Wait for app to be fully loaded and then signal ready
      await sdk.actions.ready();
      console.log('Farcaster SDK initialized successfully');
    }
  } catch (error) {
    console.log('Not in Farcaster environment or SDK unavailable:', error);
  }
};

// Get context information if available
export const getFarcasterContext = () => {
  try {
    return sdk.context;
  } catch (error) {
    console.log('Farcaster context not available:', error);
    return null;
  }
};

// Helper to check if we're in a Mini App
export const isInMiniApp = () => {
  try {
    return !!sdk.context;
  } catch {
    return false;
  }
};