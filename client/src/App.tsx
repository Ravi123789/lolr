import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { SimpleRadarLogo } from "@/components/holographic-logo";
import { useEffect } from "react";
import { miniAppManager } from "@/utils/miniapp-detection";
import { initializeFarcasterSDK } from "@/utils/farcaster-sdk";

import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function ThemeToggle() {
  const { theme, setTheme, triggerThemeAnimation } = useTheme();

  const handleThemeChange = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Trigger cool ripple animation from button position
    triggerThemeAnimation(x, y);
    
    // Change theme
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeChange}
      className="h-8 w-8 px-0 transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 ease-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}



function AppHeader() {
  return (
    <div className="w-full flex justify-center px-4 mb-3">
      <header className="clay-card w-full max-w-sm md:w-[40vw] md:min-w-[500px] md:max-w-none">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SimpleRadarLogo className="w-5 h-5" />
            <h1 className="brand-title">
              EthosRadar
            </h1>
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize Mini App SDKs
    const initializeApp = async () => {
      try {
        const context = await miniAppManager.initialize();
        await initializeFarcasterSDK();
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ethosradar-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <AppHeader />
            <div className="mobile-container">
              <Router />
            </div>
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
