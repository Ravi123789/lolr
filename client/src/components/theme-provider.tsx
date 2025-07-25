import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  triggerThemeAnimation: (x: number, y: number) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  triggerThemeAnimation: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Force dark theme as default
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || "dark" // Always default to dark for new users
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const triggerThemeAnimation = useCallback((x: number, y: number) => {
    // Create ripple overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-ripple-overlay';
    overlay.style.setProperty('--ripple-x', `${x}px`);
    overlay.style.setProperty('--ripple-y', `${y}px`);
    document.body.appendChild(overlay);
    
    // Remove overlay after animation
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 600);
  }, []);

  // Force dark theme immediately on mount
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Immediately apply dark theme without any flash
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Store dark as default if nothing was previously stored
    const storedTheme = localStorage.getItem(storageKey);
    if (!storedTheme) {
      localStorage.setItem(storageKey, "dark");
    }
    
    setIsInitialized(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isInitialized) return;
    
    const root = window.document.documentElement;

    // Add theme switching animation only after initialization
    root.classList.add("theme-switching");
    
    // Remove old theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Remove animation class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 400);

    return () => clearTimeout(timeout);
  }, [theme, isInitialized]);

  const value = {
    theme,
    triggerThemeAnimation,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {isInitialized ? children : (
        // Loading screen with dark theme enforced
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
