export function SimpleRadarLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full"
        fill="none"
      >
        <defs>
          <linearGradient id="clay-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(25, 95%, 53%)" />
            <stop offset="100%" stopColor="hsl(27, 96%, 61%)" />
          </linearGradient>
          <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0" />
          </radialGradient>
          {/* Animated radar sweep */}
          <radialGradient id="sweep-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="70%" stopColor="hsl(27, 96%, 61%)" stopOpacity="0.4">
              <animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(25, 95%, 53%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Glowing background */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="url(#glow-gradient)"
          opacity="0.5"
        />
        
        {/* Main radar circle */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="url(#clay-gradient)"
          strokeWidth="2"
        />
        
        {/* Inner radar rings with pulse */}
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke="url(#clay-gradient)"
          strokeWidth="1.5"
          opacity="0.6"
        >
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="none"
          stroke="url(#clay-gradient)"
          strokeWidth="1"
          opacity="0.4"
        >
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Animated radar sweep */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="url(#sweep-gradient)"
          opacity="0.3"
        />
        
        {/* Cross lines */}
        <line
          x1="16"
          y1="6"
          x2="16"
          y2="26"
          stroke="url(#clay-gradient)"
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="6"
          y1="16"
          x2="26"
          y2="16"
          stroke="url(#clay-gradient)"
          strokeWidth="1"
          opacity="0.7"
        />
        
        {/* Trust indicators with breathing animation */}
        <circle cx="20" cy="12" r="1.5" fill="hsl(142, 76%, 36%)" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;1.8;1.5" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="12" cy="20" r="1.5" fill="hsl(25, 95%, 53%)" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;1.8;1.5" dur="4s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="22" cy="22" r="1" fill="hsl(217, 91%, 60%)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="r" values="1;1.3;1" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

