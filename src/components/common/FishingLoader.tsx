interface FishingLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FishingLoader({ message = 'Cargando...', size = 'md' }: FishingLoaderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      {/* Fishing Animation Container */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Water waves */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden">
          <svg viewBox="0 0 100 20" className="w-full h-full">
            <path
              d="M0,10 Q25,0 50,10 T100,10 V20 H0 Z"
              fill="rgba(59, 130, 246, 0.2)"
              className="animate-wave"
            />
            <path
              d="M0,12 Q25,5 50,12 T100,12 V20 H0 Z"
              fill="rgba(59, 130, 246, 0.3)"
              className="animate-wave-slow"
            />
          </svg>
        </div>

        {/* Fishing rod */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {/* Rod */}
          <line
            x1="20"
            y1="80"
            x2="50"
            y2="20"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Rod handle */}
          <line
            x1="15"
            y1="85"
            x2="25"
            y2="75"
            stroke="#654321"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fishing line */}
          <path
            d="M50,20 Q70,40 65,70"
            stroke="#666"
            strokeWidth="1"
            fill="none"
            className="animate-fishing-line"
          />
          {/* Hook/Lure */}
          <g className="animate-lure">
            <ellipse cx="65" cy="72" rx="4" ry="2" fill="#FF6B6B" />
            <path d="M65,74 Q67,78 65,80" stroke="#999" strokeWidth="1" fill="none" />
          </g>
        </svg>

        {/* Fish */}
        <svg
          viewBox="0 0 40 20"
          className="absolute bottom-2 right-2 w-10 h-5 animate-fish-swim"
        >
          <ellipse cx="15" cy="10" rx="12" ry="7" fill="#3B82F6" />
          <polygon points="27,10 35,3 35,17" fill="#3B82F6" />
          <circle cx="8" cy="8" r="2" fill="white" />
          <circle cx="8" cy="8" r="1" fill="#1E3A5F" />
          <ellipse cx="15" cy="13" rx="6" ry="2" fill="#60A5FA" opacity="0.5" />
        </svg>
      </div>

      {/* Loading text */}
      <p className={`${textSize[size]} text-gray-600 font-medium animate-pulse`}>
        {message}
      </p>
    </div>
  )
}
